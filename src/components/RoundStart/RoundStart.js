
import "./RoundStart.css"
import playIcon from '../../assets/play_icon.png';
import exitIcon from '../../assets/exit_icon.png';

function RoundStart({currentRound}){

    return(
        <div className = "round-start-container">
            <div className = 'round-start-main'>
                <h1>PREPARE YOURSELF</h1>
                <div className= 'box'>

                </div>

                <button type= 'button' id='btn-exit-game' className='btn btn-danger'>
                    <img src={exitIcon} id='exitIcon'/>
                </button>

                <button type='button' id='btn-next-round' className='btn btn-primary'>
                   <img src={playIcon} />
                </button>

            </div>

            <div className= 'round-start-footer'>
                <div className ='player_score'>
                    <h2>Current Score: </h2>
                </div>
            </div>
        </div>
    )

}


export default RoundStart