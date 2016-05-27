import createTest from '@r/platform/createTest';
import { models } from '@r/api-client';

import { apiResponseReducerMaker } from './apiResponse';
import * as apiResponseActions from 'app/actions/apiResponse';

const { ModelTypes: { POST } } = models;
const options = {
  reducers: { [`${POST}s`]: apiResponseReducerMaker(POST) }
};

createTest(options, ({ getStore, expect }) => {
  // We can use any store type to test this since api responses get acted upon
  // in a generic way.
  describe('apiResponse', () => {

    describe('RECEIVED_API_RESPONSE', () => {
      it('should update the relevant store upon api response', () => {
        const UPDATED_POST_STATE = { post1: {} };

        const { store } = getStore();
        const apiResponseMock = {
          typeToTable: { 'post': UPDATED_POST_STATE }
        };
        store.dispatch({
          type: apiResponseActions.RECEIVED_API_RESPONSE,
          apiResponse: apiResponseMock,
        });
        const state = store.getState();

        expect(state).to.contain.keys('posts');
        expect(state.posts).to.eql(UPDATED_POST_STATE);
      });
    });

    describe('UPDATED_MODEL and NEW_MODEL', () => {
      it('should update the store with the model', () => {
        // TODO need example of this
      });
    });
  });
});
