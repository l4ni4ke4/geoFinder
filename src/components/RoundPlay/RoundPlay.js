import React from "react";
import {useState,useEffect} from "react";

import { useSound } from "use-sound";

import {useLocation} from 'react-router-dom';
import "./RoundPlay.css";

import {getScore,calculateDistance} from "../../utils/GameUtils"


import RoundTimer from "../RoundTimer";

import BeepSound from "../../assets/beep.mp3";
import RoundPlayMap from "./RoundPlayMap";
import RoundPlayStreetview from "./RoundPlayStreetview";
import { db } from "../../firebase";
import { setGameState, toggleIsClickedGuess } from "../../utils/DbUtils";



function RoundPlay({lobbyId,userId,isClickedGuess,trueLocation,setShowView,guessedLocations,distances,scores,markerPosition,setMarkerPosition,
  roundTime, currentRound, rounds, enableMovement, enablePan, enableZooming,isLoaded}) {



  const [isTimerActive, setIsTimerActive] = useState(false);

  const [mapClicked, setMapClicked] = useState(false);

  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(roundTime);
  const [isAllClicked,setIsAllClicked] = useState(false);

  

  const streetviewOptions = {
    disableDefaultUI: true,
    panControl: true,
    panControlOptions: {
      position: window.google.maps.ControlPosition.BOTTOM_LEFT
    },
    clickToGo: enableMovement,
    scrollwheel: enableZooming,
    linksControl: false,
    showRoadLabels: false,
    visible: true,
    enableCloseButton: false
  };

  // keyboard handler for enabling/disabling key presses according to game rules
  window.addEventListener(
    'keydown',
    (event) => {
      // if zooming is unallowed in game rules, below code disables keyboard inputs
      if (!enableZooming) {
        if (
          (event.key === '+' || // Zoom in
          event.key === '=' || // Zoom in
          event.key === '_' || // Zoom out
          event.key === '-') // Zoom out
          &&
          !event.metaKey &&
          !event.altKey &&
          !event.ctrlKey
        ) {
          event.stopPropagation();
        }
      }
      // if movement is unallowed in game rules, below code disables keyboard inputs
      if (!enableMovement) {
        if (
          (event.key === 'ArrowUp' || // Move forward
          event.key === 'ArrowDown') // Move backward
          &&
          !event.metaKey &&
          !event.altKey &&
          !event.ctrlKey
        ) {
          event.stopPropagation();
        }
      }
      // if camera Pan is unallowed in game rules, below code disables keyboard inputs
      /* if (!enablePan) {
        if (
          (event.key === 'ArrowLeft' || // Pan left
          event.key === 'ArrowRight') // Pan right
          &&
          !event.metaKey &&
          !event.altKey &&
          !event.ctrlKey
        ) {
          event.stopPropagation();
        }
      } */
    },
    { capture: true },
  );

  // last 5 seconds alert beep sound
  const [playBeep] = useSound(BeepSound);

  

  //Activate the timer on inital render
  useEffect(()=>{
    setIsTimerActive(true);
  },[])

  //Checks if current time is smaller than 0
  useEffect(() => {
        if(currentTime < 1){
          setIsTimerActive(false);
          setGameState({lobbyId,gameState:"RoundEnd"})
          // handleGuessButton();
          // setIsTimerActive(false);
          setCurrentTime(roundTime);
        }
        else if (currentTime >= 1 && currentTime < 6) {
          playBeep();
        }
      }, [currentTime])


// Handle the clicks on map (set the marker position on click)
  const handleMapClick = (event) =>{
    setMarkerPosition({lat: event.latLng.lat(),
                       lng: event.latLng.lng()});
    console.log(markerPosition);
    setMapClicked(true);
     };

  // calculate the distance and show alert when guess button is clicked
  const handleGuessButton = async() =>{

    toggleIsClickedGuess({lobbyId,userId});
    //check if everyone else clicked guess
    //if true: 
    const queryCheckIfAllGuessed = db.collection("lobbies").doc(`${lobbyId}`).collection("gameUsers")
                                      .where("isClickedGuess","==",false);
    
    queryCheckIfAllGuessed.get().then((querySnapshot)=>{
      if(querySnapshot.empty){
        // everyone clicked guess
          // turn off the timer
        setIsTimerActive(false);
        setGameState({lobbyId,gameState:"RoundEnd"})
      }
      else {
        // some people havent clicked guess yet

      }

    })
    // push round distance to distances array
    // setDistances(distances=>[...distances,roundDistance]);

    
    // push round score to scores array
    // setScores(scores =>[...scores,roundScore]);
    
    // setShowView("RoundEnd");
  
     };



     
    

    return(
        <div class= "play-game-container">
        {/* Google Map  */}
        <div class='map-view'>
          <RoundPlayMap markerPosition={markerPosition}
                        handleMapClick = {handleMapClick}
                        isLoaded = {isLoaded}
          />
        </div>
    
        {/* Streetview */}
        <div class='street-view'>
          <RoundPlayStreetview trueLocation = {trueLocation}
                               streetviewOptions = {streetviewOptions}
                               isLoaded = {isLoaded}
          />
        </div>
  
        <div class = "play-game-footer">
          <div class= "game-info-section">
            <button type="button" id = "roundInfoButton" class="btn btn-light" disabled >Round: {currentRound+1}/{rounds} </button>
            <RoundTimer isTimerActive={isTimerActive}
                        roundTime ={roundTime}
                        currentTime={currentTime}
                        setCurrentTime={setCurrentTime}/> 
          </div>
          {!isClickedGuess ? 
          <button type="button" id = "guessBtn" class="btn btn-primary" onClick={handleGuessButton} disabled={!mapClicked}>Guess</button>
          :<button type="button" id = "guessBtn" class="btn btn-secondary" onClick={handleGuessButton} disabled={!mapClicked}>Waiting for others</button>
           }
        </div>
          
      </div>
    )
    
}


export default RoundPlay