import "./RoundEnd.css"
import { useEffect } from "react";

import RoundEndMap from "./RoundEndMap";


function RoundEnd({currentRound,setCurrentRound,rounds,setShowView,distances,scores,totalScore,setTotalScore,guessedLocations
    ,trueLocations,isLoaded}){

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
                <RoundEndMap trueLocations = {trueLocations}
                             guessedLocations = {guessedLocations}
                             currentRound = {currentRound}
                             isLoaded = {isLoaded}
                />
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