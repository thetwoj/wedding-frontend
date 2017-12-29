import React from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';


class NewInvitationRow extends React.Component {
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

  render() {
    const style = {
      margin: 12,
      textAlign: 'center',
      display: 'inline-block',
    };

    let {invitation} = this.props;
    let guestRows = [];

    if (this.state.invitation) {
      let guests = this.state.invitation.guests;
      guests.sort((a, b) => {
        if (a.id === undefined) {
          return -1
        }
        else if (b.id === undefined) {
          return 1
        }
        if (a.invitation === b.invitation) {
          return a.name.localeCompare(b.name)
        }
        return a.invitation - b.invitation
      });

      guests.forEach(guest => {
        guestRows.push(<div key={guest.id || Math.random() * 50000}> {guest.name}</div>);
      });
    }

    return (
      <Card style={style} className="invitation" onClick={() => this.props.callback(invitation)}>
        <CardHeader
          title={"Invitation " + invitation.id}
        />
        <CardText>
          {guestRows}
        </CardText>
      </Card>
    );
  }
}

export default NewInvitationRow;
