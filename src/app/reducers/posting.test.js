import createTest from '@r/platform/createTest';

import posting from './posting';
import * as loginActions from 'app/actions/login';
import * as postingActions from 'app/actions/posting';

createTest({ reducers: { posting } }, ({ getStore, expect }) => {
  describe('posting', () => {

    describe('LOGGED_IN and LOGGED_OUT', () => {
      it('should return default on log in', () => {
        const { store } = getStore({
          posting: { title: 'foo', meta: 'bar', subreddit: 'baz' },
        });

        store.dispatch(loginActions.loggedIn());

        const { posting } = store.getState();
        expect(posting).to.eql({ subreddit: '', title: '', meta: '' });
      });

      it('should return default on log out', () => {
        const { store } = getStore({
          posting: { title: 'foo', meta: 'bar', subreddit: 'baz' },
        });

        store.dispatch(loginActions.loggedOut());

        const { posting } = store.getState();
        expect(posting).to.eql({ subreddit: '', title: '', meta: '' });
      });
    });

    describe('UPDATE_FIELD', () => {
      it('should update values for a given field', () => {
        const { store } = getStore();
        store.dispatch(postingActions.updateField('sr', 'foobar'));

        const { posting } = store.getState();
        expect(posting.sr).to.equal('foobar');
      });
    });
  });
});
