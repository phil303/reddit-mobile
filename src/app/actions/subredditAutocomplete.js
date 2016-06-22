import { endpoints } from '@r/api-client';
import { apiOptionsFromState } from 'lib/apiOptionsFromState';

const { SubredditAutocomplete } = endpoints;
console.log("SubredditAutocomplete", SubredditAutocomplete);

export const FETCHING = 'AUTOCOMPLETE__FETCHING';
export const RECEIVED = 'AUTOCOMPLETE__RECEIVED';
export const RESET = 'AUTOCOMPLETE__RESET';

export const autocompleteFetch = query => ({ type: FETCHING, query });
export const autocompleteReceived = response => ({ type: RECEIVED, response });
export const resetAutocomplete = () => ({ type: RESET_AUTOCOMPLETE });

export const fetch = searchTerm => async (dispatch, getState) => {
  dispatch(autocompleteFetch(searchTerm));

  const apiOptions = apiOptionsFromState(getState());
  const response = await SubredditAutocomplete.get(apiOptions, searchTerm);
  dispatch(autocompleteReceived(response));
};
