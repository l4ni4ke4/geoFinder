/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import singlePlayerLogo from '../../assets/one-player-game-symbol.png';
import multiPlayerLogo from '../../assets/network_icon.png';
import './Home.css';
import { auth, db, logout } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Home() {

    const history = useHistory();
    const [name, setName] = useState("");
    const [user, loading, error] = useAuthState(auth);
    
    const fetchUserName = async () => {
        try {
          const query = await db
            .collection("users")
            .where("uid", "==", user?.uid)
            .get();
          const data = await query.docs[0].data();
          setName(data.name);
        } catch (err) {
          console.error(err);
        }
      };

    const singlePlayerButtonClick = () =>{ 
        let path = `/GameLobby`; 
        history.push(path);
    }
    
    useEffect(() => {
        fetchUserName();
        if (loading) return;
        if (!user) return history.replace("/");
    }, [user, loading])

    return (<>

        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="/">Geofinder</a>
            <i class="icon-help fas fa-question fa-2x"></i>
            <i class="icon-language fas fa-language fa-2x"></i>

            <div class="container home-top-right-flex-container flex-container justify-content-end">
                <button type="button" class="btn btn-primary">Game History</button>
                <div class="dropdown">
                    <button class="btn btn-secondary btn-profile dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {name}
                    </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a class="dropdown-item" href="/accountDetails">Account Details</a>
                        <a class="dropdown-item" href="/stats">Stats</a>
                        <a class="dropdown-item" href="/" onClick={logout}>Logout</a>
                    </div>
                </div>
            </div>

        </nav>

        <div className="home-main" style={{ height:"680px" }}>
            <div class="row" style={{ paddingTop:"9%", paddingLeft: "11%", width:"fitContent" }}>
                <div class="col-sm-3">
                    <div class="card" style={{ height: "400px", backgroundColor: "gainsboro", color: "white", cursor: "pointer" }} onClick={singlePlayerButtonClick}>
                        <h1 style={{ textAlign: "center" }}>Single Player</h1>
                        <img src={singlePlayerLogo} width="80%" class="sp-image image"></img>
                    </div>
                </div>
                <div class="col-sm-3" style={{ marginLeft: "2%" }}>
                    <div class="card" style={{ height: "400px", backgroundColor: "gainsboro", color: "white", cursor: "pointer" }}>
                        <h1 style={{ textAlign: "center" }}>Multiplayer</h1>
                        <img src={multiPlayerLogo} width="80%" class="mp-image image"></img>
                    </div>
                </div>
                <div class="col-sm-4" style={{ marginLeft: "10%", marginTop: "-3%" }}>
                    <div class="card" style={{ height: "500px" }}>
                        <h2 style={{ textAlign: "center" }}>Scoreboard</h2>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Username</th>
                                    <th scope="col">Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>Berat</td>
                                    <td>3000</td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>Serdar</td>
                                    <td>2000</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>Arman</td>
                                    <td>1000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
        




    </>)

}