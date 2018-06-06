import React, { Component } from 'react';
import olMap from 'ol/map';
import View from 'ol/view';
import Tile from 'ol/layer/tile';
import OSM from 'ol/source/osm';
import proj from 'ol/proj';
import { INITIAL_MAP_EXTENT } from './constants.js';

class Map extends Component {
  componentDidMount() {
    // initialize OL map & view
    this._map = new olMap({
      view: new View(),
      layers: [
        new Tile({
          source: new OSM()
        })
      ],
      target: this._mapTarget
    });

    this._map
      .getView()
      .fit(
        proj.transformExtent(
          INITIAL_MAP_EXTENT,
          'EPSG:4326',
          this._map.getView().getProjection()
        )
      );
  }

  _mapTarget;
  _map;

  render() {
    return (
      <div
        className="pos-absolute width-100 height-100 main-map"
        ref={e => (this._mapTarget = e)}
      />
    );
  }
}

export default Map;
