import merge from '@r/platform/merge';

import * as loginActions from 'app/actions/login';
import * as replyActions from 'app/actions/reply';

export const DEFAULT = {};

export default function (state=DEFAULT, action={}) {
  switch (action.type) {
    case loginActions.LOGGED_IN:
    case loginActions.LOGGED_OUT: {
      return DEFAULT;
    }

    case replyActions.SUCCESS:
    case replyActions.TOGGLE: {
      if (state[action.id]) {
        return merge(state, { [action.id]: false });
      }

      return merge(state, { [action.id]: true });
    }

    default: return state;
  }
}
