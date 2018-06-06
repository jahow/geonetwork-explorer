import Style from 'ol/style/style';
import Stroke from 'ol/style/stroke';
import Fill from 'ol/style/fill';

export const basicStyle = [
  new Style({
    stroke: new Stroke({
      color: '#b08770',
      width: 5
    })
  }),
  new Style({
    stroke: new Stroke({
      color: '#f3cab3',
      width: 2
    })
  })
];

export const highlightStyle = [
  new Style({
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0.4)',
      width: 6
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.4)'
    })
  }),
  new Style({
    stroke: new Stroke({
      color: 'white',
      width: 3
    })
  })
];
