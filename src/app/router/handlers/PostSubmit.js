import { BaseHandler, METHODS } from '@r/platform/router';
import * as platformActions from '@r/platform/actions';
import * as subredditActions from '../../actions/subreddits';

export class PostSubmitHandler extends BaseHandler {
  async [METHODS.GET](dispatch, getState) {
    const state = getState();
    if (!state.session.isValid) {
      dispatch(platformActions.setPage('/login'));
      return;
    }
  }

  async [METHODS.POST](dispatch) {
    dispatch(platformActions.submitPost(this.bodyParams));
  }
}

export class PostSubmitCommunityHandler extends BaseHandler {
  async [METHODS.GET](dispatch, getState) {
    const state = getState();
    if (!state.session.isValid) {
      dispatch(platformActions.setPage('/login'));
      return;
    }

    state.recentSubreddits.forEach(subredditName => {
      dispatch(subredditActions.fetchSubreddit(subredditName));
    });
  }
}
