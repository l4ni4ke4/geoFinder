
import React from "react";
import { useState, useEffect } from "react";
import "./GamePage.css";
import {
  useLoadScript
} from "@react-google-maps/api";
import {useLocation} from 'react-router-dom';

import randomStreetView from 'random-streetview';

import RoundPlay from "../../components/RoundPlay/RoundPlay";
import RoundEnd from "../../components/RoundEnd/RoundEnd";
import RoundStart from "../../components/RoundStart/RoundStart";
import GameResults from "../../components/GameResults/GameResults";

const libraries = ["places"]; // for useLoadScript below

export default function GamePage() {

  const location = useLocation();

  const variables = location.state;

  // Game Logic Variables

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
  const rounds = variables.numberOfRounds;

  // get random X (number of total rounds above) location when GamePage loads set it to trueLocations
  async function generateRandomStreetView() {
    await randomStreetView.setParameters({
      type: 'sv'
    });
    Promise.resolve(await randomStreetView.getRandomLocations(rounds)).then(value => {
      const returnedLocations = value.map((location) => {
        return { lat: location[0], lng: location[1] }
      })
      setTrueLocations(returnedLocations);
    });
  };

  useEffect(() => {
    generateRandomStreetView();
  }, []);

    
    // Add google scripts
    const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      libraries
    });

  // for loading errors
    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading maps";

  // if rounds are finished, render end game page
  if (currentRound >= rounds) {
    // Burda EndGame componenti render olcak
    return (<>
      {
        <GameResults
        guessedLocations={guessedLocations}
        trueLocations = {trueLocations}
        totalScore={totalScore}
        scores={scores}/>
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
          totalScore={totalScore} />
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
          roundTime={variables.roundTime}
          setRoundTime={variables.setRoundTime}
          currentRound={currentRound}
          rounds={rounds}
          enableMovement={variables.enableMovement}
          enablePan={variables.enablePan}
          enableZooming={variables.enableZooming}
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