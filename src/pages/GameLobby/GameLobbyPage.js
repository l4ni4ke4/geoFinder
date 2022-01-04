import React, {useState,useEffect} from "react";
import { useHistory, useLocation } from "react-router-dom";
import { generateRandomStreetViewLocations } from "../../utils/GameUtils";
import { getAllCountries } from "../../utils/Polygons";
import "./GameLobbyPage.css";

import { Button, Modal, Form } from 'react-bootstrap';

import { auth, db, logout } from "../../firebase";

import { doc, setDoc, collection, query, where, getDocs, getDoc, onSnapshot, deleteDoc } from "firebase/firestore"; 
import { setGameState, setTrueLocations, exitLobbyDb } from "../../utils/DbUtils";

import Loading from "../../components/Loading";

export default function GameLobbyPage() {

    const location = useLocation();
    //variables about game rules
    //var lobbyUsers = [];

    const [lobbyUsers, setLobbyUsers] = useState([]);

    const lobbyId = location.state.lobbyId;
    const isMultiplayer = location.state.isMultiplayer;
    //console.log("lobby id: " + lobbyId);
    
    const [popupShow, setPopupShow] = useState(false);

    const handlePopupClose = () => setPopupShow(false);
    const handlePopupShow = () => setPopupShow(true);

    const [enablePan, setEnablePan] = useState(false);
    const [enableMovement, setEnableMovement] = useState(false);
    const [enableZooming, setEnableZooming] = useState(false);

    const [dbEnableMovement, setDbEnableMovement] = useState(false);
    const [dbEnableZooming, setDbEnableZooming] = useState(false);

    const [isDbHost, setDbHost] = useState(false);

    const [roundTime, setRoundTime] = useState(60);
    const [numberOfRounds, setNumberOfRounds] = useState(5);

    const [dbRoundTime, setDbRoundTime] = useState(60);
    const [dbNumberOfRounds, setDbNumberOfRounds] = useState(5);

    const [showLoading,setShowLoading] = useState(false);

    /*country selection related variables */
    const countryList = getAllCountries();
    const [countryCheckboxListIsChecked,setCountryCheckboxListIsSelected] = useState(
        Object.assign(...(
        countryList.map((countryObj)=>{
            return(
               { [countryObj.code]:false }
            )
        })))
    );

    const [worldIsChecked,setWorldIsChecked] = useState(true);
    const [disableAllCountries,setDisableAllCountries] = useState(true);
    /********/

    const history = useHistory();
    const startGameButtonClick = async() => {
        setShowLoading(true);
        // get a country code array from selected countries
        const countryCodeArray = Object.keys(countryCheckboxListIsChecked).filter(key=>countryCheckboxListIsChecked[key] === true);

        const fetchedLocations = await generateRandomStreetViewLocations(numberOfRounds,countryCodeArray,!worldIsChecked);

        await db.collection("lobbies").doc(`${lobbyId}`).update({
            gameState:"RoundStart",
            currentRound:0,
            isGameStarted: true,
            trueLocations: fetchedLocations
        })

        await db.collection("lobbies").doc(`${lobbyId}`).collection("gameUsers").get().then((qSnapshot)=>{
            qSnapshot.forEach((docUser)=>{
                docUser.ref.update({
                    isClickedGuess:false,         
                })
            })
        })

        // await setTrueLocations({lobbyId,fetchedLocations});
        // await setGameState({lobbyId,gameState:"RoundStart"});
        // await db.collection("lobbies").doc(lobbyId).update({
        //     currentRound:0,
        //     isGameStarted: true
        // });

        let data = {enablePan: enablePan, enableMovement: dbEnableMovement, enableZooming: dbEnableZooming,
            roundTime: dbRoundTime, numberOfRounds: dbNumberOfRounds, lobbyId, isMultiplayer};
        
        setShowLoading(false);
        history.push({
            pathname: '/Game',
            state: data})

        // fetch locations when start button is clicked then update db's trueLocations
        // generateRandomStreetViewLocations(numberOfRounds,countryCodeArray,!worldIsChecked)
        // .then((fetchedLocations)=>{
        //     setTrueLocations({lobbyId,fetchedLocations})})
        // .then(()=>{
        //         setGameState({lobbyId,gameState:"RoundStart"});
        //     })
        // .then(()=>{
        //     db.collection("lobbies").doc(lobbyId).update({
        //         currentRound:0,
        //         isGameStarted: true
        //     })
        // })
        // .then(()=>{
        //     let data = {enablePan: enablePan, enableMovement: dbEnableMovement, enableZooming: dbEnableZooming,
        //         roundTime: dbRoundTime, numberOfRounds: dbNumberOfRounds, lobbyId};
            
        //     history.push({
        //         pathname: '/Game',
        //         state: data})
        //     })
    }

    const exitButtonClick = async () => {
        setShowLoading(true);
        let userId = localStorage.getItem("userId");
        console.log("is host: " + isDbHost);
        /* let host = `${isDbHost}`;
        console.log(host); */
        let isHost = isDbHost;
        exitLobbyDb({lobbyId, userId, isHost});
        //await deleteDoc(doc(db, "lobbies/" + lobbyId + "/gameUsers", localStorage.getItem("userId")));
        setShowLoading(false);
        let path = '/Home';
        history.push(path);
    }

    //render country checkboxes
    const CountryCheckboxList = () =>{
        return countryList.map((countryObj) => {
            const {country,code} = countryObj;
            return(
                <div class="custom-checkbox" key={code}>
                    <input class="form-check-input" type="checkbox" id={code} checked={countryCheckboxListIsChecked[code]}
                            onChange={handleCountryCheckbox} disabled={disableAllCountries}/>
                    <label class="form-check-label" for={code}>
                        {country}
                    </label>
                </div>
            )
        })
    }

    const handleCountryCheckbox = (event) =>{
        setCountryCheckboxListIsSelected({...countryCheckboxListIsChecked,[event.target.id]:!countryCheckboxListIsChecked[event.target.id]});
    }

    const handleWorldCheck = () => {
        setWorldIsChecked(!worldIsChecked);
        setCountryCheckboxListIsSelected(
            Object.assign(...(
                countryList.map((countryObj)=>{
                    return(
                       { [countryObj.code]:false }
                    )
                })))
        );
        setDisableAllCountries(!disableAllCountries);
    }

    const updateDbGameRules = async() => {
        setDoc(doc(db, "lobbies", `${lobbyId}`), {
            inviteCode: lobbyId,
            isActive: true,
            isGameStarted: false,
            isMultiplayer: isMultiplayer,
            currentRound: "",
            trueLocations: [],
            gameState: "",
            enableMovement: enableMovement,
            enableZooming: enableZooming,
            noRounds: numberOfRounds,
            timeLimit: roundTime,
        });
    }



    const handleSaveGameSettings = () => {
        /* setDbEnableMovement(enableMovement);
        setDbEnableZooming(enableZooming);
        setDbNumberOfRounds(numberOfRounds);
        setDbRoundTime(roundTime); */
        updateDbGameRules();
        handlePopupClose();
    }

    /* useEffect(() => {
        const docRef = db.collection("lobbies").doc(`${lobbyId}`);
        docRef.get().then((doc) => {
        console.log("Document data:", doc.data());
        setDbEnableMovement(doc.data().enableMovement);
        setDbEnableZooming(doc.data().enableZooming);
        setDbNumberOfRounds(doc.data().noRounds);
        setDbRoundTime(doc.data().timeLimit)
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }, [updateDbGameRules]) */
    
    useEffect(() =>  {

        //listener for lobby data changes
        const q2 = query(collection(db, "lobbies/"));
        const unsubscribe2 = onSnapshot(q2, (querySnapshot2) => {
            const docRef = db.collection("lobbies").doc(`${lobbyId}`);
            docRef.get().then((doc) => {
                console.log(querySnapshot2);
                console.log("Document data:", doc.data());
                setDbEnableMovement(doc.data().enableMovement);
                setDbEnableZooming(doc.data().enableZooming);
                setDbNumberOfRounds(doc.data().noRounds);
                setDbRoundTime(doc.data().timeLimit)
                const userRef = db.collection("lobbies/" + lobbyId + "/gameUsers").doc(`${localStorage.getItem("userId")}`);
                userRef.get().then((doc2) => {
                    /* try {
                        setDbHost(doc2.data().isHost);
                        //if game is started, jump into GamePage.js 
                        if ((doc.data().isGameStarted === true) && (doc2.data().isHost === false)) {
                            let data = {enablePan: enablePan, enableMovement: dbEnableMovement, enableZooming: dbEnableZooming,
                                roundTime: dbRoundTime, numberOfRounds: dbNumberOfRounds, lobbyId,isMultiplayer};
                            history.push({
                                pathname: '/Game',
                                state: data})
                        }
                    } catch (error) {
                        console.log(error);
                    } */
                    setDbHost(doc2.data().isHost);
                    //if game is started, jump into GamePage.js 
                    if ((doc.data().isGameStarted === true) && (doc2.data().isHost === false)) {
                        let data = {enablePan: enablePan, enableMovement: dbEnableMovement, enableZooming: dbEnableZooming,
                            roundTime: dbRoundTime, numberOfRounds: dbNumberOfRounds, lobbyId,isMultiplayer};
                        history.push({
                            pathname: '/Game',
                            state: data})
                    }
                    
                })
                
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        })
        return () => {
            unsubscribe2();
        }
        //return unsubscribe2();
    },[]);

    useEffect(() => {
        //listener for lobby user data changes
        const q = query(collection(db, "lobbies/" + lobbyId + "/gameUsers"));
        var fetchedUsersFromDatabase = [];
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            fetchedUsersFromDatabase = [];
            //var hostExists = false;
            querySnapshot.forEach((doc) => {
                fetchedUsersFromDatabase.push(doc.data());
            })
            const userRef = db.collection("lobbies/" + lobbyId + "/gameUsers").doc(`${localStorage.getItem("userId")}`);
            userRef.get().then((doc2) => {
                setDbHost(doc2.data().isHost);
                /* try {
                    setDbHost(doc2.data().isHost);
                } catch (error) {
                    console.log(error);
                } */
                
            })
            setLobbyUsers(fetchedUsersFromDatabase);
        })
        //return unsubscribe();
        return () => {
            unsubscribe();
        }
    }, [])
    

    useEffect(() => {
        const lobbyUserNames = lobbyUsers.map((user) => {
            return {
                userName: `${user.userName}`
            }
        })
        console.log(lobbyUserNames);
        lobbyUserNames.forEach((iter) => {
            console.log("user username:" + iter.userName);
        })
        
    }, [lobbyUsers]);

    // const LobbyPlayers = ()=>{
    //     lobbyUsers.map((user)=>{
    //         return(
    //             <div className="lobby-player">
    //                 <p>{user.isHost ? `${user.userName} (Host)` : user.userName}</p>
    //             </div>
    //         )
    //     })
    // }

    return (<>
        {showLoading && <Loading/>}
        <div className="game-lobby-main-container">
            <div className ="game-lobby-header">
                {isMultiplayer ? <p>Multiplayer Lobby</p> : <p>Singleplayer Lobby</p>}
            </div>
            <div className = "game-settings">
                <p>Game Settings</p>
                <div className="settings-container">
                    <p>Zooming: <span>{`${dbEnableZooming}`}</span></p>
                    <p>Movement: <span>{`${dbEnableMovement}`}</span></p>
                    <p>Rounds: <span>{dbNumberOfRounds}</span></p>
                    <p>Round Time: <span>{dbRoundTime}</span></p>
                </div>
                <h2>Lobby Code: {lobbyId}</h2>
            </div>
            <div className= "players">
                <p>Players</p>
                <div className="players-container">
                    {lobbyUsers.map((user)=>{
                        return(
                        <div className="lobby-player">
                            <p>{user.isHost ? `${user.userName} (Host)` : user.userName}</p>
                        </div>)  
                                             })
                    }
                </div>
            </div>
            <div className="edit-btn">
                <button type="button" id = "editSettingsButton" class="btn btn-secondary"
                    onClick={handlePopupShow} disabled={!isDbHost}>Edit Game Settings</button>
            </div>
            <div className ="back-btn">
                <button type="button" id = "exitButton" class="btn btn-danger"
                    onClick={exitButtonClick}>Back Home </button>
            </div>
            <div className="start-btn">
                <button type="button" id = "startGameButton" class="btn btn-success"
                    onClick={startGameButtonClick} disabled={!isDbHost}>Start Game</button>
            </div>
            <Modal show={popupShow} onHide={handlePopupClose}>
                    <Modal.Header closeButton >
                        <div class="modal-header-text">
                            <p>Game Settings</p>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="modal-container">
                            <div class="modal-enables-container">
                                <div class="custom-checkbox">
                                    <input class="form-check-input" type="checkbox" id="flexCheckZooming" onChange={(event) => setEnableZooming(event.target.checked)} defaultChecked={dbEnableZooming} />
                                    <label class="form-check-label" for="flexCheckZooming">Zooming</label>
                                </div>
                                <div class="custom-checkbox">
                                    <input class="form-check-input" type="checkbox" id="flexCheckMovement" onChange={(event) => setEnableMovement(event.target.checked)} defaultChecked={dbEnableMovement} ></input>
                                    <label class="form-check-label" for="flexCheckMovement">Movement</label>
                                </div>
                            </div>
                            <div class="slider-round-time">
                                <label for="customRange1" class="form-time-range-label">Time Limit: {roundTime} seconds</label>
                                <input type="range" class="form-range" id="timeLimitRange" min="10" max="60" step="5" defaultValue={dbRoundTime} onChange={ (event) => setRoundTime(event.target.value)} value={roundTime}></input>
                            </div>
                            <div class="slider-no-rounds">
                                <label for="customRange1" class="form-round-range-label">Number of Rounds: {numberOfRounds} </label>
                                <input type="range" class="form-range" id="numberOfRoundsRange" min="3" max="10" step="1" defaultValue={dbNumberOfRounds} onChange={ (event) => setNumberOfRounds(event.target.value)} value={numberOfRounds}></input>
                            </div>

                            <div className="country-selection-container">
                                <div className="country-selection-header">
                                    <h4>Country Selection</h4>
                                </div>
                                <div className="country-selection-body">
                                    <div class="custom-checkbox" key="world">
                                        <input class="form-check-input" type="checkbox" id="world" checked={worldIsChecked}
                                                onChange={handleWorldCheck}/>
                                        <label class="form-check-label" for="world">
                                            World
                                        </label>
                                    </div>
                                    <CountryCheckboxList/>
                                </div>
                            </div>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={handlePopupClose}>
                            Discard Changes
                        </Button>
                        <Button variant="success" onClick={handleSaveGameSettings}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
        </div>
        
        


    </>)
}
