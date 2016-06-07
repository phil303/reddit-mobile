import { BaseHandler, METHODS } from '@r/platform/router';
import * as platformActions from '@r/platform/actions';
import * as subredditActions from '../../actions/subreddits';

export class PostSubmitHandler extends BaseHandler {
  async [METHODS.GET](dispatch) {
  }
}

export class PostSubmitCommunityHandler extends BaseHandler {
  async [METHODS.GET](dispatch, getState) {
    const state = getState();
    state.recentSubreddits.forEach(subredditName => {
      dispatch(subredditActions.fetchSubreddit(subredditName));
    });
  }
}
