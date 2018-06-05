/*
 * action types
 */

export const UPDATE_SEARCH_FILTERS = 'update_search_filters';
export const SET_VIEWED_RECORD = 'set_viewed_record';
export const SEARCH_ENDED = 'search_ended';
export const RECEIVE_RECORD = 'receive_record';

/*
 * action creators
 */

const QUERY_URL = 'http://localhost:8080/geonetwork/index/records/_search';

export function setTextFilter(text) {
  return {
    type: UPDATE_SEARCH_FILTERS,
    filters: { textFilter: text }
  };
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

export function receiveSearchResults(records) {
  return {
    type: SEARCH_ENDED,
    records
  };
}

export function receiveSearchError(error) {
  return {
    type: SEARCH_ENDED,
    searchError: error
  };
}

export function setViewedRecord(uuid) {
  return { type: SET_VIEWED_RECORD, uuid };
}

export function closeRecord() {
  return { type: SET_VIEWED_RECORD, uuid: null };
}

export function receiveRecord(record) {
  return { type: RECEIVE_RECORD, record };
}

export function receiveRecordLoadError(error) {
  return { type: RECEIVE_RECORD, record: { error } };
}

export function loadViewedRecord() {
  return function(dispatch, getState) {
    return fetch(`${QUERY_URL}?uuid=${getState().viewedRecordUuid}`)
      .then(
        response => response.json(),
        error => dispatch(receiveRecordLoadError(error))
      )
      .then(json => dispatch(receiveRecord(json.hits.hits[0]._source)));
  };
}

export function updateSearchResults() {
  return function(dispatch) {
    return fetch(`${QUERY_URL}`)
      .then(
        response => response.json(),
        error => dispatch(receiveSearchError(error))
      )
      .then(json => {
        dispatch(
          receiveSearchResults(
            json.hits.hits.map(hit => {
              return {
                uuid: hit._source.uuid,
                title: hit._source.resourceTitle
              };
            })
          )
        );
      });
  };
}
