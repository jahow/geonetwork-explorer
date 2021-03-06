import { GEONETWORK_URL } from '../constants.js';

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

const QUERY_URL = `${GEONETWORK_URL}/index/records/_search`;

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
    filters: { spatialFilter: { minX, minY, maxX, maxY } }
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
  return { type: RECEIVE_RECORD, record: null, recordLoadError: error };
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
        error => dispatch(receiveRecordLoadError(error.message))
      )
      .then(json => {
        if (json.error) {
          dispatch(receiveRecordLoadError(json.error.reason));
          return;
        }
        if (!json.hits) {
          dispatch(receiveRecordLoadError('Geonetwork could not be reached.'));
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
    const filters = { ...getState().searchFilters };
    const box = filters.spatialFilter || {};
    const commonRequest = {
      size: 50,
      query: {
        bool: {
          must: [
            {
              query_string: {
                query: (filters.text || '') + '*'
              }
            }
          ],
          filter: {
            geo_shape: {
              geom: {
                shape: {
                  type: 'envelope',
                  coordinates: [
                    [
                      !isNaN(box.minX) ? Math.max(box.minX, -180) : -180,
                      !isNaN(box.minY) ? Math.max(box.minY, -90) : -90
                    ],
                    [
                      !isNaN(box.maxX) ? Math.min(box.maxX, 180) : 180,
                      !isNaN(box.maxY) ? Math.min(box.maxY, 90) : 90
                    ]
                  ]
                },
                relation: 'within'
              }
            }
          }
        }
      }
    };

    fetch(QUERY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...commonRequest,
        aggs: {
          types: {
            terms: {
              field: 'resourceType'
            }
          }
        }
      })
    })
      .then(
        response => response.json(),
        error => dispatch(receiveSearchError(error.message))
      )
      .then(json => {
        if (json.error) {
          dispatch(receiveSearchError(json.error.reason));
          return;
        }
        if (!json.hits) {
          dispatch(receiveSearchError('Geonetwork could not be reached.'));
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
    const recordsRequest = {
      ...commonRequest
    };
    recordsRequest.query.bool.must.push({
      term: {
        resourceType: filters.type
      }
    });
    fetch(QUERY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recordsRequest)
    })
      .then(
        response => response.json(),
        error => dispatch(receiveSearchError(error.message))
      )
      .then(json => {
        if (json.error) {
          dispatch(receiveSearchError(json.error.reason));
          return;
        }
        if (!json.hits) {
          dispatch(receiveSearchError('Geonetwork could not be reached.'));
          return;
        }
        dispatch(
          receiveSearchResults({
            records: json.hits.hits.map(hit => {
              return {
                uuid: hit._source.uuid,
                title: hit._source.resourceTitle,
                thumbnail: hit._source.overview,
                geom: hit._source.geom
              };
            })
          })
        );
      });
  };
}
