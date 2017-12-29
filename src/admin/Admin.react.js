import React from 'react';

import '../App.css';
import EditForm from './EditForm.react'
import NewInvitationRow from './NewInvitationRow.react'

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';


class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      pass: null,
      token: null,
      guests: null,
      invitations: null,
      selectedInvitation: null,
      displayedInvitations: null,
    };
  }

  selectInvitation = (invitation) => {
    this.setState({selectedInvitation: invitation});
  };

  login(event) {
    fetch('/api/login/', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.user,
        password: this.state.pass,
      })
    })
      .then(resp => {
        if (!resp.ok) {
          throw Error();
        }
        return resp
      })
      .then(resp => resp.json())
      .then(resp => this.setState({token: resp.token}, () => this.fetchAll()))
      .catch();

    event.preventDefault();
  }

  fetchAll(invitation) {
    this.fetchGuests();
    this.fetchInvitations();
    if (invitation) {
      this.setState({selectedInvitation: invitation});
    }
  };

  fetchInvitations = () => {
    fetch('/api/invitations/', {
      headers: {
        'Authorization': 'Token ' + this.state.token
      }
    })
      .then(resp => resp.json())
      .then(resp => {
        let selectedInvitation = null;
        if (this.state.selectedInvitation) {
          resp.forEach(invitation => {
            if (invitation.id === this.state.selectedInvitation.id) {
              selectedInvitation = invitation;
            }
          });
        }
        let displayed = resp;
        if (this.state.search) {
          displayed = this.filterInvitations(resp, this.state.search)
        }
        this.setState({invitations: resp, displayedInvitations: displayed, selectedInvitation: selectedInvitation});
      });
  };

  fetchGuests = () => {
    fetch('/api/guests/', {
      headers: {
        'Authorization': 'Token ' + this.state.token
      }
    })
      .then(resp => resp.json())
      .then(resp => {
        this.setState({guests: resp})
      });
  };

  createInvitation() {
    this.setState({selectedInvitation: {address: '', sent: false, access_code: ''}})
  }

  createGuest(event) {
    let invitation = this.state.selectedInvitation;
    invitation.guests.push({});
    this.setState({selectedInvitation: invitation});
    event.preventDefault();
  }

  removeTempGuest(index) {
    let invitation = this.state.selectedInvitation;
    invitation.guests.splice(index, 1);
    this.setState({selectedInvitation: invitation});
  }

  filterInvitations(invitations, value) {
    if (!value) {
      return invitations
    }
    return invitations.filter(invitation =>
      invitation.guests.filter(guest => guest.name.toUpperCase().includes(value.toUpperCase())).length > 0
    );
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({[name]: value});
  }

  handleSearchChange(event) {
    const target = event.target;
    const value = target.value;

    let displayed = this.filterInvitations(this.state.invitations, value);
    this.setState({search: value, displayedInvitations: displayed});
    event.preventDefault();
  }

  render() {
    if (!this.state.token) {
      return (
        <form>
          <div className="loginContainer">
            <Paper className="loginPaper">
              <TextField name="user" value={this.state.user || ''} hintText="User" floatingLabelText="User"
                         onChange={event => this.handleInputChange(event)}
                         fullWidth={true}/>
              <TextField name="pass" value={this.state.pass || ''} hintText="Name" floatingLabelText="Pass"
                         onChange={event => this.handleInputChange(event)} type="password"
                         fullWidth={true}/>
              <FlatButton label="Login" onClick={event => this.login(event)}/>
            </Paper>
          </div>
        </form>
      )
    }

    let invitationRows = [];
    if (this.state.displayedInvitations) {
      this.state.displayedInvitations.forEach(invitation => {
        invitationRows.push(
          <NewInvitationRow callback={invitation => this.selectInvitation(invitation)} invitation={invitation}
                            key={invitation.id}/>
        )
      });
    }

    return (
      <div className="App">
        <AppBar
          title="Wedding admin"
          style={{background: '#5388CD'}}
          iconElementLeft={<span/>}
          iconElementRight={<FlatButton label="Create Invitation" onClick={event => this.createInvitation(event)}/>}
        />

        <div className={"invitationContainer " + (this.state.selectedInvitation ? '' : 'fullWidth')}>
          <div className="fullWidth">
            <TextField
              onChange={event => this.handleSearchChange(event)}
              floatingLabelText="Search"
            />
          </div>
          {invitationRows}
        </div>

        <EditForm
          style={{flex: 1}}
          token={this.state.token}
          invitation={this.state.selectedInvitation}
          callback={invitation => this.fetchAll(invitation)}
          createGuest={event => this.createGuest(event)}
          removeTempGuest={index => this.removeTempGuest(index)}/>
      </div>
    );
  }
}

export default Admin;
