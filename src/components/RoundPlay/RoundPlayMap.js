import React from 'react'
import { GoogleMap,Marker} from '@react-google-maps/api';
import markerDefault from "../../assets/markerDefault.svg";

const mapContainerStyle= {
    width: "100%",
    height: "100%",
  };

  const mapCenter = {
    lat:36,
    lng:-16
  };
  
  const mapOptions = {
    disableDefaultUI: true,
  };

function RoundPlayMap({markerPosition,handleMapClick,isLoaded}) {
  

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    // const bounds = new window.google.maps.LatLngBounds();
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={1}
        options ={mapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick = {handleMapClick}
      >
        <Marker position = {markerPosition}
                      icon={{url:markerDefault,
                             scaledSize: new window.google.maps.Size(35,35)
                             }}/>

        <></>
      </GoogleMap>
  ) : <></>
}

export default React.memo(RoundPlayMap)