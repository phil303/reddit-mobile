import { parseRoute } from '@r/platform/navigationMiddleware';

import { getEventTracker } from 'lib/eventTracker';

import { themes } from 'app/constants';
import routes from 'app/router';

import CommentsPage from 'app/router/handlers/CommentsPage';
import PostsFromSubreddit from 'app/router/handlers/PostsFromSubreddit';
import SearchPage from 'app/router/handlers/SearchPage';
import { searchRequestSelector } from 'app/pages/SearchPage';
import { paramsToPostsListsId } from 'app/models/PostsList';

import {
  getBasePayload,
  convertId,
  getCurrentSubredditFromState,
  //getCurrentPostFromState,
  //getCurrentUserFromState,
  //getThingFromStateById,
} from './utils';

const { NIGHTMODE } = themes;

const LINK_LIMIT = 25;

// update with user activity once we have it
const INCLUDE_SORT_ORDER = [CommentsPage, PostsFromSubreddit, SearchPage];
const SORT_TYPE_CONFIDENCE = [CommentsPage];

export const buildSortOrderData = (state, handlerName) => {
  const { currentPage } = state.platform;
  const { queryParams } = currentPage;

  const data = {};

  if (INCLUDE_SORT_ORDER.includes(handlerName)) {
    if (currentPage.queryParams.sort === 'top') {
      data.target_filter_time = queryParams.time || 'all';
    }

    if (SORT_TYPE_CONFIDENCE.includes(handlerName)) {
      data.target_sort = queryParams.sort || 'confidence';
    } else {
      data.target_sort = queryParams.sort || 'hot';
      data.target_count = LINK_LIMIT;

      const query = queryParams;
      if (query.before) {
        data.target_before = query.before;
      }

      if (query.after) {
        data.target_after = query.after;
      }
    }

    if (handlerName === Search) {
      if (queryParams.q) {
        data.query_string = queryParams.q;
        data.query_string_length = queryParams.q.length;
      }

      const request = searchRequestSelector(state);
      // There are search-related events for which we won't have a request.
      if (request) {
        data.sr_listing = request.subreddits.map(sr => state.subreddits[sr.uuid].displayName);
        data.target_type = 'search_results';
      }
    }
  }

  return data;
};

export const buildSubredditData = (state) => {
  const subreddit = getCurrentSubredditFromState(state);

  if (subreddit) {
    return {
      sr_id: convertId(subreddit.name),
      sr_name: subreddit.uuid,
    };
  }

  return {};
};

export const buildLanguageData = () => {
  return { language: 'en' };
};

export const buildDNTData = () => {
  return { dnt: !!window.DO_NOT_TRACK };
};

export const buildCompactViewData = (state) => {
  return { compact_view: state.compact };
};

export const buildNightModeData = (state) => {
  if (state.theme === NIGHTMODE) {
    return { nightmode: true };
  }

  return {};
};

export const buildTargetData = (state, handlerName) => {
  switch (handlerName) {
    case CommentsPage: {
      // target_id
      // target_fullname
      return {
        target_type: 'comment',
      };
    }
    case SearchPage: {
      return {};
    }
    case PostsFromSubreddit: {
      const subreddit = getCurrentSubredditFromState(state);
      const target_id = convertId(subreddit.id);
      return {
        target_id,
        target_fullname: subreddit.name,
        target_type: 'listing',
        listing_name: subreddit.uuid,
      };
    }
    default: {
      return {};
    }
  }

  /*
  let target;

  // Try looking at the data to determine what the subject of the page is.
  // In order of priority, it could be a user profile, a listing, or a
  // subreddit.
  const target = (
    props.data.userProfile ||
      props.data.listing ||
        props.data.subreddit
  );

  if (target) {
    // Subreddit ids/names are swapped
    if (props.ctx.params.commentId) {
      data.target_id = convertId(props.ctx.params.commentId);
      data.target_fullname = `t1_${props.ctx.params.commentId}`;
      data.target_type = 'comment';
    } else if (target._type === 'Subreddit') {
      data.target_id = convertId(target.name);
      data.target_fullname = `${target.name}`;
      data.target_type = 'listing';
      data.listing_name = target.id;
    } else if (target._type === 'Link') {
      data.target_id = convertId(target.id);
      data.target_fullname = `t3_${target.id}`;
      data.target_type = 'link';
      if (target.selftext) {
        data.target_type = 'self';
      }
    } else if (target._type === 'Account') {
      data.target_id = convertId(target.id);
      data.target_name = target.name;
      data.target_fullname = `t2_${target.id}`;
      data.target_type = 'account';
    }

    if (target._type === 'Link') {
      data.target_url = target.url;
      data.target_url_domain = target.domain;
    }
  } else if (isOtherListing(props)) {
    // Fake subreddit, mark it as a listing
    data.target_type = 'listing';

    // explicitly check that this is the frontpage
    if (props.ctx.path === '/') {
      data.listing_name = 'frontpage';
    } else if (props.ctx.params.subreddit) {
      const subreddit = props.ctx.params.subreddit;
      if (subreddit.indexOf('+') !== -1) {
        data.listing_name = 'multi';
      } else {
        data.listing_name = subreddit;
      }
    } else if (props.ctx.params.multi) {
      data.listing_name = 'multi';
    }
  }
  */
};

export const dataRequiredForHandler = (state, handlerName) => {
  if (!waitForUser(state)) { return true; }

  switch (handlerName) {
    case CommentsPage.name: {
      return true;
      // subredditRequests and posts and comments
      // return state.commentsPages && state.subredditRequests && state.posts;
    }
    case SearchPage.name: {
      const request = searchRequestSelector(state);
      return request && !request.loading;
    }
    case PostsFromSubreddit.name: {
      const { currentPage: { url, urlParams, queryParams } } = state.platform;
      const onSubredditPage = !!urlParams.subredditName || url === '/'

      const postsParams = PostsFromSubreddit.pageParamsToSubredditPostsParams({
        urlParams,
        queryParams,
      });
      const postsListId = paramsToPostsListsId(postsParams);
      const postsList = state.postsLists[postsListId];

      // XXX We only need to wait for the list of posts if we plan to include
      // the link_listing payload field.
      return onSubredditPage && postsList && !postsList.loading;
    }
    default: {
      return true;
    }
  }
};

export const buildPageviewData = (state, handlerName) => {
  return {
    ...getBasePayload(state),
    ...buildSortOrderData(state, handlerName),
    ...buildSubredditData(state),
    ...buildLanguageData(state),
    ...buildDNTData(state),
    ...buildCompactViewData(state),
    ...buildTargetData(state, handlerName),
  };
};

export const waitForUser = (state) => {
  if (!state.session.isValid) { return true; }
  return state.user.name && state.accounts[state.user.name];
};

export const EVENT__PAGEVIEW = 'EVENT__PAGEVIEW';
export const pageview = () => async (dispatch, getState, { waitForState }) => {
  const currentState = getState();

  const { currentPage } = currentState.platform;
  const { handler } = parseRoute(currentPage.url, routes);
  const handlerName = handler.name;

  waitForState(state => dataRequiredForHandler(state, handlerName), state => {
    const data = buildPageviewData(state, handlerName);
    getEventTracker(state).track('screenview_events', 'cs.screenview', data);
  });
};
