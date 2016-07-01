import * as platformActions from '@r/platform/actions';

import * as loginActions from 'app/actions/login';
import * as recentSubredditActions from 'app/actions/recentSubreddits';

const DEFAULT = [];

export default (state=DEFAULT, action={}) => {
  switch (action.type) {
    case loginActions.LOGGED_IN:
    case loginActions.LOGGED_OUT: {
      return DEFAULT;
    }

    case recentSubredditActions.SET_RECENT_SUBREDDITS: {
      return action.subreddits;
    }

    case platformActions.SET_PAGE: {
      const { subredditName } = action.payload.urlParams;
      if (!subredditName) {
        return state;
      }
      return Array.from(new Set(state.concat(subredditName)));
    }

    default: {
      return state;
    }
  }
};
