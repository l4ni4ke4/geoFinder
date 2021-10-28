import React from "react";
import {useState, useEffect} from "react";
import {
    useJsApiLoader
  } from "@react-google-maps/api";

import randomStreetView from 'random-streetview';

import "./GamePage.css";
import RoundPlay from "../../components/RoundPlay/RoundPlay";

const libraries = ["places","drawing"]; // for useLoadScript below



/* const StreetviewPosition = {
  lat:41.106196,
  lng:28.803581
}; */

var returnLocation = [];

async function generateRandomStreetView() {
  Promise.resolve(await randomStreetView.getRandomLocation()).then(value => {
    returnLocation = value;
  });
}



export default function GamePage() {

  useEffect(() => {
    generateRandomStreetView();
  }, []);

  const StreetviewPosition = {
    lat: returnLocation[0],
    lng: returnLocation[1]
  };

  // Add google scripts
  const {isLoaded, loadError} = useJsApiLoader ({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  });
  

  // for loading errors
  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps";

    return (<>
      <RoundPlay/>
    </>);
  }