import React from "react";
import {useState,useEffect} from "react";
import "./GamePage.css";
import {
  useJsApiLoader
} from "@react-google-maps/api";

import randomStreetView from 'random-streetview';

import RoundPlay from "../../components/RoundPlay/RoundPlay";
import RoundEnd from "../../components/RoundEnd/RoundEnd";
import RoundStart from "../../components/RoundStart/RoundStart";

const libraries = ["places","drawing"]; // for useLoadScript below

export default function GamePage() {

  const [streetviewPosition, setStreetViewPosition] = useState({
    lat: null,
    lng: null
  });

  async function generateRandomStreetView() {
    Promise.resolve(await randomStreetView.getRandomLocation()).then(value => {
      console.log(value);
      setStreetViewPosition({
        lat: value[0],
        lng: value[1]
      });
    });
  };


  useEffect(() => {
    generateRandomStreetView();
  }, []);

  // Add google scripts
    const {isLoaded, loadError} = useJsApiLoader ({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      libraries
    });
    
  // for loading errors
  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps";

    return (<>
      {/* <RoundPlay streetviewPosition = {streetviewPosition}/> */}
      <RoundEnd/>
    </>);
  }