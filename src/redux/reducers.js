import { combineReducers } from 'redux';
import { UPDATE_SEARCH_FILTERS, SET_VIEWED_RECORD } from './actions';

function viewedRecordUuid(state = null, action) {
  switch (action.type) {
    case SET_VIEWED_RECORD:
      return action.uuid;
    default:
      return state;
  }
}

function searchFilters(state = {}, action) {
  switch (action.type) {
    case UPDATE_SEARCH_FILTERS:
      return {
        ...state,
        ...action.filters
      };
    default:
      return state;
  }
}

const appState = combineReducers({
  viewedRecordUuid,
  searchFilters
});

export default appState;
