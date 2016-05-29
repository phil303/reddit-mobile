import createTest from '@r/platform/createTest';

import collapsedComments from './collapsedComments';
import * as commentActions from 'app/actions/comment';
import * as loginActions from 'app/actions/login';

createTest({ reducers: { collapsedComments } }, ({ getStore, expect }) => {
  describe('collapsedComments', () => {
    describe('LOGGED_IN and LOGGED_OUT', () => {
      it('should return default on log in', () => {
        const { store } = getStore();
        store.dispatch({ type: loginActions.LOGGED_IN });
        const { collapsedComments } = store.getState();

        expect(collapsedComments).to.eql({});
      });

      it('should return default on log out', () => {
        const { store } = getStore();
        store.dispatch({ type: loginActions.LOGGED_OUT });
        const { collapsedComments } = store.getState();

        expect(collapsedComments).to.eql({});
      });
    });

    describe('TOGGLE_COLLAPSE', () => {
      it('should set a comment id\'s collapse state to true when the action\'s collapse is true', () => {
        const { store } = getStore();
        store.dispatch({ type: commentActions.TOGGLE_COLLAPSE, id: '1', collapse: true });
        const { collapsedComments } = store.getState();

        expect(collapsedComments).to.have.keys('1');
        expect(collapsedComments[1]).to.equal(true);
      });

      it('should set a comment id\'s collapse state to false when the action\'s collapse is false', () => {
        const { store } = getStore();
        store.dispatch({ type: commentActions.TOGGLE_COLLAPSE, id: '1', collapse: false });
        const { collapsedComments } = store.getState();

        expect(collapsedComments).to.have.keys('1');
        expect(collapsedComments[1]).to.equal(false);
      });
    });

    describe('RESET_COLLAPSE', () => {
      it('should reset the collapse state of all comments', () => {
        const { store } = getStore();
        // TODO: is collapse key necessary?
        store.dispatch({ type: commentActions.RESET_COLLAPSE, collapse: {} });
        const { collapsedComments } = store.getState();

        expect(collapsedComments).to.eql({});
      });
    });
  });
});
