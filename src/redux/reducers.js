import { combineReducers } from 'redux';
import {
  UPDATE_SEARCH_FILTERS,
  SET_VIEWED_RECORD,
  RECORD_LOADED,
  SEARCH_ENDED,
  RECEIVE_RECORD
} from './actions';

const initialFilters = {
  type: 'dataset'
};

function viewedRecordUuid(state = null, action) {
  switch (action.type) {
    case SET_VIEWED_RECORD:
      return action.uuid;
    default:
      return state;
  }
}

function viewedRecord(state = null, action) {
  switch (action.type) {
    case RECEIVE_RECORD:
      return action.record;
    case SET_VIEWED_RECORD:
      return null;
    default:
      return state;
  }
}

function viewedRecordLoadError(state = null, action) {
  switch (action.type) {
    case RECEIVE_RECORD:
      return action.recordLoadError || null;
    case SET_VIEWED_RECORD:
      return null;
    default:
      return state;
  }
}

function searchFilters(state = initialFilters, action) {
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

function searching(state = false, action) {
  switch (action.type) {
    case UPDATE_SEARCH_FILTERS:
      return true;
    case SEARCH_ENDED:
      return false;
    default:
      return state;
  }
}

function searchError(state = null, action) {
  switch (action.type) {
    case SEARCH_ENDED:
      return action.searchError || null;
    default:
      return state;
  }
}

function records(state = [], action) {
  switch (action.type) {
    case SEARCH_ENDED:
      return action.records || state;
    default:
      return state;
  }
}

function resultTypes(state = {}, action) {
  switch (action.type) {
    case SEARCH_ENDED:
      return action.resultTypes || state;
    default:
      return state;
  }
}

const appState = combineReducers({
  viewedRecordUuid,
  viewedRecord,
  viewedRecordLoadError,
  searchFilters,
  searching,
  records,
  resultTypes,
  searchError
});

export default appState;
