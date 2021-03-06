import React from "react";

import "./App.css";
import Admin from "./admin/Admin.react.js";
import Home from "./public/home/Home.react";
import Rsvp from "./public/rsvp/Rsvp.react";

import { BrowserRouter, Route, Switch } from "react-router-dom";

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/admin" component={Admin} />
            <Route path="/rsvp" component={Rsvp} />
            <Route path="/" component={Home} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
