import React from 'react';

import './App.css';
import Admin from './admin/admin.react.js'
import Home from './public/home/home.react'

import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom'


class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/admin" component={Admin}/>
            <Route path="/" component={Home}/>
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
