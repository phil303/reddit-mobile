import * as platform from '@r/platform/actions';

import * as pageviewEvent from 'app/actions/events/pageview';

const actionEventMap = {
  [platform.SET_PAGE]: pageviewEvent.pageview,
};

export default store => next => action => {
  const trackingAction = actionEventMap[action.type];

  if (trackingAction) {
    store.dispatch(trackingAction(action));
  }

  return next(action);
};
