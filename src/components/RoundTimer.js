import { useState, useEffect } from "react";

export default function RoundTimer({isTimerActive,roundTime,currentTime,setCurrentTime}){

    //round time countdown handler
    useEffect(() => {
        let interval;
        if (isTimerActive) {
        setCurrentTime(roundTime);
        interval = setInterval(() => {
            setCurrentTime(prevTime => prevTime - 1);
        }, 1000)
        }
        else {
        clearInterval(interval);
        }

        return () => clearInterval(interval);

    }, [isTimerActive])

    return(
        <button type="button" id = "timeRemainingButton" class="btn btn-light" disabled >Time: {currentTime} </button>
    )
}