import { BaseHandler, METHODS } from '@r/platform/router';
import * as subscriptionActions from 'app/actions/subscribedSubreddits';

export const NAME = 'ToggleSubredditSubscription';

export default class ToggleSubredditSubscription extends BaseHandler {
  name = NAME;

  async [METHODS.POST](dispatch) {
    dispatch(subscriptionActions.toggleSubscription(this.bodyParams));
  }
}
