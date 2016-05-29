import createTest from '@r/platform/createTest';
import merge from '@r/platform/merge';

import commentsPages from './commentsPages';
import * as commentsPageActions from 'app/actions/commentsPage';
import * as loginActions from 'app/actions/login';
import * as apiResponseActions from 'app/actions/apiResponse';


createTest({ reducers: { commentsPages } }, ({ getStore, expect }) => {
  describe('commentsPages', () => {
    describe('LOGGED_IN and LOGGED_OUT', () => {
      it('should return default on log in', () => {
        const { store } = getStore();
        store.dispatch({ type: loginActions.LOGGED_IN });
        const { commentsPages } = store.getState();

        expect(commentsPages).to.eql({});
      });

      it('should return default on log out', () => {
        const { store } = getStore();
        store.dispatch({ type: loginActions.LOGGED_OUT });
        const { commentsPages } = store.getState();

        expect(commentsPages).to.eql({});
      });
    });

    describe('FETCHING_COMMENTS_PAGE', () => {
      it('should try the cache first', () => {
        const POST_ID = 't3_12345';
        const CACHED_COMMENTS_PAGE = {
          id: '1',
          params: { id: POST_ID },
          postId: POST_ID,
          loading: true,
          loadingMoreChildren: {},
          results: [],
        };

        // inject the cached comments page into the store ahead of time
        const { store } = getStore();
        store.getState().commentsPages = { '1': CACHED_COMMENTS_PAGE };

        store.dispatch({
          type: commentsPageActions.FETCHING_COMMENTS_PAGE,
          commentsPageId: '1',
          commentsPageParams: { id: POST_ID },
        });

        const { commentsPages } = store.getState();
        expect(commentsPages['1']).to.equal(CACHED_COMMENTS_PAGE);
      });

      it('should update the store', () => {
        const { store } = getStore();
        const POST_ID = 't3_abcxyz';

        store.dispatch({
          type: commentsPageActions.FETCHING_COMMENTS_PAGE,
          commentsPageId: '2',
          commentsPageParams: { id: POST_ID },
        });

        const { commentsPages } = store.getState();
        expect(commentsPages['2']).to.eql({
          id: '2',
          params: { id: POST_ID },
          postId: POST_ID,
          loading: true,
          loadingMoreChildren: {},
          results: [],
        });
        expect(commentsPages.current).to.equal('2');
      });
    });

    describe('RECEIVED_COMMENTS_PAGE', () => {
      it('should update the loading state and results', () => {
        const POST_ID = 't3_12345';
        const LOADING_COMMENTS_PAGE = {
          id: '1',
          params: { id: POST_ID },
          postId: POST_ID,
          loading: true,
          loadingMoreChildren: {},
          results: [],
        };
        const RESULTS = [
          { type: 'comment', uuid: 't1_comment1', paginationId: 't1_comment1' },
          { type: 'comment', uuid: 't1_comment2', paginationId: 't1_comment2' },
        ];

        const { store } = getStore();
        store.getState().commentsPages = {
          '1': LOADING_COMMENTS_PAGE,
          current: '1',
        };

        store.dispatch({
          type: commentsPageActions.RECEIVED_COMMENTS_PAGE,
          commentsPageId: '1',
          commentsPageResults: RESULTS,
        });

        const { commentsPages } = store.getState();
        expect(commentsPages).to.eql(merge(commentsPages, {
          '1': {
            loading: false,
            results: RESULTS,
          },
        }));
      });
    });

    describe('NEW_MODEL', () => {

      const { store } = getStore();
      const POST_ID = 't3_12345';
      const COMMENTS_PAGE = {
        id: '1',
        params: { id: POST_ID },
        postId: POST_ID,
        loading: false,
        loadingMoreChildren: {},
        results: [],
      };
      const COMMENT_RECORD = {
        type: 'comment', uuid: 't1_comment1', paginationId: 't1_comment1'
      };
      const COMMENT = {
        parentId: POST_ID,
        toRecord: () => COMMENT_RECORD,
      };

      beforeEach(() => {
        store.getState().commentsPages = {
          '1': COMMENTS_PAGE,
          current: '1',
        };
      });

      it('should do nothing if kind is not "comment"', () => {
        store.dispatch({
          type: apiResponseActions.NEW_MODEL,
          kind: 'foobar',
          model: {},
        });

        const { commentsPages } = store.getState();
        expect(commentsPages['1'].results).to.eql([]);
      });

      it('should add a new comment if its parent is the link_id', () => {
        store.dispatch({
          type: apiResponseActions.NEW_MODEL,
          kind: 'comment',
          model: COMMENT,
        });

        const { commentsPages } = store.getState();
        expect(commentsPages['1'].results).to.eql([ COMMENT_RECORD ]);
      });

      it('should not add a new comment if its parent is not the link_id', () => {
        const comment = merge(COMMENT, { parentId: 't3_abcxyz' });
        store.dispatch({
          type: apiResponseActions.NEW_MODEL,
          kind: 'comment',
          model: comment,
        });

        const { commentsPages } = store.getState();
        expect(commentsPages['1'].results).to.eql([]);
      });
    });
  });
});
