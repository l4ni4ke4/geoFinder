
import "./RoundStart.css"
import playIcon from '../../assets/play_icon.png';
import exitIcon from '../../assets/exit_icon.png';

import { db } from "../../firebase";

import { setGameState } from "../../utils/DbUtils";


function RoundStart({isHost,currentRound,rounds,totalScore,lobbyId,setShowExitModal}){


    const handleStartRoundBtn = async() => {
        // setShowView("RoundPlay");
        // update gameState from db
        setGameState({lobbyId,gameState:"RoundPlay"});
    }

    const handleExitBtn = () =>{
        setShowExitModal(true);
    }

    return(
        <div className = "round-start-container">
            <div className= "get-ready-box">
                <div className="get-ready-header">
                    <p>GET READY !</p>
                </div>
                <div className ="round-box">
                    <p>Round {currentRound+1}/{rounds}</p>
                </div>
            </div>
            <div className="button-group">
                <button type= 'button' id='btn-exit-game' className='btn btn-danger' onClick= {handleExitBtn}>
                        <img src={exitIcon} id='exitIcon'/>
                </button>
                {isHost ?
                    <button type='button' id='btn-start-round' className='btn btn-primary' onClick= {handleStartRoundBtn}>
                        <img src={playIcon} />
                    </button>
                    : <p>waiting for the host to start the round...</p>
                }
            </div>
            <div className= 'round-start-footer'>
                    <p>Current Score: {Math.round(totalScore)} </p>
            </div>
        </div>
    )

}


export default RoundStart