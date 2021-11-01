import React from "react";
import { useHistory } from "react-router-dom";
import "./GameLobbyPage.css";

export default function GameLobbyPage() {

    const history = useHistory();
    const startGameButtonClick = () => {
        let path = `/Game`;
        history.push(path);
    }
    const exitButtonClick = () => {
        let path = '/';
        history.push(path);
    }

    return (<>

        <div class="container game-settings-main-container">
            <h1>ARMAN YAVUZ</h1>
            
            <div class="header">
                <h2>Game Settings</h2>
            </div>
            <div class="body"> 
                <h2>ARMAN</h2>
            </div>
            <div class="footer">
                <button type="button" id = "exitButton" class="btn btn-light">Exit</button>
                <button type="button" id = "startGameButton" class="btn btn-light">Start Game</button>
            </div>
        </div>


    </>)
}
