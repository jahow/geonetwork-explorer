/*
 * action types
 */

export const UPDATE_SEARCH_FILTERS = 'update_search_filters';
export const SET_VIEWED_RECORD = 'set_viewed_record';

/*
 * action creators
 */

export function setTextFilter(text) {
  return { type: UPDATE_SEARCH_FILTERS, filters: { textFilter: text } };
}

export function setSpatialFilter(minX, minY, maxX, maxY) {
  return {
    type: UPDATE_SEARCH_FILTERS,
    filters: { spatialFilter: [mminX, minY, maxX, maxY] }
  };
}

export function setTemporalFilter(minTime, maxTime) {
  return {
    type: UPDATE_SEARCH_FILTERS,
    filters: { temporalFilter: [minTime, maxTime] }
  };
}

export function viewRecord(uuid) {
  return { type: SET_VIEWED_RECORD, uuid };
}

export function closeRecord() {
  return { type: SET_VIEWED_RECORD, uuid: null };
}
