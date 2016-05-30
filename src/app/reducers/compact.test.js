import createTest from '@r/platform/createTest';

import * as compactAction from 'app/actions/compact';
import * as loginActions from 'app/actions/login';
import compact from './compact';

createTest({ reducers: { compact } }, ({ getStore, expect }) => {
  describe('compact', () => {
    describe('LOGGED_IN and LOGGED_OUT', () => {
      it('should return default on log in', () => {
        const { store } = getStore();
        store.dispatch({ type: loginActions.LOGGED_IN });
        const { compact } = store.getState();

        expect(compact).to.eql(true);
      });

      it('should return default on log out', () => {
        const { store } = getStore();
        store.dispatch({ type: loginActions.LOGGED_OUT });
        const { compact } = store.getState();

        expect(compact).to.eql(true);
      });
    });

    describe('SET_COMPACT', () => {
      it('should set compact state to true when the action is true', () => {
        const { store } = getStore();
        store.dispatch({ type: compactAction.SET_COMPACT, compact: true });
        const { compact } = store.getState();
        expect(compact).to.equal(true);
      });

      it('should set compact state to false when the action is false', () => {
        const { store } = getStore();
        store.dispatch({ type: compactAction.SET_COMPACT, compact: false });
        const { compact } = store.getState();
        expect(compact).to.equal(false);
      });
    });
  });
});
