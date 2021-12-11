import React from 'react'
import {
    GoogleMap,
    Marker,
    Polyline,
    useLoadScript
  } from "@react-google-maps/api";

import markerTrueLocation from "../../assets/markerTrueLocation.svg"
import markerDefault from "../../assets/markerDefault.svg"


const lineSymbol = {
    path: "M 0,-1 0,1",
    strokeOpacity: 0.8,
    scale: 3,
  };

const mapContainerStyle= {
    width: "100%",
    height: "100%",
  };

const mapOptions = {
    disableDefaultUI: true,
  };

function RoundEndMap({trueLocations,guessedLocations,currentRound,isLoaded}) {

       
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
          center={trueLocations[currentRound]}
          zoom={4}
          options ={mapOptions}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
            <Marker position={guessedLocations[currentRound]}
                                    icon= {{url:markerDefault,
                                            scaledSize: new window.google.maps.Size(45,45)}}/>

                            <Marker position ={trueLocations[currentRound]}
                                    icon = {{url:markerTrueLocation,
                                             scaledSize: new window.google.maps.Size(35,35)}}/>
                            
                            <Polyline path ={[guessedLocations[currentRound],trueLocations[currentRound]]}
                                      options = {{
                                        icons: [
                                            {
                                              icon: lineSymbol,
                                              offset: "10px",
                                              repeat: "20px",
                                            },
                                          ],
                                        strokeOpacity:0,
                                        strokeColor:"#000000"
                                      }}
                                      />            
          <></>
        </GoogleMap>
    ) : <></>

}

export default React.memo(RoundEndMap)