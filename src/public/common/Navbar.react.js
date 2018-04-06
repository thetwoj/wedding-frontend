import React, {Component} from 'react';

import '../../App.css';

class Navbar extends Component {
  render() {
    return (
      <div className="navbar">
        <div className="navbar-links white-text">
          <span className="navbar-title">JJ and Amara</span>
          <a href="/rsvp" style={{marginLeft: '12px'}}>RSVP</a>
          <a href="#logistics" style={{marginLeft: '12px'}}>Logistics</a>
          <a href="#registry" style={{marginLeft: '12px'}}>Registry</a>
          <a href="#ourstory" style={{marginLeft: '12px'}}>Our story</a>
          <a href="#faq" style={{marginLeft: '12px'}}>FAQ</a>
        </div>
      </div>
    )
  }
}

export default Navbar;
