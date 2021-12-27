import "./RoundEnd.css"
import { useEffect } from "react";
import { db } from "../../firebase";
import RoundEndMap from "./RoundEndMap";
import { getScore,calculateDistance } from "../../utils/GameUtils";
import { getAllUsers, makeIsClickedGuessFalse, setGameState } from "../../utils/DbUtils";


function RoundEnd({gameUsers,userId,lobbyId,isHost,currentRound,rounds,distances,scores,totalScore,
                guessedLocations,trueLocations,markerPosition,trueLocation,setMarkerPosition,isLoaded}){

    
    async function endRound(){ 
        let roundGuess;
        let roundDistance;
        let roundScore;
        let newTotalScore;
        if(markerPosition != null){
          //push the guessed position into guessedPositions variable
          roundGuess = markerPosition;
          // setGuessedLocations(guessedLocations => [...guessedLocations,markerPosition]);
    
          // calculate distance
          roundDistance = calculateDistance(trueLocation.lat,roundGuess.lat,trueLocation.lng,roundGuess.lng);
    
          // calculate score
          roundScore = getScore(roundDistance,12000);
        }else{
          //push the guessed position into guessedPositions variable
          // setGuessedLocations(guessedLocations => [...guessedLocations,markerPosition]);
          roundGuess = null;
          roundDistance = "null";
          roundScore = 0;
        }
        newTotalScore = roundScore+ scores.reduce((partial_sum, a) => partial_sum + a,0); // this just sums the array elements

       // write user's guessedLocation, distance, score, totalScore
       let newGuessedLocations = [...guessedLocations];
       newGuessedLocations.splice(currentRound,0,roundGuess)
       let newDistances = [...distances];
       newDistances.splice(currentRound,0,roundDistance)
       let newScores = [...scores];
       newScores.splice(currentRound,0,roundScore)

    //    console.log(newGuessedLocation);
    //    console.log([...distances,roundDistance]);
    //    console.log([...scores,roundScore]);
    //    console.log(totalScoreNew);
       
       try{
        await db.collection("lobbies")
                .doc(`${lobbyId}`)
                .collection("gameUsers")
                .doc(userId)
                .update({
                  guessedLocations: newGuessedLocations,
                  distances: newDistances,
                  scores: newScores,
                  totalScore: newTotalScore
                })
        }catch(err){
        console.error("Db error at updating user's round info");
        }
        setMarkerPosition();
        makeIsClickedGuessFalse({lobbyId,userId});
     }

    const handleBtnNextRound = async() =>{
            // setCurrentRound(currentRound+1);
            // setShowView("RoundStart");
            try{
                setGameState({lobbyId,gameState:"RoundStart"});
                await db.collection("lobbies").doc(`${lobbyId}`).update({
                    currentRound: currentRound+1
                })
            }catch(error){
                console.error(error);
            }
    }

    const RoundEndLeaderboard = () =>{

        let nameScorePairs = [];
        nameScorePairs = gameUsers.map((user)=>{
                return {userName: user.userName,totalScore: user.totalScore}
        })
        
        nameScorePairs.sort((firstItem, secondItem) => secondItem.totalScore -firstItem.totalScore)

        return(
            <div className = 'table-round-end lb'>
                <table class="table table-dark">
                    
                    <tbody>
                            {
                                nameScorePairs.map((user)=>{
                                    return( <tr>
                                                <td>{user.userName}</td>
                                                <td>{Math.round(user.totalScore)}</td>
                                            </tr>
                                                     )
                                })
                               
                            }
                    </tbody>
                </table>
            </div>
        )
    }


    useEffect(()=>{
        endRound();
        // getAllUsers({lobbyId});
    },[])

    return(
        <div className='round-end-container'>
            <div className ='round-end-mapview'>
                <RoundEndMap trueLocations = {trueLocations}
                             guessedLocations = {guessedLocations}
                             currentRound = {currentRound}
                             gameUsers = {gameUsers}
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
                    <RoundEndLeaderboard/>
                </section>
                {isHost ?
                    <button type= 'button' className= 'btn btn-primary' id = 'btnNextround' onClick={handleBtnNextRound}>
                        {currentRound === rounds-1 ? "End Game" : "Next Round"}
                    </button> 
                  : <h3>waiting for host...</h3>}

            </div>
        </div>

    )
}



export default RoundEnd;