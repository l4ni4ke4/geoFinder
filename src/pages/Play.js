import React from "react";
import {useState} from "react";
import {
    GoogleMap,
    StreetViewPanorama,
    Marker,
    useJsApiLoader
  } from "@react-google-maps/api";

import "./Play.css";

const libraries = ["places","drawing"]; // for useLoadScript below

  // Map variables

  const mapContainerStyle= {
    width: "700px",
    height: "500px",
  };

  const mapCenter = {
    lat:41.106196,
    lng:28.803581
  };
  
  const mapOptions = {
    disableDefaultUI: false,
  };


// Streetview variables
  const streetviewContainerStyle = {
      width: "700px",
      height: "500px",
  }
  const StreetviewPosition = {
    lat:41.106196,
    lng:28.803581
  };

  const streetviewOptions = {
    disableDefaultUI: true,
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

export default function Play() {

  // Add google scripts
  const {isLoaded, loadError} = useJsApiLoader ({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  });
  
  // Marker's position
  const [markerPosition,setMarkerPosition] = useState();


  // Handle the clicks on map (set the marker position on click)
  const handleMapClick = (event) =>{
    setMarkerPosition({lat: event.latLng.lat(),
                       lng: event.latLng.lng()});
  };

  // calculate the distance and show alert when guess button is clicked
  const handleGuessButton = () =>{
    let distance = calculateDistance(StreetviewPosition.lat,markerPosition.lat,StreetviewPosition.lng,markerPosition.lng);
    alert("Distance: "+Math.round(distance)+" (Km)");
  
  }


  // for loading errors
  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps";

    return (<>
    <h1>Game Page</h1>
  
    <div class="mapsContainer">
      {/* map on the left */}
      <div id='mapLeft'>
        <GoogleMap mapContainerStyle={mapContainerStyle} 
          zoom ={8} 
          center={mapCenter} 
          options ={mapOptions}
          onClick={handleMapClick}>
            <Marker position = {markerPosition}/>
        </GoogleMap>
      </div>
  
      {/* Streetview (map on the right) */}
      <div id='mapRight'>
        
        <GoogleMap
          mapContainerStyle={streetviewContainerStyle}
          zoom={14}
        >
          <StreetViewPanorama
                position={StreetviewPosition}
                visible={true}
                // options={streetviewOptions}
              />
        </GoogleMap>
      </div>
    </div>

    <button onClick={handleGuessButton} >Guess</button>

  
    </>);
  }