
import React from "react";
import { useState, useEffect } from "react";
import "./GamePage.css";

import {useLocation} from 'react-router-dom';

import randomStreetView from 'random-streetview';

import RoundPlay from "../../components/RoundPlay/RoundPlay";
import RoundEnd from "../../components/RoundEnd/RoundEnd";
import RoundStart from "../../components/RoundStart/RoundStart";
import GameResults from "../../components/GameResults/GameResults";

import {useLoadScript,useJsApiLoader} from '@react-google-maps/api';


export default function GamePage() {

  const { isLoaded } = useLoadScript({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  })

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
  // async function generateRandomStreetView() {
  //   Promise.resolve(randomStreetView.setParameters({
  //     type: "sv",
  //     /* polygon: [[[42,26], [36,26], [36,36], [37,45], [40,45], [42,42]]] */
  //     // google: window.google
  //     enableCaching: false
      
  //   }));
  //   Promise.resolve(randomStreetView.getRandomLocations(rounds)).then(value => {
  //     const returnedLocations = value.map((location) => {
  //       return { lat: location[0], lng: location[1] }
  //     })
  //     setTrueLocations(returnedLocations);
  //   });
  // };

  


  // useEffect(() => {
  //   if (currentRound === 0) {
  //   }
  // }, []);


  useEffect(()=>{
    setTrueLocations(variables.fetchedLocations);
    },[])



  // if rounds are finished, render end game page
  if (currentRound >= rounds) {
    // Burda EndGame componenti render olcak
    return (<>
      {
        <GameResults
        guessedLocations={guessedLocations}
        trueLocations = {trueLocations}
        totalScore={totalScore}
        scores={scores}
        isLoaded={isLoaded}/>
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
          isLoaded = {isLoaded}
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
          trueLocations={trueLocations}
          isLoaded ={isLoaded} />
      }

    </>);
  }
}