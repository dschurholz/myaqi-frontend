import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';

const mapStyles = {
  width: '100%',
  height: '600px'
};

export class GoogleMap extends Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
  };

  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
    this.props.onMarkerSelected(marker.obj);
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
    var styles = Object.assign(mapStyles, this.props.extraMapStyles || {});

    return (
      <Map
        google={this.props.google}
        style={styles}
        initialCenter={{
         lat: -37.828730,
         lng: 145.132400
        }}
        zoom={7}
        onClick={this.onMapClicked}>
        {this.props.markers.map(marker => {
          return (
            <Marker onClick={this.onMarkerClick}
                key={marker[this.props.keyField]}
                name={marker.name}
                obj={marker}
                position={{
                  lat: Number.parseFloat(marker.latitude),
                  lng: Number.parseFloat(marker.longitude)
                }}  />
          );
        })}
 
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}>
            <div>
              <h1>{this.state.selectedPlace.name}</h1>
            </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper(
  (props) => ({
    apiKey: props.apiKey,
    markers: props.markers,
    keyField: props.keyField,
    onMarkerSelected: props.onMarkerSelected
  }
))(GoogleMap)