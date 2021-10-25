import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import "./App.css"
import Play from "./pages/Play"
import Home from "./pages/Home/Home"

function App() {

  return (
      <Router>
        <div>
          <Switch>

            <Route path="/play">
              <Play/>
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
