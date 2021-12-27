
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
            <div className = 'round-start-main'>
                
                <div className='roundBox'>
                    <h5>Round: {currentRound+1}/{rounds}</h5>
                </div>

                <h1>GET READY</h1>
                <div className= 'box'>

                </div>

                <button type= 'button' id='btn-exit-game' className='btn btn-danger' onClick= {handleExitBtn}>
                    <img src={exitIcon} id='exitIcon'/>
                </button>

                {isHost ?
                    <button type='button' id='btn-start-round' className='btn btn-primary' onClick= {handleStartRoundBtn}>
                    <img src={playIcon} />
                    </button>
                    : <h2>waiting for host to start the round...</h2>
                }


            </div>

            <div className= 'round-start-footer'>
                <div className ='player_score'>
                    <h2>Current Score: {Math.round(totalScore)} </h2>
                </div>
            </div>
        </div>
    )

}


export default RoundStart