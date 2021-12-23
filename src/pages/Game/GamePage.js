
import React from "react";
import { useState, useEffect } from "react";
import "./GamePage.css";

import {useLocation} from 'react-router-dom';

import RoundPlay from "../../components/RoundPlay/RoundPlay";
import RoundEnd from "../../components/RoundEnd/RoundEnd";
import RoundStart from "../../components/RoundStart/RoundStart";
import GameResults from "../../components/GameResults/GameResults";
import {useLoadScript,useJsApiLoader} from '@react-google-maps/api';

import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import useLobby from "../../Hooks/useLobby";
import useGameUser from "../../Hooks/useGameUser";
import useGameUsers from "../../Hooks/useGameUsers";


export default function GamePage() {

  const { isLoaded } = useLoadScript({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  })

  const location = useLocation();

  const variables = location.state;

  // Marker's position
  const [markerPosition,setMarkerPosition] = useState();


  // fetch game state from db
  // lobbyId = JA9myMkBRXp3AJxbAWFl
  const lobbyId = "JA9myMkBRXp3AJxbAWFl" // this should come from lobby page
  const {isFetchingLobby,lobby} = useLobby(lobbyId);

  // fetch user state from db
  const [user, loading, error] = useAuthState(auth);
  const {uid:userId} = user;
  const {isFetchingUser, gameUser} = useGameUser({lobbyId,userId});
  const {isFetchingUsers, gameUsers} = useGameUsers({lobbyId})

  // get Game Logic Variables
  if(isFetchingLobby) return <h1>Loading Lobby</h1>
  if(!lobby) return <h1>Lobby Not Found</h1>
  if(isFetchingUser) return <h1>Loading Lobby</h1>
  if(!gameUser) return <h1>???</h1>
  if(isFetchingUsers) return <h1>Loading Lobby Users</h1>

  
  const {currentRound,gameState:showView, trueLocations, noRounds:rounds} = lobby;
  // set user specific variables
  const {isHost,isClickedGuess,guessedLocations,distances,scores,totalScore} = gameUser;
  
  // const [user, loading, error] = useAuthState(auth);
  // const {uid} = user;
  // const {gameUsers} = useGameUsers({lobbyId:"JA9myMkBRXp3AJxbAWFl",userId:uid});
  // console.log(gameUsers);

  // current Round at any time (starts from zero because its easier to associate it with the index of related variables this way)
  // const [currentRound, setCurrentRound] = useState(0);
  // user guesses stored here
  // const [guessedLocations, setGuessedLocations] = useState([]);
  // distances of each round stored here
  // const [distances, setDistances] = useState([]);
  // user scores stored here
  // const [scores, setScores] = useState([]);
  // total score stored here
  // const [totalScore, setTotalScore] = useState(0);

  // this used for conditional rendering
  // const [showView, setShowView] = useState("RoundStart");

  // true streetview locations
  // const [trueLocations, setTrueLocations] = useState([]);

  // total rounds (should come from lobby settings later)
  // const rounds = variables.numberOfRounds;

  // useEffect(()=>{
  //   setTrueLocations(variables.fetchedLocations);
  //   },[])





  // if rounds are finished, render end game page 
  if (currentRound >= rounds) {
    // Burda EndGame componenti render olcak
    return (<>
      {
        <GameResults
        lobbyId = {lobbyId}
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
          isHost = {isHost}
          currentRound={currentRound}
          rounds={rounds}
          totalScore={totalScore}
          lobbyId = {lobbyId} />
      }
      {
        showView === "RoundPlay" &&
        <RoundPlay
          // setShowView={setShowView}
          isClickedGuess = {isClickedGuess}
          isHost = {isHost}
          lobbyId = {lobbyId}
          userId = {userId}
          trueLocation={trueLocations[currentRound]}
          guessedLocations={guessedLocations}
          distances={distances}
          scores={scores}
          roundTime={variables.roundTime}
          setRoundTime={variables.setRoundTime}
          currentRound={currentRound}
          rounds={rounds}
          enableMovement={variables.enableMovement}
          enablePan={variables.enablePan}
          enableZooming={variables.enableZooming}
          markerPosition={markerPosition}
          setMarkerPosition={setMarkerPosition}
          isLoaded = {isLoaded}
        />
      }
      {
        showView === "RoundEnd" &&
        <RoundEnd
          gameUsers = {gameUsers}
          currentRound={currentRound}
          isHost = {isHost}
          userId = {userId}
          lobbyId={lobbyId}
          rounds={rounds}
          distances={distances}
          scores={scores}
          totalScore={totalScore}
          guessedLocations={guessedLocations}
          trueLocations={trueLocations}
          trueLocation={trueLocations[currentRound]}
          isLoaded ={isLoaded}
          markerPosition = {markerPosition}
          setMarkerPosition = {setMarkerPosition} />
      }

    </>);
  }
}