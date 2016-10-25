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

    case replyActions.PENDING: {
      return merge(state, {
        [action.id]: { content: action.content, isShowing: false },
      });
    }

    case replyActions.SUCCESS: {
      return merge(state, { [action.id]: { content: null } });
    }

    case replyActions.TOGGLE: {
      if (state[action.id] && state[action.id].isShowing) {
        return merge(state, {
          [action.id]: { isShowing: false, content: action.content }
        });
      }

      return merge(state, { [action.id]: { isShowing: true } });
    }

    default: return state;
  }
}
