import "./RoundEnd.css"
import {
    GoogleMap,
    Marker,
    Polyline
  } from "@react-google-maps/api";
import { useEffect } from "react";

import markerTrueLocation from "../../assets/markerTrueLocation.svg"
import markerDefault from "../../assets/markerDefault.svg"

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

const mapCenter = {
    lat:41.106196,
    lng:28.803581
  };


function RoundEnd({currentRound,setCurrentRound,rounds,setShowView,distances,scores,totalScore,setTotalScore,guessedLocations
    ,trueLocations}){

    const handleBtnNextRound = () =>{
            setCurrentRound(currentRound+1);
            setShowView("RoundStart");
    }
    useEffect(()=>{
        let totalScore = scores.reduce((partial_sum, a) => partial_sum + a,0); // this just sums the array elements
        setTotalScore(totalScore);
    },[])

    return(
        <div className='round-end-container'>
            <div className ='round-end-mapview'>
                    <GoogleMap mapContainerStyle={mapContainerStyle} 
                        zoom ={3} 
                        center={mapCenter} 
                        options ={mapOptions}>
                            <Marker position={guessedLocations[currentRound]}
                                    icon= {{url:markerDefault,
                                            scaledSize: new window.google.maps.Size(45,45)}}/>

                            <Marker position ={trueLocations[currentRound]}
                                    icon = {{url:markerTrueLocation,
                                             scaledSize: new window.google.maps.Size(35,35)}}/>
                            
                            <Polyline path ={[guessedLocations[currentRound],trueLocations[currentRound]]}
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
                                      }}
  

                                      />

                    </GoogleMap>
            </div>

            <div className = 'round-end-scores'>
                <section >
                    <h2>Round Results</h2>
                    <div className = 'table-round-end roundresult'>
                        <table class="table table-dark">

                            <tbody>
                                <tr>
                                    <td>Score</td>
                                    <td>{Math.round(scores[currentRound])}</td>
                                </tr>
                                <tr>
                                    <td>Distance</td>
                                    <td>{Math.round(distances[currentRound])} km</td>
                                </tr>
                                <tr>
                                    <td>Time Bonus</td>
                                    <td>-</td>
                                </tr>
                                <tr>
                                    <td>Country Bonus</td>
                                    <td>-</td>
                                </tr>
                            </tbody>
                        </table>
                        
                    </div>
                </section>

                <section >
                    <h2>Leaderboard</h2>
                    <div className = 'table-round-end lb'>
                        <table class="table table-dark">
                            
                            <tbody>
                                <tr>
                                        <td>Total Score</td>
                                        <td>{Math.round(totalScore)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
                <button type= 'button' className= 'btn btn-primary' id = 'btnNextround' onClick={handleBtnNextRound}>
                    {currentRound === rounds-1 ? "End Game" : "Next Round"}
                </button>
            </div>
        </div>

    )
}

export default RoundEnd;