import { useEffect, useRef } from 'react';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Style, Icon } from 'ol/style';
import LayerTile from 'ol/layer/Tile.js';
import SourceOSM from 'ol/source/OSM.js';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { defaults as defaultControls } from 'ol/control.js';
import { Box, Stack, Typography } from '@mui/material';

const LocationPicker = ({ location = { lon: 0, lat: 0 }, onLocationChange, disabled = false, subtitle, editMode = false }) => {
  const mapRef = useRef();
  const markerRef = useRef();

  useEffect(() => {
    const defaultCenter = fromLonLat([95.7129, 37.0902]); // USA Default Center
    const initialCenter = location.lon && location.lat ? fromLonLat([location.lon, location.lat]) : defaultCenter;
    const zoom = 1;

    const map = new Map({
      target: mapRef.current,
      layers: [
        new LayerTile({
          source: new SourceOSM({
            attributions: [
              '© <a href="https://geocode.maps.co/">Map data contributors</a>.',
              '© OpenStreetMap contributors.',
            ],
          }),
        }),
      ],
      controls: defaultControls({
        attribution: false,
        rotate: false,
        attributionOptions: { collapsed: true, collapsible: false },
      }),
      view: new View({
        center: initialCenter,
        zoom,
      }),
    });

    const vectorLayer = new VectorLayer({
      source: new VectorSource(),
    });

    map.addLayer(vectorLayer);
    addMarkers(map, vectorLayer, location, markerRef);

    if (editMode) {
      map.on('click', function (event) {
        const clickedCoordinate = toLonLat(event.coordinate); 
        const [lon, lat] = clickedCoordinate;
        updateMarker(vectorLayer, lon, lat, markerRef);
        // If onLocationChange callback is provided, call it with new location
        if (onLocationChange) {
          onLocationChange({ lon, lat });
        }
      });
    }
    return () => {
      map.setTarget(null);
    };
  }, [location, onLocationChange]);

  if (disabled) {
    return null;
  }

  return (
    <Stack
      sx={{
        height: { xs: '15vh' },
        width: { xs: '100%', sm: '100%' },
      }}
    >
      <Typography variant="caption">{subtitle}</Typography>
      <Box sx={{ height: 'inherit', width: 'inherit', borderRadius: 2 }}>
        <Box sx={{ height: '100%', width: '100%' }} ref={mapRef} />
      </Box>
    </Stack>
  );
};

/**
 * Add markers to the vector layer and center the map view.
 *
 * @param {Object} map The OpenLayers map instance
 * @param {Object} vectorLayer The OpenLayers vector layer to add markers to
 * @param {Object} location The location to add a marker for
 */
const addMarkers = (map, vectorLayer, location, markerRef) => {
  const { lon, lat } = location;
  if (lon && lat) {
    const geometry = new Point(fromLonLat([lon, lat]));
    const feature = new Feature({
      geometry,
      notesInfo: location,
    });

    const markerStyle = new Style({
      image: new Icon({
        src: '/blueLocation.svg',
        scale: 0.4,
        anchor: [0.5, 0.5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        crossOrigin: 'anonymous',
      }),
    });

    feature.setStyle(markerStyle);
    vectorLayer.getSource().addFeature(feature);
    map.getView().setCenter(fromLonLat([lon, lat]));
    map.getView().setZoom(10);
    markerRef.current = feature; // Save the feature to the markerRef for future updates
  }
};

/**
 * Update the position of the marker on the map.
 *
 * @param {Object} vectorLayer The vector layer containing the marker
 * @param {Number} lon The longitude of the new location
 * @param {Number} lat The latitude of the new location
 */
const updateMarker = (vectorLayer, lon, lat, markerRef) => {
  const geometry = new Point(fromLonLat([lon, lat]));
  if (markerRef.current) {
    markerRef.current.setGeometry(geometry);
  } else {
    // If no marker exists, add a new one
    const feature = new Feature({ geometry });
    vectorLayer.getSource().addFeature(feature);
    markerRef.current = feature;
  }
};

export default LocationPicker;
