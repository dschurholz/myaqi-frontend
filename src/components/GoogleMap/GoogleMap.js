import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

import { utils } from '../../utils';

const mapStyles = {
  width: '100%',
  height: '600px',
  textAlign: 'center'
};

export class GoogleMap extends Component {

  loading = () => utils.loaders.MapLoader;

  onMarkerClick = (marker, markerEl) => {
    if (this.props.onMarkerSelected && typeof this.props.onMarkerSelected === "function") {
      this.props.onMarkerSelected(marker.obj ? marker.obj : marker);
    }
  };

  onGoogleApiLoaded = (map, maps) => {
    // Construct the markers.
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

      mar.addListener('click', () => {
        infowindow.open(map, mar);
        this.onMarkerClick(marker, mar);
      });
    });

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
  };
 
  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };

  render() {
    var styles = Object.assign(this.props.extraMapStyles, mapStyles || {});
    const isEmpty = this.props.markers.length === 0 &&
                    this.props.paths.length === 0  &&
                    this.props.polygons.length === 0;
    return (
      <div style={styles}>
        {!isEmpty
        ? <GoogleMapReact
            bootstrapURLKeys={{ key: this.props.apiKey }}
            defaultCenter={{
             lat: -37.828730,
             lng: 145.132400
            }}
            defaultZoom={7}
            yesIWantToUseGoogleMapApiInternals
            layerTypes={this.props.layers || []}
            onGoogleApiLoaded={({ map, maps }) => this.onGoogleApiLoaded(map, maps)}
          />
        : (this.props.isFetchingData ?
           utils.loaders.MapLoader({style: { height: this.props.loaderHeight, margin: this.props.loaderMargin }}) :
           <h2>No data available.</h2>)}
      </div>
    );
  }
}

export default GoogleMap;