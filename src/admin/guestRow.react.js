import React from 'react';

class GuestRow extends React.Component {
  render() {
    let {guest} = this.props;
    let attending = 'No response';
    if (guest.attending) {
      attending = 'Yes';
    } else if (guest.attending === false) {
      attending = 'Nope'
    }

    return (
      <tr>
        <td>{guest.name}</td>
        <td>{attending}</td>
        <td>
          <button onClick={() => this.props.callback(guest)}>Edit</button>
        </td>
      </tr>
    );
  }
}

export default GuestRow;
