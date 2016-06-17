import merge from '@r/platform/merge';

import * as postingActions from '../actions/posting';

const DEFAULT = {};

export default (state=DEFAULT, action={}) => {
  switch (action.type) {
    case postingActions.COMMUNITY_SELECT: {
      return merge(state, { community: action.community });
    }
    default:
      return state;
  }
}
