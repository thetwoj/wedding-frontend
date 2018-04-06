import React, {Component} from 'react';

import '../../App.css';

import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


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

    let guestEdits = null;
    if (this.state.invitation && this.state.invitation.guests) {
      guestEdits = [];
      let guests = this.state.invitation.guests;
      guests.sort((a, b) => {
        if (a.id === undefined) {
          return 1
        }
        else if (b.id === undefined) {
          return -1
        }
        if (a.invitation === b.invitation) {
          return a.name.localeCompare(b.name)
        }
        return a.invitation - b.invitation
      });

      guests.forEach((guest, index) => {
        guestEdits.push(
          <Paper className="rsvpGuest" key={'guestEdit' + index}>
            <p><b>{guest.name}</b></p>
            <br/>

            <SelectField name="attending" value={guest.attending === null ? "no_response" : guest.attending}
                         floatingLabelText="Attending"
                         onChange={(event, key, payload) => this.handleDropdownChange(index, payload)}
                         fullWidth={true}>
              <MenuItem value={true} primaryText="Yes"/>
              <MenuItem value={false} primaryText="No"/>
              <MenuItem value='no_response' primaryText="No response"/>
            </SelectField>
            <br/>

            <TextField type="number" name="food_choice" value={guest.food_choice || ''} floatingLabelText="Food choice"
                       onChange={event => this.handleInputChange(event, index)}
                       fullWidth={true}/>
            <br/>

            {guest.offered_plus_one &&
              <Checkbox
              name="bringing_plus_one" checked={guest.bringing_plus_one || false} label="Bringing +1"
              onCheck={event => this.handleInputChange(event, index)}/>
            }

          </Paper>
        )
      });
    }

    return (
      <div>
        <form>
          <div className="accessCodeContainer">
            <div className="accessCode">
              <TextField
                name="accessCode"
                onChange={this.handleInputChange}
                floatingLabelText="Code"
                fullWidth={true}
              />
              <FlatButton label="Submit" onClick={this.getRsvp}/>
            </div>
          </div>
        </form>
        <form className="rsvpGuestContainer">
          {guestEdits}
        </form>
      </div>
    )
  }
}

export default Rsvp;
