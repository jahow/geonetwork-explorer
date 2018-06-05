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
    filters: { text: text }
  };
}

export function setResultType(type) {
  return {
    type: UPDATE_SEARCH_FILTERS,
    filters: { type: type }
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

export function receiveSearchResults(results) {
  return {
    type: SEARCH_ENDED,
    records: results.records,
    resultTypes: results.types
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
    return fetch(QUERY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: {
          match: {
            uuid: getState().viewedRecordUuid
          }
        }
      })
    })
      .then(
        response => response.json(),
        error => dispatch(receiveRecordLoadError(error))
      )
      .then(json => {
        if (json.error) {
          dispatch(receiveRecordLoadError(json.error.reason));
          return;
        }
        if (!json.hits.hits.length) {
          dispatch(receiveRecordLoadError('Record not found.'));
          return;
        }
        dispatch(receiveRecord(json.hits.hits[0]._source));
      });
  };
}

// this must be called to refresh the results
export function updateSearchResults() {
  // facets update
  return function(dispatch, getState) {
    fetch(QUERY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        aggs: {
          types: {
            terms: {
              field: 'resourceType'
            }
          }
        },
        query: {
          query_string: {
            query: (getState().searchFilters.text || '') + '*'
          }
        }
      })
    })
      .then(
        response => response.json(),
        error => dispatch(receiveSearchError(error))
      )
      .then(json => {
        if (json.error) {
          dispatch(receiveSearchError(json.error.reason));
          return;
        }
        dispatch(
          receiveSearchResults({
            types: json.aggregations.types.buckets.reduce(
              (prev, curr, index) => {
                prev[curr.key] = curr.doc_count;
                return prev;
              },
              {}
            )
          })
        );
      });

    // results update
    fetch(QUERY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: (getState().searchFilters.text || '') + '*'
                }
              },
              {
                term: {
                  resourceType: getState().searchFilters.type
                }
              }
            ]
          }
        }
      })
    })
      .then(
        response => response.json(),
        error => dispatch(receiveSearchError(error))
      )
      .then(json => {
        if (json.error) {
          dispatch(receiveSearchError(json.error.reason));
          return;
        }
        dispatch(
          receiveSearchResults({
            records: json.hits.hits.map(hit => {
              return {
                uuid: hit._source.uuid,
                title: hit._source.resourceTitle
              };
            })
          })
        );
      });
  };
}
