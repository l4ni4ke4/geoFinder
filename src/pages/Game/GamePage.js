
import React from "react";
import { useState, useEffect } from "react";
import "./GamePage.css";
import {
  useJsApiLoader
} from "@react-google-maps/api";

import randomStreetView from 'random-streetview';

import RoundPlay from "../../components/RoundPlay/RoundPlay";
import RoundEnd from "../../components/RoundEnd/RoundEnd";
import RoundStart from "../../components/RoundStart/RoundStart";

const libraries = ["places", "drawing"]; // for useLoadScript below

export default function GamePage() {

  // Game Logic Variables

  // timer related variables

  // get this from lobby later
  const [roundTime, setRoundTime] = useState(10);
  const [currentTime, setCurrentTime] = useState(roundTime);
  const [isCountdownStart, setIsCountdownStart] = useState(false);

  // current Round at any time (starts from zero because its easier to associate it with the index of related variables this way)
  const [currentRound, setCurrentRound] = useState(0);
  // user guesses stored here
  const [guessedLocations, setGuessedLocations] = useState([]);
  // distances of each round stored here
  const [distances, setDistances] = useState([]);
  // user scores stored here
  const [scores, setScores] = useState([]);
  // total score stored here
  const [totalScore, setTotalScore] = useState(0);

  // this used for conditional rendering
  const [showView, setShowView] = useState("RoundStart");

  // true streetview locations
  const [trueLocations, setTrueLocations] = useState([]);

  // total rounds (should come from lobby settings later)
  const rounds = 5;

  // Add google scripts
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  });


  //round time countdown handler
  useEffect(() => {
    let interval = 0
    if (isCountdownStart) {
      setCurrentTime(roundTime);
      interval = setInterval(() => {
        setCurrentTime(prevTime => prevTime - 1);
      }, 1000)
    }
    else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);

  }, [isCountdownStart])



  // get random X (number of total rounds above) location when GamePage loads set it to trueLocations
  async function generateRandomStreetView() {
    await randomStreetView.setParameters({
      type: 'sv'
    });
    Promise.resolve(await randomStreetView.getRandomLocations(rounds)).then(value => {
      const returnedLocations = value.map((location) => {
        console.log(location);
        return { lat: location[0], lng: location[1] }
      })
      setTrueLocations(returnedLocations);
      console.log(trueLocations);
    });
  };

  useEffect(() => {
    generateRandomStreetView();
  }, []);


  // for loading errors
  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps";


  // if rounds are finished, render end game page
  if (currentRound >= rounds) {
    // Burda EndGame componenti render olcak
    return (<>
      {
        // GameResults 
      }

    </>
    )
  }

  else {

    return (<>
      {
        showView === "RoundStart" &&
        <RoundStart
          setShowView={setShowView}
          currentRound={currentRound}
          rounds={rounds}
          totalScore={totalScore}
          setIsCountdownStart={setIsCountdownStart} />
      }
      {
        showView === "RoundPlay" &&
        <RoundPlay
          setShowView={setShowView}
          trueLocation={trueLocations[currentRound]}
          guessedLocations={guessedLocations}
          setGuessedLocations={setGuessedLocations}
          distances={distances}
          setDistances={setDistances}
          scores={scores}
          setScores={setScores}
          currentTime={currentTime}
          setIsCountdownStart={setIsCountdownStart}
          setCurrentTime={setCurrentTime}
          roundTime={roundTime}
          setRoundTime={setRoundTime}
        />
      }
      {
        showView === "RoundEnd" &&
        <RoundEnd
          setShowView={setShowView}
          currentRound={currentRound}
          setCurrentRound={setCurrentRound}
          rounds={rounds}
          distances={distances}
          scores={scores}
          totalScore={totalScore}
          setTotalScore={setTotalScore}
          guessedLocations={guessedLocations}
          trueLocations={trueLocations} />
      }

    </>);
  }
}