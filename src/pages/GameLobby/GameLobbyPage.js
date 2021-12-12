import React, {useState,useEffect} from "react";
import { useHistory } from "react-router-dom";
import { generateRandomStreetViewLocations } from "../../utils/GameUtils";
import { getAllCountries } from "../../utils/Polygons";
import "./GameLobbyPage.css";

export default function GameLobbyPage() {
    //variables about game rules

    const [enablePan, setEnablePan] = useState(false);
    const [enableMovement, setEnableMovement] = useState(false);
    const [enableZooming, setEnableZooming] = useState(false);

    const [roundTime, setRoundTime] = useState(60);
    const [numberOfRounds, setNumberOfRounds] = useState(5);

    /*country selection related variables */
    const countryList = getAllCountries();
    const [countryCheckboxListIsChecked,setCountryCheckboxListIsSelected] = useState(
        Object.assign(...(
        countryList.map((countryObj)=>{
            return(
               { [countryObj.code]:false }
            )
        })))
    );
    /********/

    const history = useHistory();
    const startGameButtonClick = () => {

        // get a country code array from selected countries
        const countryCodeArray = Object.keys(countryCheckboxListIsChecked).filter(key=>countryCheckboxListIsChecked[key] === true);


        // fetch locations when start button is clicked then send options to gamepage
        generateRandomStreetViewLocations(numberOfRounds,countryCodeArray).then((fetchedLocations)=>{

            let data = {enablePan: enablePan, enableMovement: enableMovement, enableZooming: enableZooming,
                roundTime: roundTime, numberOfRounds: numberOfRounds, fetchedLocations:fetchedLocations};
    
            history.push({
                pathname: '/Game',
                state: data,
            })
            
        })
    }
    const exitButtonClick = () => {
        let path = '/Home';
        history.push(path);
    }

    //render country checkboxes
    const CountryCheckboxList = () =>{
        return countryList.map((countryObj) => {
            const {country,code} = countryObj;
            return(
                <div class="form-check" key={code}>
                    <input class="form-check-input" type="checkbox" id={code} checked={countryCheckboxListIsChecked[code]}
                            onChange={handleCountryCheckbox}/>
                    <label class="form-check-label" for={code}>
                        {country}
                    </label>
                </div>
            )
        })
    }

    const handleCountryCheckbox = (event) =>{
        setCountryCheckboxListIsSelected({...countryCheckboxListIsChecked,[event.target.id]:!countryCheckboxListIsChecked[event.target.id]});
        console.log();
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
            <div className="country-selection-container">
                <h4>Country Selection</h4>
                <CountryCheckboxList/>
            </div>
            <div class="footer game-settings-footer">
                <button type="button" id = "exitButton" class="btn btn-danger" onClick={exitButtonClick}>Back to Main Menu</button>
                <button type="button" id = "startGameButton" class="btn btn-success" onClick={startGameButtonClick}>Start Game</button>        
            </div>
        </div>


    </>)
}
