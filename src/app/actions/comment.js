import { endpoints, models } from '@r/api-client';

import { apiOptionsFromState } from 'lib/apiOptionsFromState';

export const TOGGLE_EDIT_FORM = 'COMMENT__TOGGLE_EDIT_FORM';
export const toggleEditForm = id => ({ type: TOGGLE_EDIT_FORM, id });

export const TOGGLE_COLLAPSE = 'COMMENT__TOGGLE_COLLAPSE';

export const toggledCollapse = (id, collapse) => ({ type: TOGGLE_COLLAPSE, id, collapse });
export const toggleCollapse = (id, collapse) => async (dispatch) => {
  dispatch(toggledCollapse(id, collapse));
};

export const RESET_COLLAPSE = 'COMMENT__RESET_COLLAPSE';
export const resetCollapse = collapse => ({ type: RESET_COLLAPSE, collapse });

export const SAVED = 'COMMENT__SAVED';
export const saved = comment => ({
  type: SAVED,
  comment,
});

export const DELETED = 'COMMENT__DELETED';
export const deleted = comment => ({
  type: DELETED,
  comment,
});

export const toggleSave = id => async (dispatch, getState) => {
  const state = getState();
  const comment = state.comments[id];
  const method = comment.saved ? 'del' : 'post';
  await endpoints.SavedEndpoint[method](apiOptionsFromState(state), { id });
  // the response doesn't have anything in it (yay api), so emit a new model
  // on the client side;
  const newComment = models.CommentModel.fromJSON({ ...comment.toJSON(), saved: !comment.saved });
  dispatch(saved(newComment));
};

export const del = id => async (dispatch, getState) => {
  const state = getState();
  const comment = state.comments[id];
  const apiOptions = apiOptionsFromState(state);
  await endpoints.CommentsEndpoint.del(apiOptions, id);
  // the response doesn't have anything in it, so we're going to guess what the
  // comment should look like
  const newComment = models.CommentModel.fromJSON({
    ...comment.toJSON(),
    author: '[deleted]',
    bodyHTML: '[deleted]',
  });
  dispatch(deleted(newComment));
};

export const REPORTING = 'REPORTING';
export const REPORTED = 'REPORTED';
export const report = (id, reason) => async (dispatch, getState) => {
  console.log(id, reason, getState());
};

export const LOADING_MORE = 'LOADING_MORE';
export const LOADED_MORE = 'LOADED_MORE';
export const loadMore = ids => async (dispatch, getState) => {
  console.log(ids, getState());
};

export const REPLYING = 'REPLYING';
export const REPLIED = 'REPLIED';
export const REPLY = 'REPLY';

export const replying = (id, text) => ({ type: REPLYING, id, text });
export const replied = (newComment) => ({ type: REPLIED, comment: newComment });
export const reply = (id, text) => async (dispatch, getState) => {
  const state = getState();

  if (state.replying[id] || !text || !id) { return; }

  text = text.trim();

  const type = models.ModelTypes.thingType(id);
  const objects = state[`${type}s`];
  const thing = objects[id];

  dispatch(replying(id, text));

  const apiResponse = await thing.reply(apiOptionsFromState(state), text);
  const newRecord = apiResponse.results[0];

  // add the new model
  dispatch(receivedResponse(apiResponse, models.ModelTypes.COMMENT));

  // If it's a comment, stub the parent so it receives the new replies.
  if (type === models.ModelTypes.COMMENT) {
    const stub = thing.set({ replies: [newRecord, ...thing.replies] });

    // update the parent with the new reply
    dispatch(updatedModel(stub, type));

  } else if (type === models.ModelTypes.POST) {
    const comment = apiResponse.comments[apiResponse.results[0].uuid];
    // If it's a post, add it as a new model.
    dispatch(newModel(comment, models.ModelTypes.COMMENT));
  }

  dispatch(replied(apiResponse.comments[newRecord.uuid]));
};
