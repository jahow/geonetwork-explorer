import React, { Component } from 'react';
import { connect } from 'react-redux';
import olMap from 'ol/map';
import View from 'ol/view';
import Tile from 'ol/layer/tile';
import layerVector from 'ol/layer/vector';
import sourceVector from 'ol/source/vector';
import OSM from 'ol/source/osm';
import proj from 'ol/proj';
import WKT from 'ol/format/wkt';
import { INITIAL_MAP_EXTENT } from './constants.js';

const wktFormat = new WKT();

class Map extends Component {
  _mapTarget;
  _map;
  _featuresSource;

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

    this._featuresSource = new sourceVector({
      features: []
    });
    this._map.addLayer(
      new layerVector({
        source: this._featuresSource
      })
    );
  }

  componentWillReceiveProps(props) {
    // clear features on map and add ones from records
    this._featuresSource.clear();
    props.records.forEach(record => {
      if (!record.geom) {
        return;
      }
      const geoms = Array.isArray(record.geom) ? record.geom : [record.geom];
      geoms.forEach(geom => {
        this._featuresSource.addFeature(
          wktFormat.readFeature(geom, {
            dataProjection: 'EPSG:4326',
            featureProjection: this._map.getView().getProjection()
          })
        );
      });
    });
  }

  render() {
    return (
      <div
        className="pos-absolute width-100 height-100 main-map"
        ref={e => (this._mapTarget = e)}
      />
    );
  }
}

Map.defaultProps = {
  records: []
};

const mapStateToProps = (state, ownProps) => {
  return {
    records: state.records
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    viewRecord: uuid => {
      dispatch(setViewedRecord(uuid));
      dispatch(loadViewedRecord());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);
