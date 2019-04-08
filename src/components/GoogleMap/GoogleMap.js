import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import * as MarkerClusterer from '@google/markerclusterer';

import { utils } from '../../utils';

const mapStyles = {
  width: '100%',
  height: '600px',
  textAlign: 'center'
};

function isInfoWindowOpen(infoWindow){
    var map = infoWindow.getMap();
    return (map !== null && typeof map !== "undefined");
}

export class GoogleMap extends Component {

  loading = () => utils.loaders.MapLoader;

  infoWindow = null;
  currentInteractiveMarker = null;
  markerEls = [];
  markerCluster = null;
  heatmapLayers = [];

  onMarkerClick = (marker, markerEl) => {
    if (this.props.onMarkerSelected && typeof this.props.onMarkerSelected === "function") {
      this.props.onMarkerSelected(marker.obj ? marker.obj : marker);
    }
  };

  componentDidUpdate(prevProps) {
    const { markers, updating, forceRefresh } = this.props;
    let refresh = false;
    if (this.heatmapLayers.length > 0) {
      this.cleanLayers();
      refresh = true;
    }
    if (forceRefresh || markers.length !== prevProps.markers.length || updating) {
      this.cleanMarkers();
      refresh = true;
    }
    if (refresh && this.map && this.maps) {
      this.loadMap(this.map, this.maps);
    }
  }

  zoomToMarkers = (markers, map, maps) => {
    var bounds = new maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
     bounds.extend(markers[i].getPosition());
    }

    map.fitBounds(bounds);
  }

  setMapOnMarkers = (map) => {
    this.markerEls.forEach(marker => {
      marker.setMap(map);
    });
  }

  hideMarkers = () => {
    this.setMapOnMarkers(null);
  }

  cleanMarkers = () => {
    this.hideMarkers();
    this.markerEls = [];
    if (this.markerCluster) {
      this.markerCluster.clearMarkers();
      this.markerCluster = null;
    }
  }

  cleanLayers = () => {
    this.heatmapLayers.forEach(heatmapLayer => {
      heatmapLayer.setMap(null);
    });
    this.heatmapLayers = [];
  }

  loadMap = (map, maps) => {
    var bounds = new maps.LatLngBounds();
    this.infowindow = new maps.InfoWindow();
    this.props.markers.forEach((marker, idx) => {
      var mar = {
        position: {
          lat: Number.parseFloat(marker.latitude),
          lng: Number.parseFloat(marker.longitude)
        },
        title: marker.name,
        map: map
      };

      if (!!marker.iconUrl) {
        mar.icon = {
          url: marker.iconUrl,
        }
        if (this.props.scaleMarkers && this.props.scaleMarkers.length === 2) {
          mar.icon.scaledSize = new maps.Size(this.props.scaleMarkers[0], this.props.scaleMarkers[1])
        }
      } else if (!!marker.icon) {
        mar.icon = marker.icon;
      }
      mar = new maps.Marker(mar);

      mar.addListener('click', (e) => {
        this.infowindow.setContent(marker.infowindowText || marker.name);
        this.infowindow.open(map, mar);
        this.onMarkerClick(marker, mar);
        if (e && e.va) e.va.stopPropagation();
      });

      this.markerEls.push(mar);
      bounds.extend(mar.getPosition());
    });

    if (this.markerEls.length > 0) {
      map.fitBounds(bounds);
    }

    if (this.markerEls.length > 250) {
      this.markerCluster = new MarkerClusterer(map, this.markerEls, {
        maxZoom: 12,
        gridSize: 10,
        // imagePath: 'images/mapmarkers/m',
        styles: [{
          url: 'images/mapmarkers/m1.svg',
          height: 24,
          width: 24,
          anchor: [0, 0],
          textColor: '#333333',
          textSize: 10,
          backgroundPosition: '5,5'
        },{
          url: 'images/mapmarkers/m2.svg',
          height: 26,
          width: 26,
          anchor: [0, 0],
          textColor: '#333333',
          textSize: 11,
          backgroundPosition: '6,6'
        }, {
          url: 'images/mapmarkers/m3.svg',
          height: 28,
          width: 28,
          anchor: [0, 0],
          textColor: '#333333',
          textSize: 12,
          backgroundPosition: '7,7'
        }]
      });
    }

    // Construct the paths.
    this.props.paths.forEach((path, idx) => {
      var line = new maps.Polyline({
        path: path.coordinates,
        strokeColor: path.pathColor,
        strokeOpacity: 1,
        strokeWeight: 4,
        icons: [{ 
          icon: "hello",
          offset: '0',
          repeat: '10px'
        }],
      });

      line.setMap(map);
    });

    // Construct the polygons.
    this.props.polygons.forEach((polygon, idx) => {
      var poly = new maps.Polygon({
        paths: polygon.coordinates,
        strokeColor: polygon.lineColor,
        strokeOpacity: 1,
        strokeWeight: 2,
        icons: [{ 
          icon: "hello",
          offset: '0',
          repeat: '10px'
        }]
      });

      poly.setMap(map);
    });

    if (!!this.props.heatmapLayers) {
      this.props.heatmapLayers.forEach(heatmapLayer => {
        this.heatmapLayers.push(new maps.visualization.HeatmapLayer(Object.assign(
          heatmapLayer, {
            map: map,
            data: heatmapLayer.data.map(point => {
              return {
                location: new maps.LatLng(point.latitude, point.longitude),
                weight: point.weight
              }
            })
          })
        ));
      });
    }
  }

  onGoogleApiLoaded = (map, maps) => {
    // Construct the markers.
    this.map = map;
    this.maps = maps;
    
    this.loadMap(map, maps);
  };
 
  onMapClicked = ({x, y, lat, lng, event}) => {
    if (isInfoWindowOpen(this.infowindow)) {
      this.infowindow.close();
      return;
    }
    if (this.props.onMapClicked && typeof this.props.onMapClicked === 'function') {
      this.props.onMapClicked(lat, lng);
    }
    if (this.props.isInteractive) {
      if (this.currentInteractiveMarker !== null) {
        this.currentInteractiveMarker.setMap(null);
        this.currentInteractiveMarker = null;
      }
      this.currentInteractiveMarker = new this.maps.Marker({
        position: {
          lat: lat,
          lng: lng
        },
        title: "Current Forecast",
        map: this.map,
        icon: {
          url: (this.props.defaultIcon) ? this.props.defaultIcon : null,
          scaledSize: new this.maps.Size(this.props.scaleMarkers[0], this.props.scaleMarkers[1])
        }
      });

      this.infowindow = new this.maps.InfoWindow({
        content: `<div><h1>Current Forecast</h1></div>`
      });

      this.currentInteractiveMarker.addListener('click', (e) => {
        e.va.stopPropagation();
        this.infowindow.open(this.map, this.currentInteractiveMarker);
      });
    }
  };

  render() {
    var styles = {};
    Object.assign(styles, mapStyles, this.props.extraMapStyles || {});
    const { extraMapOptions, updating } = this.props;
    const isEmpty = this.props.markers.length === 0 &&
                    this.props.paths.length === 0  &&
                    this.props.polygons.length === 0 &&
                    (!this.props.heatmapLayers || this.props.heatmapLayers.length === 0);
    return (
      <div style={styles}>
        {!isEmpty || this.props.isInteractive
        ? <GoogleMapReact
            bootstrapURLKeys={{ key: this.props.apiKey }}
            defaultCenter={(extraMapOptions && extraMapOptions.center) ? extraMapOptions.center : {
             lat: -37.828730,
             lng: 145.132400
            }}
            defaultZoom={(extraMapOptions && extraMapOptions.zoom)? extraMapOptions.zoom : 7}
            yesIWantToUseGoogleMapApiInternals
            layerTypes={this.props.layers || []}
            onClick={this.onMapClicked}
            options={(extraMapOptions && extraMapOptions.extra) || {}}          
            heatmapLibrary={true}
            onGoogleApiLoaded={({ map, maps }) => this.onGoogleApiLoaded(map, maps)}
          />
        : (this.props.isFetchingData ?
           utils.loaders.MapLoader({style: { height: this.props.loaderHeight, margin: this.props.loaderMargin }}) :
           <h2>{this.props.emptyText || "No data available."}</h2>)}
      </div>
    );
  }
}

export default GoogleMap;