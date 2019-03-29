import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import * as MarkerClusterer from '@google/markerclusterer';

import { utils } from '../../utils';

const mapStyles = {
  width: '100%',
  height: '600px',
  textAlign: 'center'
};

export class GoogleMap extends Component {

  loading = () => utils.loaders.MapLoader;

  openInfoWindow = null;
  currentInteractiveMarker = null;
  markerEls = [];
  markerCluster = null;

  onMarkerClick = (marker, markerEl) => {
    if (this.props.onMarkerSelected && typeof this.props.onMarkerSelected === "function") {
      this.props.onMarkerSelected(marker.obj ? marker.obj : marker);
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.markers.length > 0 && this.props.markers.length !== prevProps.markers.length) {
      this.cleanMarkers();
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

  loadMap = (map, maps) => {
    var bounds = new maps.LatLngBounds();
    this.props.markers.forEach((marker, idx) => {
      var mar = new maps.Marker({
        position: {
          lat: Number.parseFloat(marker.latitude),
          lng: Number.parseFloat(marker.longitude)
        },
        title: marker.name,
        map: map,
        icon: {
          url: (marker.iconUrl) ? marker.iconUrl : null,
          scaledSize: new maps.Size(this.props.scaleMarkers[0], this.props.scaleMarkers[1])
        }
      });

      var infowindow = new maps.InfoWindow({
        content: `<div><h1>` + marker.name + `</h1></div>`
      });

      mar.addListener('click', (e) => {
        infowindow.open(map, mar);
        this.openInfoWindow = infowindow;
        this.onMarkerClick(marker, mar);
        if (e && e.va) e.va.stopPropagation();
      });

      this.markerEls.push(mar);
      bounds.extend(mar.getPosition());
    });

    map.fitBounds(bounds);

    if (this.markerEls.length > 200) {
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
  }

  onGoogleApiLoaded = (map, maps) => {
    // Construct the markers.
    this.map = map;
    this.maps = maps;
    
    this.loadMap(map, maps);
  };
 
  onMapClicked = ({x, y, lat, lng, event}) => {
    if (this.openInfoWindow !== null) {
      this.openInfoWindow.close();
      this.openInfoWindow = null;
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

      var infowindow = new this.maps.InfoWindow({
        content: `<div><h1>Current Forecast</h1></div>`
      });

      this.currentInteractiveMarker.addListener('click', (e) => {
        e.va.stopPropagation();
        infowindow.open(this.map, this.currentInteractiveMarker);
        this.openInfoWindow = infowindow;
      });
    }
  };

  render() {
    var styles = {};
    Object.assign(styles, mapStyles, this.props.extraMapStyles || {});
    const isEmpty = this.props.markers.length === 0 &&
                    this.props.paths.length === 0  &&
                    this.props.polygons.length === 0;
    return (
      <div style={styles}>
        {!isEmpty || this.props.isInteractive
        ? <GoogleMapReact
            bootstrapURLKeys={{ key: this.props.apiKey }}
            defaultCenter={{
             lat: -37.828730,
             lng: 145.132400
            }}
            defaultZoom={7}
            yesIWantToUseGoogleMapApiInternals
            layerTypes={this.props.layers || []}
            onClick={this.onMapClicked}
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