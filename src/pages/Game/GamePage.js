
import React from "react";
import { useState, useEffect } from "react";
import "./GamePage.css";

import {useLocation} from 'react-router-dom';

import RoundPlay from "../../components/RoundPlay/RoundPlay";
import RoundEnd from "../../components/RoundEnd/RoundEnd";
import RoundStart from "../../components/RoundStart/RoundStart";
import GameResults from "../../components/GameResults/GameResults";
import {useLoadScript,useJsApiLoader} from '@react-google-maps/api';

import useLobby from "../../Hooks/useLobby";
import useGameUser from "../../Hooks/useGameUser";
import useGameUsers from "../../Hooks/useGameUsers";
import ExitPopup from "../../components/ExitPopup";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import Loading from "../../components/Loading";

export default function GamePage() {

  const { isLoaded } = useLoadScript({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  })

  const location = useLocation();
  const history = useHistory();

  const variables = location.state;

  // Marker's position
  const [markerPosition,setMarkerPosition] = useState();

  // exit Lobby modal
  const [showExitModal,setShowExitModal] = useState(false);


  // fetch game state from db
  // lobbyId = JA9myMkBRXp3AJxbAWFl
  const lobbyId = variables.lobbyId // this should come from lobby page
  const isMultiplayer = variables.isMultiplayer

  const {isFetchingLobby,lobby} = useLobby(lobbyId);

  // fetch user state from db
  // const [user, loading, error] = useAuthState(auth);
  const userId = localStorage.userId;
  const {isFetchingUser, gameUser} = useGameUser({lobbyId,userId});
  const {isFetchingUsers, gameUsers} = useGameUsers({lobbyId})

  // get Game Logic Variables
  if(isFetchingLobby) return <Loading/>
  if(!lobby) return <h1>Lobby Not Found</h1>
  if(isFetchingUser) return <Loading/>
  if(!gameUser) return <h1>???</h1>
  if(isFetchingUsers) return <Loading/>

  
  
  const {currentRound,gameState:showView, trueLocations, noRounds:rounds, timeLimit, enableMovement, enableZooming} = lobby;
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



  if(showView === "Lobby"){
            history.push({
            pathname: '/GameLobby',
            state: { lobbyId: lobbyId, isMultiplayer: isMultiplayer }
        })};


  // if rounds are finished, render end game page 
  if (currentRound >= rounds) {
    // Burda EndGame componenti render olcak
    return (<>
      {
        <ExitPopup showExitModal={showExitModal}
                   setShowExitModal={setShowExitModal}
                   lobbyId={lobbyId}
                   userId={userId}
                   isHost={isHost}/>
      }
        <GameResults
        rounds = {rounds}
        isHost={isHost}
        gameUsers={gameUsers}
        gameUser = {gameUser}
        lobbyId = {lobbyId}
        guessedLocations={guessedLocations}
        trueLocations = {trueLocations}
        totalScore={totalScore}
        scores={scores}
        setShowExitModal={setShowExitModal}
        isLoaded={isLoaded}
        showView= {showView}
        isMultiplayer={isMultiplayer}
        enableMovement={enableMovement}
        enableZooming={enableZooming}
        timeLimit={timeLimit}
        
        />
      

    </>
    )
  }

  else {

    return (<>
      {
        <ExitPopup showExitModal={showExitModal}
                   setShowExitModal={setShowExitModal}
                   lobbyId={lobbyId}
                   userId={userId}
                   isHost={isHost}/>
      }
      {
        showView === "RoundStart" &&
        <RoundStart
          isHost = {isHost}
          currentRound={currentRound}
          rounds={rounds}
          totalScore={totalScore}
          lobbyId = {lobbyId}
          setShowExitModal= {setShowExitModal} />
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
          roundTime={timeLimit}
          currentRound={currentRound}
          rounds={rounds}
          enableMovement={enableMovement}
          enablePan={variables.enablePan}
          enableZooming={enableZooming}
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