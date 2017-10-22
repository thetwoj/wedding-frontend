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
    if (!props.invitation) {
      return
    }

    this.state = {
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

    fetch('http://127.0.0.1:8000/invitations/' + invitation.id + '/', {
      method: 'delete',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(() => this.props.callback());

    event.preventDefault();
  }

  handleGuestDelete(event, guest, index) {
    if (!guest.id) {
      this.props.removeTempGuest(index);
    } else {
      fetch('http://127.0.0.1:8000/invitations/' + guest.invitation + '/guests/' + guest.id + '/', {
        method: 'delete',
        headers: {
          'Accept': 'application/json',
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
      fetch('http://127.0.0.1:8000/invitations/' + invitation.id + '/', {
        method: 'put',
        headers: {
          'Accept': 'application/json',
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
      fetch('http://127.0.0.1:8000/invitations/', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sent: invitation.sent,
          address: invitation.address,
          access_code: invitation.access_code,
        })
      })
        .then(resp => resp.json())
        .then(resp => this.props.callback(resp))
        .then(() => this.submitGuests());
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
        fetch('http://127.0.0.1:8000/guests/' + guest.id + '/', {
          method: 'put',
          headers: {
            'Accept': 'application/json',
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
        fetch('http://127.0.0.1:8000/guests/', {
          method: 'post',
          headers: {
            'Accept': 'application/json',
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
      <div>
        <Checkbox name="sent" checked={invitation.sent} label="Sent"
                  onCheck={event => this.handleInputChange(event)}/>
        <br/>

        <TextField multiLine={true} name="address" value={invitation.address} hintText="Address"
                   floatingLabelText="Address"
                   onChange={event => this.handleInputChange(event)}/>
        <br/>

        <TextField name="access_code" value={invitation.access_code} hintText="Access code"
                   floatingLabelText="Access code"
                   onChange={event => this.handleInputChange(event)}/>
        <br/>

        <FlatButton label="Delete" onClick={event => this.handleInvitationDelete(event)}/>
        <br/>
        <br/>
      </div>
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
      console.log(guests);

      guests.forEach((guest, index) => {
        guestEdits.push(
          <div key={'guestEdit' + index}>
            <TextField name="name" value={guest.name || ''} hintText="Name" floatingLabelText="Name"
                       onChange={event => this.handleInputChange(event, index)}/>
            <br/>

            <SelectField name="attending" value={guest.attending === null ? "no_response" : guest.attending}
                         floatingLabelText="Attending"
                         onChange={(event, key, payload) => this.handleDropdownChange(index, payload)}>
              <MenuItem value={true} primaryText="Yes"/>
              <MenuItem value={false} primaryText="No"/>
              <MenuItem value='no_response' primaryText="No response"/>
            </SelectField>
            <br/>

            <Checkbox name="offered_plus_one" checked={guest.offered_plus_one || false} label="Offered +1"
                      onCheck={event => this.handleInputChange(event, index)}/>
            <br/>

            <Checkbox name="bringing_plus_one" checked={guest.bringing_plus_one || false} label="Bringing +1"
                      disabled={!guest.offered_plus_one}
                      onCheck={event => this.handleInputChange(event, index)}/>
            <br/>

            <TextField type="number" name="food_choice" value={guest.food_choice || ''}
                       onChange={event => this.handleInputChange(event, index)}/>
            <br/>

            <FlatButton label="Delete" onClick={(event) => this.handleGuestDelete(event, guest, index)}/>
            <br/>
            <br/>
          </div>
        )
      });
    }

    let addGuest = null;
    if (this.state.invitation.id) {
      addGuest = <FlatButton label="Add guest" onClick={event => this.props.createGuest(event)}/>;
    }

    return (
      <Paper style={{margin: 12, padding: 12}}>
        <form>
          {invitationEdit}
          {guestEdits}
          <FlatButton label="Submit" onClick={event => this.handleSubmit(event)}/>
          {addGuest}
        </form>
      </Paper>
    )
  }
}

export default EditForm