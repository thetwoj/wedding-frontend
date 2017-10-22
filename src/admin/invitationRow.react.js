import React from 'react';

class InvitationRow extends React.Component {
  render() {
    let {invitation} = this.props;
    let firstGuest = invitation.guests[0] && invitation.guests[0].name ? invitation.guests[0].name : 'No guests';
    return (
      <tr>
        <td>{invitation.id}</td>
        <td>{firstGuest}</td>
        <td>
          <button onClick={() => this.props.callback(invitation)}>Edit</button>
        </td>
      </tr>
    );
  }
}

export default InvitationRow;
