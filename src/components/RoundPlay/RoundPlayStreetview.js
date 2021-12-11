import React from 'react'
import { GoogleMap, StreetViewPanorama} from '@react-google-maps/api';


const streetviewContainerStyle = {
    width: "100%",
    height: "100%"
}

function RoundPlayStreetview({trueLocation,streetviewOptions,isLoaded}) {


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
        mapContainerStyle={streetviewContainerStyle}
        zoom={14}
        >
            <StreetViewPanorama
              position={trueLocation}
              visible={true}
              options={streetviewOptions}
              onLoad={onLoad}
              onUnmount={onUnmount}

            />
      </GoogleMap>
    ) : <></>

  }


export default React.memo(RoundPlayStreetview)