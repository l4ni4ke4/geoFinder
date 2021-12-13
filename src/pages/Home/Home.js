/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import singlePlayerLogo from '../../assets/one-player-game-symbol.png';
import multiPlayerLogo from '../../assets/network_icon.png';
import './Home.css';
import { auth, db, logout } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import { Button, Modal, Form } from 'react-bootstrap';

import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore"; 

export default function Home() {

    const history = useHistory();
    const [name, setName] = useState("");
    const [user, loading, error] = useAuthState(auth);
    const [userDocumentId, setUserDocumentId] = useState(0);

    const [inviteCodeInput, setInviteCodeInput] = useState("");

    const [popupShow, setPopupShow] = useState(false);

    const handlePopupClose = () => setPopupShow(false);
    const handlePopupShow = () => setPopupShow(true);
    
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

    const singlePlayerButtonClick = () =>{ 
            /* gameId = generateRandomGameCode();
            await setDoc(doc(db, "games", gameId), {
            })  */
    
            let path = `/GameLobby`; 
            history.push(path);
    }

    async function joinExistingMultiplayerLobbyButtonClick() {
        var lobbyFound = false;
        const queryResult = await query(collection(db, "games"), where("isActive", "==", true));
        const querySnapshot = await getDocs(queryResult);
        if (querySnapshot.empty) {
            alert("no active lobbies. check next time!");
            return;
        }
        else {
            querySnapshot.forEach((doc) => {/* 
                console.log("id: " + doc.id);
                console.log("invite: " + `${inviteCodeInput}`) */
                if (doc.id === inviteCodeInput) {
                    lobbyFound = true;
                    alert("A lobby with given code found. Good Luck!");

                    const queryResult2 = query(collection(db, "games/" + doc.id + "/gameusers", where("userId", "==", `${userDocumentId}`)));
                    const querySnapshot2 = getDocs(queryResult2);
                    if (querySnapshot2.empty) {
                        setDoc(doc(db, "games/" + gameId + "/gameusers", `${userDocumentId}`), {
                            userId: db.doc('users/' + userDocumentId),
                            isHost: false,
                            isReady: false
                        });
                        let path = `/MultiplayerGameLobby`;
                        history.push(path);
                        return;
                    }
                    else {
                        alert("either you're already in this lobby or the lobby isn't active anymore.");
                        return;
                    }
                }
            });
            if (!lobbyFound) {
                alert("No lobbies exist with code: " + inviteCodeInput);
                return;
            }
        }

    }

    var gameId = 0;
    function generateRandomGameCode() {
        return Math.floor(100000000 + Math.random() * 900000000); 
    }

    //below code creates a new db game instance once user creates a new lobby.
    //user will be the host, hence have permission to change game settings and rules.
    async function createNewMultiplayerLobbyButtonClick () {
        gameId = generateRandomGameCode();
        console.log(gameId);
        console.log(userDocumentId);
        await setDoc(doc(db, "games", `${gameId}`), {
            inviteCode: gameId,
            isActive: true,
            isMultiplayer: true,
            noRounds: 5,
            timeLimit: 60,
        });
        await setDoc(doc(db, "games/" + gameId + "/gameusers", `${userDocumentId}`), {
            userId: db.doc('users/' + userDocumentId),
            isHost: true,
            isReady: false
        });
        let path = `/MultiplayerGameLobby`;
        history.push(path);
    }
    
    useEffect(() => {
        fetchUserName();
        if (loading) return;
        if (!user) return history.replace("/");
    }, [user, loading])

    return (<>

        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="/">Geofinder</a>
            <i class="icon-help fas fa-question fa-2x"></i>
            <i class="icon-language fas fa-language fa-2x"></i>

            <div class="container home-top-right-flex-container flex-container justify-content-end">
                <button type="button" class="btn btn-primary">Game History</button>
                <div class="dropdown">
                    <button class="btn btn-secondary btn-profile dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {name}
                    </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a class="dropdown-item" href="/accountDetails">Account Details</a>
                        <a class="dropdown-item" href="/stats">Stats</a>
                        <a class="dropdown-item" href="/" onClick={logout}>Logout</a>
                    </div>
                </div>
            </div>

        </nav>

        <div className="home-main" style={{ height:"680px" }}>
            <div class="row" style={{ paddingTop:"9%", paddingLeft: "11%", width:"fitContent" }}>
                <div class="col-sm-3">
                    <div class="card" style={{ height: "400px", backgroundColor: "gainsboro", color: "white", cursor: "pointer" }} onClick={singlePlayerButtonClick}>
                        <h1 style={{ textAlign: "center" }}>Single Player</h1>
                        <img src={singlePlayerLogo} width="80%" class="sp-image image"></img>
                    </div>
                </div>
                <div class="col-sm-3" style={{ marginLeft: "2%" }}>
                    <div class="card" style={{ height: "400px", backgroundColor: "gainsboro", color: "white", cursor: "pointer" }} onClick={handlePopupShow}>
                        <h1 style={{ textAlign: "center" }}>Multiplayer</h1>
                        <img src={multiPlayerLogo} width="80%" class="mp-image image"></img>
                    </div>
                </div>
                <Modal show={popupShow} style={{ marginTop: "15%" }} onHide={handlePopupClose}>
                    <Modal.Header closeButton>
                        <h1 style={{ textAlign: "center" }}>Multiplayer</h1>
                    </Modal.Header>
                    <Modal.Body>
                        <a>Enter lobby link: </a>
                        <input type="text" id="lobbyLinkTextBox" name="fname" onChange={(event) => setInviteCodeInput(event.target.value)} onInput={(event) => setInviteCodeInput(event.target.value)}></input>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={createNewMultiplayerLobbyButtonClick}>
                            Create new Lobby
                        </Button>
                        <Button variant="danger" onClick={joinExistingMultiplayerLobbyButtonClick} disabled={inviteCodeInput === ""}>
                            Join an existing Lobby
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div class="col-sm-4" style={{ marginLeft: "10%", marginTop: "-3%" }}>
                    <div class="card" style={{ height: "500px" }}>
                        <h2 style={{ textAlign: "center" }}>Scoreboard</h2>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Username</th>
                                    <th scope="col">Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>Berat</td>
                                    <td>3000</td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>Serdar</td>
                                    <td>2000</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>Arman</td>
                                    <td>1000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
        




    </>)

}