import {
    GoogleMap,
    Marker,
    Polyline
  } from "@react-google-maps/api";
import "./GameResults.css";
import markerDefault from "../../assets/markerDefault.svg";
import markerTrueLocation from "../../assets/markerTrueLocation.svg";
import { useHistory } from "react-router-dom";
import { auth, db, logout } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore"; 
import { resetLobby } from "../../utils/DbUtils";

export default function GameResults({gameUsers,guessedLocations,trueLocations,totalScore,scores,lobbyId,isLoaded,setShowExitModal,isMultiplayer}){ 

const [name, setName] = useState("");
const [user, loading, error] = useAuthState(auth);

const lineSymbol = {
        path: "M 0,-1 0,1",
        strokeOpacity: 0.8,
        scale: 3,
      };

const mapContainerStyle= {
        width: "100%",
        height: "100%",
      };

const mapOptions = {
        disableDefaultUI: true,
      };

const history = useHistory();

const handleLeaveGame = ()=>{
    setShowExitModal(true);
    // history.push('/');
}

const handleBackToLobby = ()=>{
    // TODO
    // resetLobby({lobbyId});
    
    // history.push({
    //     pathname: '/GameLobby',
    //     state: { lobbyId: lobbyId, isMultiplayer: isMultiplayer }
    // });
};

const handleRestart = ()=>{
    window.location.reload();
}

function generateRandomGameHistoryId() {
    return Math.floor(100000000 + Math.random() * 900000000); 
}

async function saveGameHistoryToDb() {
    let gameHistoryId = generateRandomGameHistoryId();
    await setDoc(doc(db, "users/" + localStorage.getItem("userId") + "/gameHistory", `${gameHistoryId}`), {
        pos: trueLocations,
        mark: guessedLocations,
        roundScores: scores,
        totalScore: totalScore
    });
}

useEffect(() => {
    saveGameHistoryToDb();
}, []);

function FinalLeaderboard(){
    let nameScorePairs = [];
    nameScorePairs = gameUsers.map((user)=>{
            return {userName: user.userName,totalScore: user.totalScore}
    })
    
    nameScorePairs.sort((firstItem, secondItem) => secondItem.totalScore -firstItem.totalScore)

    return(
        nameScorePairs.map((user)=>{
            return( <tr>
                        <td>{user.userName}</td>
                        <td>{Math.round(user.totalScore)}</td>
                   </tr>)
                            })
            )
}

function DetailedLeaderBoard(){
    let nameAndScores = [];
    nameAndScores = gameUsers.map((user)=>{
            return {userName: user.userName,totalScore: user.totalScore, scores: user.scores}
    })
    
    nameAndScores.sort((firstItem, secondItem) => secondItem.totalScore -firstItem.totalScore)
    return(
        nameAndScores.map((user)=>{
            return(
            <tr>
            <td>{user.userName}</td>
                {user.scores.map((score,index)=>{
                    return(
                        <td>{Math.round(score)}</td>
                    )
                })}
             </tr>)

        })
    )
}
    
    return(
        <div className= 'gameresults-container'>
            <div className ='gameresults-mapview'>
            {isLoaded &&
            <GoogleMap mapContainerStyle={mapContainerStyle} 
                        zoom ={3} 
                        center={{lat:50,lng:50}} 
                        options ={mapOptions}>
                       
                        {
                            guessedLocations.map((location,index)=>{
                                return(
                                    <div className='round-distance' key = {index}>
                                    <Marker position={location}
                                            
                                    icon= {{url:markerDefault,
                                            scaledSize: new window.google.maps.Size(45,45)}}/>
                                    <Marker position={trueLocations[index]}
                                            label = {{text:`${index+1}`,
                                                      fontSize:'12px',
                                                      className:'marker-label',
                                                      color:'white'}}
                                            icon= {{url:markerTrueLocation,
                                                    scaledSize: new window.google.maps.Size(35,35)}}/>
                                    <Polyline path ={[guessedLocations[index],trueLocations[index]]}
                                      options = {{
                                        icons: [
                                            {
                                              icon: lineSymbol,
                                              offset: "10px",
                                              repeat: "20px",
                                            },
                                          ],
                                        strokeOpacity:0,
                                        strokeColor:"#000000"
                                      }}/>
                                    </div>
                                    
                                    
                                )
                            })
                        }
                    </GoogleMap>}
            </div>
            <div className='gameresults-summary'>
                <section className='final-leaderboard'>
                    <h2>Final Leaderboard</h2>
                    <table class="table table-dark" id='finalTable'>
                        <tbody>
                            <FinalLeaderboard/>

                        </tbody>
                    </table>

                </section>

                <section className='detailed-leaderboard'>
                    <h2>Detailed Leaderboard</h2>
                    <table class="table table-dark">
                        <thead>
                            <tr>
                                <td></td>
                                {scores.map((score,index)=>{
                                    return(
                                        <td key={index}>Round {index+1}</td>
                                    )
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            <DetailedLeaderBoard/>

                        </tbody>
                    </table>
                </section>
                <section className='gameresults-footer'>
                    <button type= 'button' className= 'btn btn-danger' onClick={handleLeaveGame}>Leave Game</button>
                    <button type= 'button' className= 'btn btn-secondary' onClick={handleBackToLobby}>Back to Lobby</button>
                    <button type= 'button' className= 'btn btn-primary' onClick={handleRestart}>Restart</button>
                </section>
            </div>
        </div>
    )
}