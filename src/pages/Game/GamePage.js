import React from "react";
import {useState} from "react";
import {
    useJsApiLoader
  } from "@react-google-maps/api";

import "./GamePage.css";
import RoundPlay from "../../components/RoundPlay/RoundPlay";

const libraries = ["places","drawing"]; // for useLoadScript below

// process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
export default function GamePage() {

  // Add google scripts
  const {isLoaded, loadError} = useJsApiLoader ({
    googleMapsApiKey: null,
    libraries
  });
  

  // for loading errors
  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps";

    return (<>
      <RoundPlay/>
    </>);
  }