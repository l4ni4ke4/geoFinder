import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import "./App.css"
import GamePage from "./pages/Game/GamePage"
import Home from "./pages/Home/Home"

function App() {

  return (
      <Router>
        <div>
          <Switch>

            <Route path="/GamePage">
              <GamePage/>
            </Route>

            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
    </Router>
  );
}

export default App;
