import React from "react";
import {useState,useEffect} from "react";
import {
    GoogleMap,
    StreetViewPanorama,
    Marker,
  } from "@react-google-maps/api";

import "./RoundPlay.css";

import {getScore} from "../../utils/GameUtils"

import markerDefault from "../../assets/markerDefault.svg"

// Map variables

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


// Streetview variables
  const streetviewContainerStyle = {
      width: "100%",
      height: "100%"
  }

  const streetviewOptions = {
    disableDefaultUI: true,
    clickToGo: true,
    showRoadLabels: false,
    visible: true,
  };
  


// distance formula for given longtitute and latitude
function calculateDistance(lat1,
                     lat2, lon1, lon2)
    {
        lon1 =  lon1 * Math.PI / 180;
        lon2 = lon2 * Math.PI / 180;
        lat1 = lat1 * Math.PI / 180;
        lat2 = lat2 * Math.PI / 180;
   
        let dlon = lon2 - lon1;
        let dlat = lat2 - lat1;
        let a = Math.pow(Math.sin(dlat / 2), 2)
                 + Math.cos(lat1) * Math.cos(lat2)
                 * Math.pow(Math.sin(dlon / 2),2);   
        let c = 2 * Math.asin(Math.sqrt(a));
        // Radius of earth in kilometers R = 6371. Use 3956
        // for miles
        let r = 6371;
        // calculate the result
        return(c * r);
    };

function RoundPlay({trueLocation,setShowView,guessedLocations,setGuessedLocations,distances,setDistances,scores,setScores,
  currentTime,setIsCountdownStart}) {
  // Marker's position
  const [markerPosition,setMarkerPosition] = useState();

  const [mapClicked, setMapClicked] = useState(false);



// Handle the clicks on map (set the marker position on click)
  const handleMapClick = (event) =>{
    setMarkerPosition({lat: event.latLng.lat(),
                       lng: event.latLng.lng()});
    setMapClicked(true);
     };

  // calculate the distance and show alert when guess button is clicked
  const handleGuessButton = () =>{
    // turn off the timer
    setIsCountdownStart(false);
    //push the guessed position into guessedPositions variable
    setGuessedLocations(guessedLocations => [...guessedLocations,markerPosition]);

    // calculate distance
    let roundDistance = calculateDistance(trueLocation.lat,markerPosition.lat,trueLocation.lng,markerPosition.lng);
    // push round distance to distances array
    setDistances(distances=>[...distances,roundDistance]);

    // calculate score
    let roundScore = getScore(roundDistance,12000);
    // push round score to scores array
    setScores(scores =>[...scores,roundScore]);
    
    setShowView("RoundEnd");
  
     };


    return(
        <div class= "play-game-container">
        {/* Google Map  */}
        <div class='map-view'>
        <h1>{currentTime}</h1>
          <GoogleMap mapContainerStyle={mapContainerStyle} 
            zoom ={1} 
            center={mapCenter} 
            options ={mapOptions}
            onClick={handleMapClick}>
              <Marker position = {markerPosition}
                      icon={{url:markerDefault,
                             scaledSize: new window.google.maps.Size(35,35)
                             }}/>
          </GoogleMap>
        </div>
    
        {/* Streetview */}
        <div class='street-view'>
          <GoogleMap
            mapContainerStyle={streetviewContainerStyle}
            zoom={14}
            
          >
            <StreetViewPanorama
                  position={trueLocation}
                  visible={true}
                  options={streetviewOptions}

                />
          </GoogleMap>
        </div>
  
        <div class = "play-game-footer">
        </div>
        <button type="button" id = "guessBtn" class="btn btn-primary" onClick={handleGuessButton} disabled={!mapClicked}>Guess</button>
  
      </div>
    )
}


export default RoundPlay