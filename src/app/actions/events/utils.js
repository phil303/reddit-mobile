import { models } from '@r/api-client';
import url from 'url';

const ID_REGEX = /(?:t\d+_)?(.*)/;

export function convertId(id) {
  if (!id) { return; }

  const unprefixedId = ID_REGEX.exec(id)[1];
  return parseInt(unprefixedId, 36);
}

export function getBasePayload(state) {
  const { user, accounts } = state;
  const referrer = state.platform.currentPage.referrer || '';
  const domain = window.location.host;

  const userAccount = user.loggedOut ? null : accounts[user.name];

  const payload = {
    domain,
    geoip_country: state.meta.country,
    user_agent: state.meta.userAgent,
    referrer_domain: url.parse(referrer).host || domain,
    referrer_url: referrer,
  };

  if (userAccount) {
    payload.user_name = userAccount.name;
    payload.user_id = convertId(userAccount.id);
  } else {
    payload.loid = state.loid.loid;
    payload.loid_created = state.loid.loidcreated;
  }

  return payload;
}

export function getCurrentSubredditFromState(state) {
  const { subredditName } = state.platform.currentPage.urlParams;
  if (!subredditName) { return; }

  return state.subreddits[subredditName.toLowerCase()];
}
