import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import "./App.css"
import Game from "./pages/Game/GamePage"
import Home from "./pages/Home/Home"
import GameLobby from "./pages/GameLobby/GameLobbyPage"
import Auth from "./pages/Auth/AuthPage"
import GameResults from "./components/GameResults/GameResults"
import Profile from "./pages/Profile/ProfilePage"
import RoundStart from "./components/RoundStart/RoundStart"
import RoundEnd from "./components/RoundEnd/RoundEnd"

import Login from "./components/Login/Login"
import Register from "./components/Register/Register"
import ResetPwd from "./components/ResetPwd/ResetPwd"
import Dashboard from "./components/Dashboard/Dashboard"

function App() {

  return (
      <Router>
        <div>
          <Switch>

            <Route exact path="/" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/reset" component={ResetPwd} />
            <Route exact path="/Dashboard" component={Dashboard} />

            <Route path="/Game">
              <Game/>
            </Route>

            <Route path="/GameLobby">
              <GameLobby/>
            </Route>

            <Route path="/Auth">
              <Auth />
            </Route>

            <Route path="/GameResults">
              <GameResults />
            </Route>

            <Route path="/Profile">
              <Profile />
            </Route>

            <Route path="/RoundStart">
              <RoundStart />
            </Route>

            <Route path="/RoundEnd">
              <RoundEnd />
            </Route>
            
            <Route path="/Home">
              <Home/>
            </Route>

          </Switch>
        </div>
    </Router>
  );
}

export default App;
