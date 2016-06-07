import { makeCookieArchiver } from '@r/redux-state-archiver';

export const CookieSync = makeCookieArchiver(
  state => state.theme,
  state => state.compact,
  state => state.recentSubreddits,
  (theme, compact, recentSubreddits) => ({ theme, compact, recentSubreddits })
);
