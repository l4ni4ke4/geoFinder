/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import './Home.css';

const Home = () =>{
    
    return(<>

    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="/">Geofinder</a>
        <i class="icon-help fas fa-question fa-2x"></i>
        <i class="icon-language fas fa-language fa-2x"></i>
        
        <div class="container home-top-right-container flex-container">
            <button type="button" class="btn btn-primary">Game History</button>
            <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Profile
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item" href="/accountDetails">Account Details</a>
                <a class="dropdown-item" href="/stats">Stats</a>
            </div>
            </div>
        </div>

    </nav>



    </>)

}


export default Home;