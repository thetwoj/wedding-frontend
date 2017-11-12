import React from 'react';

import './App.css';
import EditForm from './admin/editForm.react'
import NewInvitationRow from './admin/newInvitationRow.react'

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      guests: null,
      invitations: null,
      selectedInvitation: null,
      displayedInvitations: null,
    };
  }

  selectInvitation = (invitation) => {
    this.setState({selectedInvitation: invitation});
  };

  componentDidMount() {
    this.fetchAll();
  };

  fetchAll(invitation) {
    this.fetchGuests();
    this.fetchInvitations();
    if (invitation) {
      this.setState({selectedInvitation: invitation});
    }
  };

  fetchInvitations = () => {
    fetch('http://127.0.0.1:8000/invitations/')
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
    fetch('http://127.0.0.1:8000/guests/')
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


  handleSearchChange(event) {
    const target = event.target;
    const value = target.value;

    let displayed = this.filterInvitations(this.state.invitations, value);
    this.setState({search: value, displayedInvitations: displayed});
    event.preventDefault();
  }

  render() {
    let invitationRows = [];
    if (this.state.displayedInvitations) {
      this.state.displayedInvitations.forEach(invitation => {
        invitationRows.push(
          <NewInvitationRow callback={invitation => this.selectInvitation(invitation)} invitation={invitation}
                            key={invitation.id}></NewInvitationRow>
        )
      });
    }

    return (
      <div className="App">
        <AppBar
          title="Wedding admin"
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
            invitation={this.state.selectedInvitation}
            callback={invitation => this.fetchAll(invitation)}
            createGuest={event => this.createGuest(event)}
            removeTempGuest={index => this.removeTempGuest(index)}></EditForm>
      </div>
    );
  }
}

export default App;
