import createTest from '@r/platform/createTest';

import accountRequests from './accountRequests';
import * as accountActions from 'app/actions/accounts';
import * as loginActions from 'app/actions/login';

const REQUIRED_KEYS = ['id', 'loading', 'result'];

createTest({ reducers: { accountRequests } }, ({ getStore, expect }) => {
  describe('accountRequests', () => {

    describe('LOGGED_IN and LOGGED_OUT', () => {
      it('should return default', () => {
        const { store } = getStore();
        store.dispatch({ type: loginActions.LOGGED_OUT });
        const { accountRequests } = store.getState();

        expect(accountRequests).to.eql({});
      });
    });

    describe('FETCHING_ACCOUNT', () => {
      it('should add an account optimistically', () => {
        const ACCOUNT = { id: 'foobar', loading: true, result: {} };
        const { store } = getStore();
        store.dispatch({
          type: accountActions.FETCHING_ACCOUNT,
          name: 'foobar',
          loggedOut: true,
        });
        const { accountRequests } = store.getState();

        expect(accountRequests).to.have.keys('foobar');
        expect(accountRequests.foobar).to.have.all.keys(REQUIRED_KEYS);
        expect(accountRequests.foobar).to.eql(ACCOUNT);
      });
    });

    describe('RECEIVED_ACCOUNT', () => {
      it('should update an account when request if finished', () => {
        const RESULT = { type: 'account', uuid: 'me' };

        const { store } = getStore();
        store.dispatch({
          type: accountActions.RECEIVED_ACCOUNT,
          name: 'foobar',
          result: RESULT,
        });
        const { accountRequests } = store.getState();

        expect(accountRequests).to.have.keys('foobar');
        expect(accountRequests.foobar).to.have.all.keys(REQUIRED_KEYS);
        expect(accountRequests.foobar.result).to.eql(RESULT);
      });
    });
  });
});
