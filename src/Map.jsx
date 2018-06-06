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
import Select from 'ol/interaction/select';
import condition from 'ol/events/condition';
import Feature from 'ol/feature';
import MultiPolygon from 'ol/geom/multipolygon';
import { INITIAL_MAP_EXTENT } from './constants.js';
import {
  setSpatialFilter,
  updateSearchResults,
  setViewedRecord,
  loadViewedRecord
} from './redux/actions.js';
import { basicStyle, highlightStyle } from './ol-styles';

const wktFormat = new WKT();

class Map extends Component {
  constructor(props) {
    super(props);
  }

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
        source: this._featuresSource,
        style: basicStyle
      })
    );

    // bind map move event
    this._map.on('moveend', () => {
      const extent = proj.transformExtent(
        this._map.getView().calculateExtent(),
        this._map.getView().getProjection(),
        'EPSG:4326'
      );
      this.props.setSpatialFilter(extent[0], extent[1], extent[2], extent[3]);
    });

    // add a hover select
    const hoverInteraction = new Select({
      condition: condition.pointerMove,
      style: highlightStyle
    });
    hoverInteraction.on('select', e => {
      hoverInteraction.getFeatures().getLength() > 0
        ? this._map.getTargetElement().classList.add('hovered')
        : this._map.getTargetElement().classList.remove('hovered');
    });
    this._map.addInteraction(hoverInteraction);

    // handle click on feature
    const clickInteraction = new Select({
      condition: condition.click,
      style: highlightStyle
    });
    clickInteraction.getFeatures().on('add', e => {
      const uuid = e.element.get('uuid');
      if (!uuid) {
        return;
      }
      this.props.viewRecord(uuid);
      this._map.getView().fit(e.element.getGeometry(), {
        duration: 140,
        padding: [10, 10 + this._map.getSize()[0] * 0.4, 10, 50]
      });
    });
    this._map.addInteraction(clickInteraction);
  }

  componentWillReceiveProps(props) {
    // clear features on map and add ones from records
    this._featuresSource.clear();
    this._map.getInteractions().forEach(int => {
      int.getFeatures && int.getFeatures().clear();
    });
    props.records.forEach(record => {
      if (!record.geom) {
        return;
      }

      const feature = new Feature();
      feature.set('uuid', record.uuid);

      // do either a polygon or multipolygon from the geometry
      if (Array.isArray(record.geom)) {
        const multi = new MultiPolygon();
        record.geom.forEach(geom => {
          multi.appendPolygon(
            wktFormat.readGeometry(geom, {
              dataProjection: 'EPSG:4326',
              featureProjection: this._map.getView().getProjection()
            })
          );
        });
        feature.setGeometry(multi);
      } else {
        feature.setGeometry(
          wktFormat.readGeometry(geom, {
            dataProjection: 'EPSG:4326',
            featureProjection: this._map.getView().getProjection()
          })
        );
      }

      this._featuresSource.addFeature(feature);
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
    },
    setSpatialFilter: (minX, minY, maxX, maxY) => {
      dispatch(setSpatialFilter(minX, minY, maxX, maxY));
      dispatch(updateSearchResults());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);
