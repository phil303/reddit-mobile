import { setStatus } from '@r/platform/actions';
import { BaseHandler, METHODS } from '@r/platform/router';
import { models } from '@r/api-client';

import { cleanObject } from 'lib/cleanObject';
import { fetchUserBasedData } from './handlerCommon';
import * as commentsPageActions from 'app/actions/commentsPage';
import * as subredditActions from 'app/actions/subreddits';
import * as recommendedSubredditsActions from 'app/actions/recommendedSubreddits';
import { flags } from 'app/constants';
import { getBasePayload, buildSubredditData, convertId, logClientScreenView } from 'lib/eventUtils';
import features from 'app/featureFlags';
import { paramsToCommentsPageId } from 'app/models/CommentsPage';
import { setTitle } from 'app/actions/pageMetadata';

const {
  VARIANT_RECOMMENDED_TOP_PLAIN,
  VARIANT_SUBREDDIT_HEADER,
} = flags;


const { POST_TYPE } = models.ModelTypes;
const PostIdRegExp = new RegExp(`^${POST_TYPE}_`);

const ensurePostTypePrefix = postId => {
  if (PostIdRegExp.test(postId)) { return postId; }

  return `${POST_TYPE}_${postId}`;
};


export default class CommentsPage extends BaseHandler {

  static pageParamsToCommentsPageParams({ urlParams, queryParams}) {
    let { postId } = urlParams;
    const { commentId } = urlParams;
    const { sort, context } = queryParams;

    postId = ensurePostTypePrefix(postId);

    let query;
    if (commentId) {
      query = {
        comment: commentId,
        context,
      };
    }

    return cleanObject({
      id: postId,
      sort,
      query,
    });
  }

  buildTitle (state, pageId) {
    const page = state.commentsPages[pageId];
    const post = state.posts[page.postId];

    if (post) {
      return `Reddit - ${post.subreddit} - ${post.title}`;
    }
  }

  async [METHODS.GET](dispatch, getState) {
    const state = getState();
    if (state.platform.shell) { return; }

    const commentsPageParams = CommentsPage.pageParamsToCommentsPageParams(this);
    const commentsPageId = paramsToCommentsPageId(commentsPageParams);
    let { subredditName } = state.platform.currentPage.urlParams;

    await Promise.all([
      dispatch(commentsPageActions.fetchCommentsPage(commentsPageParams)),
      fetchUserBasedData(dispatch),

      dispatch(commentsPageActions.fetchRelevantContent()),
      dispatch(commentsPageActions.visitedCommentsPage(this.urlParams.postId)),
      dispatch(subredditActions.fetchSubreddit(subredditName)),

    ]);

    // if url does not include r/subredditName, then subredditName will be
    // undefined, even if we are on a comments page. We can ascertain the
    // subredditName by looking it up via postId
    const post = getState().posts[`t3_${this.urlParams.postId}`];
    if (!subredditName && post) {
      subredditName = post.subreddit;
    }

    if (subredditName) {
      fetchRecommendedSubreddits(state, dispatch, subredditName);
    }

    dispatch(setStatus(getState().commentsPages[commentsPageId].responseCode));

    dispatch(setTitle(this.buildTitle(getState(), commentsPageId)));

    logClientScreenView(buildScreenViewData, getState());
  }
}

const fetchRecommendedSubreddits = (state, dispatch, subredditName) => {
  const feature = features.withContext({ state });

  if (feature.enabled(VARIANT_SUBREDDIT_HEADER)) {
    return;
  }

  let max_recs = 3;
  if (feature.enabled(VARIANT_RECOMMENDED_TOP_PLAIN)) {
    max_recs = 7;
  }

  dispatch(recommendedSubredditsActions.fetchRecommendedSubreddits(subredditName, max_recs));
};

function buildScreenViewData(state) {
  const { currentPage: { queryParams, urlParams } } = state.platform;
  const fullName =`t3_${urlParams.postId}`;
  const post = state.posts[fullName];

  if (!post) {
    return null;
  }

  return cleanObject({
    target_fullname: fullName,
    target_id: convertId(post.id),
    target_type: post.isSelf ? 'self' : 'link',
    target_sort: queryParams.sort || 'confidence',
    target_url: post.cleanUrl,
    target_filter_time: queryParams.sort === 'top' ? (queryParams.time || 'all') : null,
    ...buildSubredditData(state),
    ...getBasePayload(state),
  });
}
