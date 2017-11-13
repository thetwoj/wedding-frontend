import React from 'react';

import './App.css';
import Admin from './admin/admin.react.js'
import Home from './public/home/home.react'

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'


class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home}/>
          <Route path="/admin" component={Admin}/>
        </div>
      </Router>
    )
  }
}

export default App;
