/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import singlePlayerLogo from '../../assets/one-player-game-symbol.png';
import multiPlayerLogo from '../../assets/network_icon.png';
import multiPicture from "../../assets/round-start-nature-1.png";
import singlePicture from "../../assets/singleplayer.jpg";
import Vector from "../../assets/Vector.svg";
import whiteLine from "../../assets/whiteLine.png";
import './Home.css';
import { auth, db, logout } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import { Button, Modal, Form } from 'react-bootstrap';

import { doc, setDoc, collection, query, where, getDocs, getDoc } from "firebase/firestore"; 

import Loading from "../../components/Loading";

export default function Home() {

    var lobbyId = 0;
    var isMultiplayer = false;
    

    const [showDropdown,setShowDropdown] = useState(false);
    const history = useHistory();
    const [name, setName] = useState("");
    const [multiPlayerGameCode, setMultiPlayerGameCode] = useState(0);

    const [user, loading, error] = useAuthState(auth);
    const [userDocumentId, setUserDocumentId] = useState(0);

    const [inviteCodeInput, setInviteCodeInput] = useState("");

    const [popupShow, setPopupShow] = useState(false);

    const handlePopupClose = () => setPopupShow(false);
    const handlePopupShow = () => setPopupShow(true);

    const [showLoading,setShowLoading] = useState(false);

    
    const fetchUserName = async () => {
        try {
          const query = await db
            .collection("users")
            .where("uid", "==", user?.uid)
            .get();
          const data = await query.docs[0].data();
          setUserDocumentId(query.docs[0].id);
          setName(data.name);
        } catch (err) {
          console.error(err);
        }
      };

    async function singlePlayerButtonClick () { 
        setShowLoading(true);
        lobbyId = generateRandomLobbyCode();
        //setMultiPlayerGameCode(lobbyId);
        isMultiplayer = false;
        await setDoc(doc(db, "lobbies", `${lobbyId}`), {
            inviteCode: lobbyId,
            isActive: false,
            isGameStarted: false,
            isMultiplayer: false,
            currentRound: "",
            trueLocations: [],
            gameState: "Lobby",
            noRounds: 5,
            timeLimit: 60,
            enableZooming: false,
            enableMovement: false
        });
        await setDoc(doc(db, "lobbies/" + lobbyId + "/gameUsers", `${userDocumentId}`), {
            userId: db.doc('users/' + userDocumentId),
            userName: localStorage.getItem("userName"),
            isHost: true,
            guessedLocations: [],
            distances: [],
            scores: [],
            totalScore: "",
            isClickedGuess: ""
        });

        //let data = {lobbyId:lobbyId, userId: userDocumentId};
        setShowLoading(false);
        history.push({
            pathname: `/GameLobby`,
            state: { lobbyId: lobbyId, isMultiplayer: isMultiplayer }
            /* ,
            state: data */
        });
    }

    async function joinExistingMultiplayerLobbyButtonClick() {
        setShowLoading(true);
        var lobbyFound = false;
        isMultiplayer = true;
        const queryResult = await query(collection(db, "lobbies"), where("isActive", "==", true), where("isMultiplayer", "==", true));
        const querySnapshot = await getDocs(queryResult);
        if (querySnapshot.empty) {
            alert("no active lobbies. check next time!");
            setShowLoading(false);
            return;
        }
        else {
            querySnapshot.forEach((doc) => {
                if (doc.id === inviteCodeInput) {
                    lobbyFound = true;
                    lobbyId = doc.id;
                    // console.log("A lobby with given code found.");
                }
            });

            if (lobbyFound) {
                // get lobby currentRound
                const docRef = doc(db, "lobbies", `${lobbyId}`);
                const docSnap = await getDoc(docRef);
                const {currentRound:currR,gameState} = docSnap.data();

                if(gameState === "RoundPlay"){
                    alert("Round is already started, you can join next round !")
                }
                else{
                    // add nulls to db for missed rounds
                    let missedLocs = [];
                    let missedDists= [];
                    let missedScores =[];
                    
                    for(let i =0; i<currR; i++){
                        missedLocs.push(null);
                        missedDists.push("null");
                        missedScores.push(0);
                    }

                    setDoc(doc(db, "lobbies/" + lobbyId + "/gameUsers", `${userDocumentId}`), {
                        userId: db.doc('users/' + userDocumentId),
                        userName: localStorage.getItem("userName"),
                        isHost: false,
                        guessedLocations: missedLocs,
                        distances: missedDists,
                        scores: missedScores,
                        totalScore: "",
                        isClickedGuess: false
                    });
                    //setMultiPlayerGameCode(lobbyId);
                    
                    let path = `/GameLobby`;
                    history.push({
                        pathname: path,
                        state: { lobbyId: lobbyId, isMultiplayer: isMultiplayer }
                    });

                    }

            }
            if (!lobbyFound) {
                alert("No lobbies exist with code: " + inviteCodeInput);
                setShowLoading(false);
                return;
            }
        }
        setShowLoading(false)

    }

    function generateRandomLobbyCode() {
        return Math.floor(100000000 + Math.random() * 900000000); 
    }

    //below code creates a new db game instance once user creates a new lobby.
    //user will be the host, hence have permission to change game settings and rules.
    async function createNewMultiplayerLobbyButtonClick () {
        setShowLoading(true)
        lobbyId = generateRandomLobbyCode();
        //setMultiPlayerGameCode(lobbyId);
        isMultiplayer = true;
        // console.log(multiPlayerGameCode);
        // console.log(userDocumentId);
        await setDoc(doc(db, "lobbies", `${lobbyId}`), {
            inviteCode: lobbyId,
            isActive: true,
            isGameStarted: false,
            isMultiplayer: true,
            currentRound: "",
            trueLocations: [],
            gameState: "Lobby",
            noRounds: 5,
            timeLimit: 60,
            enableZooming: false,
            enableMovement: false
        });
        await setDoc(doc(db, "lobbies/" + lobbyId + "/gameUsers", `${userDocumentId}`), {
            userId: db.doc('users/' + userDocumentId),
            userName: localStorage.getItem("userName"),
            isHost: true,
            guessedLocations: [],
            distances: [],
            scores: [],
            totalScore: "",
            isClickedGuess: ""
        });
        setShowLoading(false)
        let path = `/GameLobby`;
        history.push({
            pathname: path,
            state: { lobbyId: lobbyId, isMultiplayer: isMultiplayer }
        });

    }
    
    useEffect(() => {
        fetchUserName();
        if (loading) return;
        if (!user) return history.replace("/");
    }, [user, loading])

    return (<>
    {showLoading && <Loading/>}
    <div className ="home-container">
        <div className = "navbar">
            <div className= "navbar-left ">
                    <p>About</p>
                    <p>Contact</p>
            </div>
            <div className = "navbar-center">
                    <p>GeoFinder</p>
            </div>
            <div className="navbar-right ">
                    <p id="gamehistory-p"><a id="gamehistory-a" href="/GameHistory">Game History</a></p>
                    <p className="dropdown-toggle" data-bs-toggle="dropdown" onClick={()=>setShowDropdown(!showDropdown)}>
                        {localStorage.getItem("userName")}
                    </p>
                    {showDropdown &&
                        <ul class="custom-dropdown" >
                            {/* <li><a href="/accountDetails">Account Details</a></li> */}
                            {/* <li><a href="/GameHistory">Stats</a></li> */}
                            <li><a href="/" onClick={logout}>Logout</a></li>
                        </ul>}

            </div>
        </div>
        
        <div className ="play-box-singleplayer" onClick={singlePlayerButtonClick}>
            <div className="play-box-singleplayer-left">
                <div className="play-box-left-top">
                    <p className = "play-box-left-text">Play on your own !</p>
                    <p className = "play-box-left-text2">Single Player</p>
                </div>
                <img className= "vector" src={Vector}/>
            </div>
            <div className="play-box-singleplayer-right">
                <img src={singlePicture}/>
            </div>
            
        </div>
        <div className ="play-box-multiplayer" onClick={handlePopupShow}>
            <div className="play-box-multiplayer-left" >
                <div className="play-box-left-top">
                    <p className = "play-box-left-text">Play with friends !</p>
                    <p className = "play-box-left-text2">Multiplayer</p>
                </div>
                <img className= "vector" src={Vector}/>
            </div>
            <div className="play-box-multiplayer-right">
                 <img src={multiPicture}/>
            </div>
        </div>
            <Modal show={popupShow} className="modal" onHide={handlePopupClose}>
                    <Modal.Header closeButton>
                        <p>Multiplayer</p>
                    </Modal.Header>
                    <Modal.Body className="modal-body">
                        <h2>Enter lobby link: </h2>
                        <input type="text" id="lobbyLinkTextBox" name="fname" value={inviteCodeInput} onChange={(event) => setInviteCodeInput(event.target.value)} onInput={(event) => setInviteCodeInput(event.target.value)}></input>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-dark" onClick={createNewMultiplayerLobbyButtonClick}>
                            Create new Lobby
                        </Button>
                        <Button variant="secondary" onClick={joinExistingMultiplayerLobbyButtonClick} disabled={inviteCodeInput === ""}>
                            Join an existing Lobby
                        </Button>
                    </Modal.Footer>
                </Modal>
        
                
    </div>
    


    </>)

}