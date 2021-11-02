import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import "./GameLobbyPage.css";

export default function GameLobbyPage() {
    //variables about game rules

    const [enablePan, setEnablePan] = useState(false);
    const [enableMovement, setEnableMovement] = useState(false);
    const [enableZooming, setEnableZooming] = useState(false);

    const [roundTime, setRoundTime] = useState(60);
    const [numberOfRounds, setNumberOfRounds] = useState(5);

    let data = {enablePan: enablePan, enableMovement: enableMovement, enableZooming: enableZooming, roundTime: roundTime, numberOfRounds: numberOfRounds, setRoundTime: setRoundTime, setNumberOfRounds: setNumberOfRounds};
    const history = useHistory();
    const startGameButtonClick = () => {
        history.push({
            pathname: '/Game',
            state: JSON.stringify(data),
        })
    }
    const exitButtonClick = () => {
        let path = '/';
        history.push(path);
    }

    return (<>

        <div class="container game-settings-main-container">
            <div class="header main-header">
                <h2>Game Settings</h2>
            </div>
            <div class="container game-rules-container">
                <div class="header game-rules-header">
                    <h4>Game Rules</h4>
                </div>
                <div class="row game-rules-row-1">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="flexCheckZooming" onChange={(event) => setEnableZooming(event.target.checked)} defaultChecked={enableZooming} ></input>
                        <label class="form-check-label" for="flexCheckZooming">
                            Zooming
                        </label>
                    </div>
                    {/* <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="flexCheckCameraPan" onChange={(event) => setEnablePan(event.target.checked)} defaultChecked={enablePan}></input>
                        <label class="form-check-label" for="flexCheckCameraPan">
                            Camera Pan
                        </label>
                    </div> */}
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="flexCheckMovement" onChange={(event) => setEnableMovement(event.target.checked)} defaultChecked={enableMovement} ></input>
                        <label class="form-check-label" for="flexCheckMovement">
                            Movement
                        </label>
                    </div>
                </div>
                <div class="row game-rules-row-2">
                    <label for="customRange1" class="form-time-range-label">Time Limit: {roundTime} seconds</label>
                    <input type="range" class="form-range" id="timeLimitRange" min="10" max="60" step="5" defaultValue={roundTime} onChange={ (event) => setRoundTime(event.target.value)} value={roundTime}></input>
                </div>
                <div class="row game-rules-row-3">
                    <label for="customRange1" class="form-round-range-label">Number of Rounds: {numberOfRounds} </label>
                    <input type="range" class="form-range" id="numberOfRoundsRange" min="3" max="10" step="1" defaultValue={numberOfRounds} onChange={ (event) => setNumberOfRounds(event.target.value)} value={numberOfRounds}></input>
                </div>
            </div>
            <div class="footer game-settings-footer">
                <button type="button" id = "exitButton" class="btn btn-danger" onClick={exitButtonClick}>Back to Main Menu</button>
                <button type="button" id = "startGameButton" class="btn btn-success" onClick={startGameButtonClick}>Start Game</button>        
            </div>
        </div>


    </>)
}
