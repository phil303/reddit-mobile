import { BaseHandler, METHODS } from '@r/platform/router';
import * as platformActions from '@r/platform/actions';

import * as voteActions from 'app/actions/vote';

export const NAME = 'Vote';

export default class Vote extends BaseHandler {
  name = Vote;

  async [METHODS.POST](dispatch, getState, { waitForState }) {
    const { thingId } = this.urlParams;
    const direction = parseInt(this.bodyParams.direction);
    const state = getState();

    if (!state.session.isValid) {
      return dispatch(platformActions.setPage('/login'));
    }

    await waitForState(state => state.session.isValid && !state.sessionRefreshing, () => {
      dispatch(voteActions.vote(thingId, direction));
    });
  }
}
