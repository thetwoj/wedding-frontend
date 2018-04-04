import React, {Component} from 'react';

import '../../App.css';
import Admin from "../../admin/Admin.react";

import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

class Rsvp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accessCode: '',
      invitation: null,
    };
  }

  getRsvp = (event) => {
    fetch('/api/rsvp/' + this.state.accessCode, {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
      .then(resp => {
        if (!resp.ok) {
          throw Error();
        }
        return resp
      })
      .then(resp => resp.json())
      .then(resp => this.setState({invitation: resp}))
      .catch();

    event.preventDefault();
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({[name]: value});
  };

  render() {
    return (
      <div className="fullWidth">
        <TextField
          name="accessCode"
          onChange={this.handleInputChange}
          floatingLabelText="Code"
        />
        <FlatButton label="Submit" onClick={this.getRsvp}/>
      </div>
    )
  }
}

export default Rsvp;
