import "./RoundEnd.css"
import {
    GoogleMap
  } from "@react-google-maps/api";
import { useEffect } from "react";

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


function RoundEnd({currentRound,setCurrentRound,rounds,setShowView,distances,scores,totalScore,setTotalScore}){

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