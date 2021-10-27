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
import GameResults from "./pages/GameResults/GameResultsPage"
import Profile from "./pages/Profile/ProfilePage"
import RoundStart from "./pages/RoundStart/RoundStartPage"
import RoundEnd from "./pages/RoundEnd/RoundEndPage"

function App() {

  return (
      <Router>
        <div>
          <Switch>

            <Route path="/Game">
              <Game/>
            </Route>

            <Route path="/">
              <Home />
            </Route>

            <Route path="/GameLobby">
              <GameLobby />
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

          </Switch>
        </div>
    </Router>
  );
}

export default App;
