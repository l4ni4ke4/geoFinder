import React from 'react'
import "./GameHistory.css"

import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import Loading from '../../components/Loading';
import useGameHistory from '../../Hooks/useGameHistory';

const GameHistory = () => {

    const history = useHistory();
    const userId = localStorage.getItem("userId");
    const handleBackToHome = () =>{
        history.push("Home");
    }

    const {isFetching,userGameHistory} = useGameHistory({userId});

    function GameHistoryRows() {
        return(
            userGameHistory.map((gameHistory)=>{

                const unixTime = gameHistory.date;
                const dataObj = new Date(unixTime);
                const readableDate = dataObj.toLocaleString();

                return(
                    <div className="game-history-table-row">
                        <div className="table-data">
                            <p>{readableDate}</p>
                        </div>
                        <div className="table-data">
                            <p>{gameHistory.isMultiplayer ? "Multiplayer": "Single Player"}</p>
                        </div>
                        <div className="table-data">
                            <p>{gameHistory.rounds}</p>
                        </div>
                        <div className="table-data">
                            <p>{gameHistory.timeLimit} Sec</p>
                        </div>
                        <div className="table-data">
                            <p>{Math.round(gameHistory.totalScore)}</p>
                        </div>
                    </div>
                )
            })
        )
    }

    if(isFetching) return <Loading/>

    console.log(userGameHistory);

    return (
        <>
        <div className="game-history-container">
            <div className="game-history-table-container">
                <div id="table-header" className="game-history-table-row">
                        <div className="table-data">
                            <p>Date</p>
                        </div>
                        <div className="table-data">
                            <p>Mode</p>
                        </div>
                        <div className="table-data"> 
                            <p>Rounds</p>
                        </div>
                        <div className="table-data"> 
                            <p>Time Limit</p>
                        </div>
                        <div className="table-data"> 
                            <p>Total Score</p>
                        </div>
                    </div>
                <div className="game-history-table">
                    <GameHistoryRows/>
                </div>

            </div>
            <button id = "btn-back-home" className="btn btn-success" onClick={handleBackToHome}>Back to Home</button>
        </div>
        </>
    )
}

export default GameHistory
