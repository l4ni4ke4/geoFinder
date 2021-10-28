import React, { useEffect } from "react";

export default function RoundStart(props) {
    useEffect(() => {

    }, []);

    return(<>
    
    <div class="container roundStartMainContainer">

        <div class="container roundContainer" style={{display:"block", flexDirection:"column"}}>
            <h3>Round ?/?</h3>
            <h3>GET READY "username" </h3>
        </div>
        

        <div class="container flex-container leaveStartGameButtonContainer" style={{display:"flex", flexDirection:"row"}}>
            <button type="button" class="btn btn-light leaveGameButton">Leave Game</button>
            <button type="button" class="btn btn-light startGameButton">Start Game</button>
        </div>

        <div class="container pointsContainer" style={{display:"block", flexDirection:"column"}}>
            <h3>Current Score</h3>
            <h3>100</h3>
        </div>
    </div>
    
    </>)


}