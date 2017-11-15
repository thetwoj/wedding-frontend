import React from 'react';

import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


class EditForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token: props.token,
      invitation: props.invitation
    };
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.invitation) {
      return
    }

    this.setState({invitation: newProps.invitation});
  }

  handleInputChange(event, index) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    let invitation = this.state.invitation;
    if (index !== undefined) {
      invitation.guests[index][name] = value;
    } else {
      invitation[name] = value;
    }

    this.setState({invitation: invitation})
  }

  handleDropdownChange(index, value) {
    let invitation = this.state.invitation;
    invitation.guests[index].attending = value;

    this.setState({invitation: invitation})
  }

  handleInvitationDelete(event) {
    const {invitation} = this.state;

    if (invitation.id) {
      fetch('/invitations/' + invitation.id + '/', {
        method: 'delete',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Token ' + this.state.token,
          'Content-Type': 'application/json'
        }
      })
        .then(() => this.props.callback());
    } else {
      this.props.callback();
    }

    event.preventDefault();
  }

  handleGuestDelete(event, guest, index) {
    if (!guest.id) {
      this.props.removeTempGuest(index);
    } else {
      fetch('/invitations/' + guest.invitation + '/guests/' + guest.id + '/', {
        method: 'delete',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Token ' + this.state.token,
          'Content-Type': 'application/json'
        }
      })
        .then(() => this.props.callback());
    }

    event.preventDefault();
  }

  handleSubmit(event) {
    const {invitation} = this.state;

    if (invitation.id) {
      fetch('/invitations/' + invitation.id + '/', {
        method: 'put',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Token ' + this.state.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sent: invitation.sent,
          address: invitation.address,
          access_code: invitation.access_code,
        })
      })
        .then(() => this.props.callback())
        .then(() => this.submitGuests());
    } else {
      fetch('/invitations/', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Token ' + this.state.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sent: invitation.sent,
          address: invitation.address,
          access_code: invitation.access_code,
        })
      })
        .then(resp => resp.json())
        .then(resp => this.props.callback(resp));
    }
    event.preventDefault();
  }

  submitGuests() {
    const {invitation} = this.state;

    if (!invitation.guests) {
      return;
    }

    invitation.guests.forEach(guest => {
      let attending = guest.attending;
      if (attending === 'no_response') {
        attending = null;
      }

      if (guest.id) {
        fetch('/guests/' + guest.id + '/', {
          method: 'put',
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Token ' + this.state.token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            invitation: invitation.id,
            name: guest.name,
            attending: attending,
            offered_plus_one: guest.offered_plus_one,
            bringing_plus_one: guest.bringing_plus_one,
            food_choice: guest.food_choice || null,
          })
        })
          .then(() => this.props.callback());
      } else {
        fetch('/guests/', {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Token ' + this.state.token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            invitation: invitation.id,
            name: guest.name,
            attending: attending,
            offered_plus_one: guest.offered_plus_one,
            bringing_plus_one: guest.bringing_plus_one,
            food_choice: guest.food_choice || null,
          })
        })
          .then(() => this.props.callback());
      }
    })
  }

  render() {
    if (!this.props.invitation) {
      return null
    }
    const {invitation} = this.props;
    const invitationEdit = (
      <Paper className="editInvitation">
        <p><b>Invitation</b></p>
        <TextField multiLine={true} name="address" value={invitation.address} hintText="Address"
                   floatingLabelText="Address"
                   onChange={event => this.handleInputChange(event)}
                   fullWidth={true}/>
        <br/>

        <TextField name="access_code" value={invitation.access_code}
                   floatingLabelText="Access code"
                   onChange={event => this.handleInputChange(event)}
                   fullWidth={true}/>
        <br/>

        <Checkbox name="sent" checked={invitation.sent} label="Sent"
                  onCheck={event => this.handleInputChange(event)}/>
        <br/>

        <FlatButton label="Delete" onClick={event => this.handleInvitationDelete(event)}/>
      </Paper>
    );

    let guestEdits = null;
    if (this.state.invitation.guests) {
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
          <Paper className="editGuest" key={'guestEdit' + index}>
            <p><b>Guest</b></p>
            <TextField name="name" value={guest.name || ''} hintText="Name" floatingLabelText="Name"
                       onChange={event => this.handleInputChange(event, index)}
                       fullWidth={true}/>
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

            <Checkbox name="offered_plus_one" checked={guest.offered_plus_one || false} label="Offered +1"
                      onCheck={event => this.handleInputChange(event, index)}/>

            <Checkbox name="bringing_plus_one" checked={guest.bringing_plus_one || false} label="Bringing +1"
                      disabled={!guest.offered_plus_one}
                      onCheck={event => this.handleInputChange(event, index)}/>


            <FlatButton label="Delete" onClick={(event) => this.handleGuestDelete(event, guest, index)}/>
          </Paper>
        )
      });
    }

    let addGuest = null;
    if (this.state.invitation.id) {
      addGuest = <FlatButton label="Add guest" onClick={event => this.props.createGuest(event)}/>;
    }

    return (
      <form className="editBoxContainer">
        {invitationEdit}
        {guestEdits}
        <Paper className="editControls">
          <FlatButton label="Submit all" onClick={event => this.handleSubmit(event)}/>
          {addGuest}
        </Paper>
      </form>
    )
  }
}

export default EditForm