/* eslint callback-return: "off" */
import * as platform from '@r/platform/actions';

import * as pageviewEvent from 'app/actions/events/pageview';
import * as search from 'app/actions/search';
import * as searchEvent from 'app/actions/events/search';
import * as login from 'app/actions/login';
import * as loginEvent from 'app/actions/events/login';
import * as reply from 'app/actions/reply';
import * as commentEvent from 'app/actions/events/comment';
//import * as registerEvent from 'app/actions/events/register';
//import * as submitEvent from 'app/actions/events/submit';

const actionEventMap = {
  [platform.SET_PAGE]: pageviewEvent.pageview,
  [search.OPEN_SEARCH]: searchEvent.opened,
  [search.CLOSE_SEARCH]: searchEvent.cancelled,
  [search.RECEIVED_SEARCH_REQUEST]: searchEvent.executed,
  [login.LOGGED_IN]: loginEvent.login,
  [reply.REPLIED]: commentEvent.reply,
  // [search.FETCHING_SEARCH_REQUEST]: searchEvent.search,
  // [register.REGISTERED]: registerEvent.register,
  // submit post
};

export default store => next => action => {
  next(action);

  const trackingAction = actionEventMap[action.type];

  if (trackingAction) {
    store.dispatch(trackingAction(action));
  }
};
