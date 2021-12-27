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

function RoundEndMap({trueLocations,guessedLocations,currentRound,gameUsers,isLoaded}) {

       
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
            <Marker position={trueLocations[currentRound]}
                    icon={{
                      url: markerTrueLocation,
                      scaledSize: new window.google.maps.Size(35, 35)
                              }} />
          {
          gameUsers.map((user)=>{
              return(
                    <div className="RoundResultMarkers" id={`100${user.id}`}>
                      <Marker position={user.guessedLocations[currentRound]}
                              label={{
                                text:user.userName,
                                color: "green"
                                }}
                              icon={{
                              url: markerDefault,
                              labelOrigin: new window.google.maps.Point(5, -3),
                              scaledSize: new window.google.maps.Size(45, 45)
                                     }} />

                      <Polyline path={[user.guessedLocations[currentRound], trueLocations[currentRound]]}
                                options={{
                                  icons: [
                                    {
                                      icon: lineSymbol,
                                      offset: "10px",
                                      repeat: "20px",
                                    },
                                          ],
                                  strokeOpacity: 0,
                                  strokeColor: "#000000"
                                          }} />

                    </div>      

              )
            })
          }
      
          <></>
        </GoogleMap>
    ) : <></>

}

export default React.memo(RoundEndMap)