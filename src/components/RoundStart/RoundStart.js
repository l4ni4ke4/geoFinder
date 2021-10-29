
import "./RoundStart.css"
import playIcon from '../../assets/play_icon.png';
import exitIcon from '../../assets/exit_icon.png';

function RoundStart({setShowView,currentRound,rounds,totalScore}){

    const handleStartRoundBtn = () => {
        setShowView("RoundPlay");
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

                <button type= 'button' id='btn-exit-game' className='btn btn-danger'>
                    <img src={exitIcon} id='exitIcon'/>
                </button>

                <button type='button' id='btn-start-round' className='btn btn-primary' onClick= {handleStartRoundBtn}>
                   <img src={playIcon} />
                </button>

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