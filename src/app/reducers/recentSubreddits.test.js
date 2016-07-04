import createTest from '@r/platform/createTest';
import { METHODS } from '@r/platform/router';
import * as platformActions from '@r/platform/actions';

import routes from 'app/router';
import * as loginActions from 'app/actions/login';
import * as recentSubredditActions from 'app/actions/recentSubreddits';
import recentSubreddits from './recentSubreddits';

createTest({ reducers: { recentSubreddits }, routes }, ({ expect, getStore }) => {
  describe('recentSubreddits', () => {
    describe('LOGGED_IN and LOGGED_OUT', () => {
      it('should return default on log out', () => {
        const { store } = getStore({
          recentSubreddits: ['a', 'b', 'c'],
        });

        store.dispatch(loginActions.loggedOut());
        const { recentSubreddits } = store.getState();
        expect(recentSubreddits).to.eql([]);
      });

      it('should return the default on log in', () => {
        const { store } = getStore({
          recentSubreddits: ['a', 'b', 'c'],
        });

        store.dispatch(loginActions.loggedIn());
        const { recentSubreddits } = store.getState();
        expect(recentSubreddits).to.eql([]);
      });
    });

    describe('SET_RECENT_SUBREDDITS', () => {
      it('should set recent subreddits', () => {
        const SUBREDDITS = ['foo', 'bar', 'baz'];
        const { store } = getStore();
        store.dispatch(recentSubredditActions.setRecentSubreddits(SUBREDDITS));

        const { recentSubreddits } = store.getState();
        expect(recentSubreddits).to.eql(SUBREDDITS);
      });
    });

    describe('SET_PAGE', () => {
      it('should add a subreddit when a subreddit is visited', () => {
        const { store } = getStore();
        store.dispatch(platformActions.navigateToUrl(METHODS.GET, '/r/aww'));

        const { recentSubreddits } = store.getState();
        expect(recentSubreddits).to.eql(['aww']);
      });

      it('should not add a subreddit when any other page is visited', () => {
        const { store } = getStore();
        store.dispatch(platformActions.navigateToUrl(METHODS.GET, '/'));

        const { recentSubreddits } = store.getState();
        expect(recentSubreddits).to.eql([]);
      });
    });
  });
});
