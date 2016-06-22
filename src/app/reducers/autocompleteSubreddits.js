import merge from '@r/platform/merge';
import * as subredditAutocompleteActions from '../actions/subredditAutocomplete';

const DEFAULT = {
  fetching: false,
  received: false,
  results: [],
};

export default (state=DEFAULT, action={}) => {
  switch (action.type) {
    case action.FETCHING:
      return merge(state, { fetching: true });

    case action.RECEIVED:
      return merge(state, {
        fetching: false,
        received: true,
        results: action.results,
      });

    case action.RESET:
      return DEFAULT;

    default:
      return state;
  }
};
