import {
    GoogleMap,
    Marker,
    Polyline
  } from "@react-google-maps/api";
import "./GameResults.css";
import markerDefault from "../../assets/markerDefault.svg";
import markerTrueLocation from "../../assets/markerTrueLocation.svg";
import { useHistory } from "react-router-dom";

export default function GameResults({guessedLocations,trueLocations,totalScore,scores, isLoaded}){

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
    history.push('/');
}

const handleBackToLobby = ()=>{
    history.push('/GameLobby');
};

const handleRestart = ()=>{
    window.location.reload();
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
                            <tr>
                                <td>Total Score</td>
                                <td>{Math.round(totalScore)}</td>
                            </tr>

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
                            <tr>
                                <td>Score</td>
                                {scores.map((score,index)=>{
                                    return(
                                        <td>{Math.round(score)}</td>
                                    )
                                })}
                            </tr>

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