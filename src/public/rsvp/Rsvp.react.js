import React, { Component } from "react";

import "../../App.css";
import Navbar from "../common/Navbar.react.js";
import SliderMenuItem from "./SliderMenuItem.react.js";

import burlington from "../../images/burlington.jpg";
import hawthorne from "../../images/hawthorne.jpg";
import rossisland from "../../images/ross-island.jpg";
import sellwood from "../../images/sellwood.jpg";
import tilikum from "../../images/tilikum.jpg";

import Dialog from "material-ui/Dialog";
import MenuItem from "material-ui/MenuItem";
import Paper from "material-ui/Paper";
import RaisedButton from "material-ui/RaisedButton";
import SelectField from "material-ui/SelectField";
import Snackbar from "material-ui/Snackbar";
import TextField from "material-ui/TextField";

class Rsvp extends Component {
  constructor(props) {
    super(props);
    this.getSliders();

    this.state = {
      accessCode: "",
      error: null,
      invitation: null,
      sliders: null,
      showThanks: false,
      sliderDetailsOpen: false
    };
  }

  getSliders = () => {
    fetch("/api/sliders/", {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(resp => {
        if (!resp.ok) {
          throw new Error();
        }
        return resp;
      })
      .then(resp => resp.json())
      .then(resp => this.setState({ sliders: resp }))
      .catch(error => {});
  };

  getRsvp = event => {
    fetch("/api/rsvps/" + this.state.accessCode, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(resp => {
        if (!resp.ok) {
          this.setState({ error: "Code not found, please try again" });
          throw new Error();
        }
        return resp;
      })
      .then(resp => resp.json())
      .then(resp => {
        resp.guests.forEach(guest => {
          if (guest.sliders.length > 0) {
            guest.slider1 = guest.sliders[0].id;
          }
          if (guest.sliders.length === 2) {
            guest.slider2 = guest.sliders[1].id;
          }
        });
        this.setState({ invitation: resp, error: null });
      })
      .catch(error => {});

    event.preventDefault();
  };

  handleInputChange = (event, index) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    let invitation = this.state.invitation;
    if (index !== undefined) {
      invitation.guests[index][name] = value;
      this.setState({ invitation: invitation });
    } else {
      this.setState({ [name]: value });
    }
  };

  handleRequestClose = () => this.setState({ error: null });

  handleSlider1Change = (guest, key) => {
    let invitation = this.state.invitation;
    guest.slider1 = key;
    this.setState({ invitation: invitation });
  };

  handleSlider2Change = (guest, key) => {
    let invitation = this.state.invitation;
    guest.slider2 = key;
    this.setState({ invitation: invitation });
  };

  handleAttendingChange = (event, guest, isInputChecked) => {
    let invitation = this.state.invitation;
    guest.attending = isInputChecked;

    if (!isInputChecked) {
      guest.sliders = null;
      if (guest.invited_by) {
        this.deletePlusOne(event, guest);
      }
      if (guest.bringing_plus_one) {
        invitation.guests.forEach(invitee => {
          if (invitee.invited_by) {
            this.deletePlusOne(event, invitee);
          }
        });
      }
    }
    this.setState({ invitation: invitation });
  };

  deletePlusOne = (event, guest) => {
    let invitation = this.state.invitation;

    fetch("/api/rsvps/" + this.state.invitation.id + "/guests/" + guest.id, {
      method: "delete",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(resp => {
        if (!resp.ok) {
          this.setState({ error: "+1 could not be added, please try again" });
          throw new Error();
        }

        invitation.guests.forEach(inviter => {
          if (inviter.id === guest.invited_by) {
            inviter.bringing_plus_one = false;
          }
        });
        invitation.guests.pop();
        this.setState({ invitation: invitation });
      })
      .catch(error => {});

    event.preventDefault();
  };

  addPlusOne = (event, invitingGuest) => {
    fetch("/api/rsvps/" + this.state.invitation.id + "/guests/", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: invitingGuest.name + "'s guest",
        invited_by: invitingGuest.id,
        invitation: this.state.invitation.id
      })
    })
      .then(resp => {
        if (!resp.ok) {
          this.setState({ error: "+1 could not be added, please try again" });
          throw new Error();
        }
        return resp;
      })
      .then(resp => resp.json())
      .then(resp => {
        let invitation = this.state.invitation;
        invitation.guests.push(resp);
        invitingGuest.bringing_plus_one = true;
        this.setState({ invitation: invitation, error: null });
      })
      .catch(error => {});

    event.preventDefault();
  };

  submitRsvp = event => {
    let invitation = this.state.invitation;

    for (let i = 0; i < invitation.guests.length; i++) {
      let guest = invitation.guests[i];
      if (guest.invited_by && !guest.name) {
        this.setState({ error: "Please enter a name for your guest" });
        return;
      }
      if (guest.attending && !(guest.slider1 && guest.slider2)) {
        this.setState({
          error: "Please select two sliders for each attending guest"
        });
        return;
      }
    }

    invitation.guests.forEach(guest => {
      fetch("/api/rsvps/" + this.state.invitation.id + "/guests/" + guest.id, {
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: guest.name,
          attending: guest.attending,
          invitation: invitation.id,
          sliders: guest.attending ? [guest.slider1, guest.slider2] : []
        })
      })
        .then(resp => {
          if (!resp.ok) {
            this.setState({
              error: "RSVP could not be submitted, please try again"
            });
            throw new Error();
          }
          this.setState({ showThanks: true });
        })
        .catch(error => {});
    });

    event.preventDefault();
  };

  sliderMenuItems = () => {
    return this.state.sliders.map(slider => (
      <MenuItem key={slider.id} value={slider.id} primaryText={slider.name} />
    ));
  };

  toggleSliderDetails = event => {
    this.setState({ sliderDetailsOpen: !this.state.sliderDetailsOpen });
    if (event) {
      event.preventDefault();
    }
  };

  render() {
    let guestEdits = null;
    if (this.state.invitation && this.state.invitation.guests) {
      guestEdits = [];
      let guests = this.state.invitation.guests;

      guests.sort((a, b) => {
        if (a.id === undefined || a.invited_by) {
          return 1;
        } else if (b.id === undefined || b.invited_by) {
          return -1;
        }
        if (a.invitation === b.invitation) {
          return a.name.localeCompare(b.name);
        }
        return a.invitation - b.invitation;
      });

      guests.forEach((guest, index) => {
        guestEdits.push(
          <Paper className="rsvpGuest" key={"guestEdit" + index}>
            {!guest.invited_by && (
              <p className={"guestName"}>
                <b>{guest.name}</b>
              </p>
            )}

            {guest.invited_by && (
              <TextField
                name="name"
                value={guest.name}
                hintText="Name"
                floatingLabelText="Name"
                onChange={event => this.handleInputChange(event, index)}
                fullWidth={true}
              />
            )}

            <br />

            <SelectField
              name="attending"
              value={guest.attending === null ? null : guest.attending}
              floatingLabelText="Guest attending?"
              onChange={(event, key, payload) =>
                this.handleAttendingChange(event, guest, payload)
              }
              fullWidth={true}
            >
              <MenuItem value={true} primaryText="Yeah!" />
              <MenuItem value={false} primaryText="Nah" />
            </SelectField>
            <br />

            <p>
              <b>
                <a href={""} onClick={this.toggleSliderDetails}>
                  Slider menu
                </a>
              </b>
            </p>

            <SelectField
              disabled={!guest.attending}
              floatingLabelText={"Choose first slider"}
              value={guest.slider1}
              onChange={(event, _, item) =>
                this.handleSlider1Change(guest, item)
              }
              fullWidth={true}
            >
              {this.sliderMenuItems()}
            </SelectField>
            <br />

            <SelectField
              disabled={!guest.attending}
              floatingLabelText={"Choose second slider"}
              value={guest.slider2}
              onChange={(event, _, item) =>
                this.handleSlider2Change(guest, item)
              }
              fullWidth={true}
            >
              {this.sliderMenuItems()}
            </SelectField>
            <br />
          </Paper>
        );
      });

      guests.forEach((guest, index) => {
        if (!guest.offered_plus_one || guest.bringing_plus_one) {
          return;
        }
        index = guests.length + 1;
        guestEdits.push(
          <Paper className="rsvpPlusOneGuest" key={"guestEdit" + index}>
            <RaisedButton
              label="Add +1"
              disabled={!guest.attending}
              onClick={event => this.addPlusOne(event, guest)}
            />
          </Paper>
        );
      });
    }

    const dialogStyles = {
      dialogRoot: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "16px"
      },
      dialogContent: {
        position: "relative",
        width: "80vw",
        transform: ""
      },
      dialogBody: {
        paddingBottom: 0
      }
    };

    return (
      <div>
        <Navbar rsvp={true} />
        <div className={"navbarShim"} />

        {!this.state.showThanks && (
          <div className={"centered-content-block"}>
            <span className={"centered-content"}>
              Check out the <a href={"/#logistics"}>wedding logistics</a> and{" "}
              <a href={"/#faq"}>FAQ</a> before submitting your RSVP
            </span>
          </div>
        )}

        {!this.state.invitation &&
          !this.state.showThanks && (
            <form onSubmit={this.getRsvp}>
              <div className="accessCodeContainer">
                <div className="accessCode">
                  <TextField
                    name="accessCode"
                    onChange={event => this.handleInputChange(event)}
                    floatingLabelText="RSVP code"
                    fullWidth={true}
                  />
                  <RaisedButton
                    className="getRsvpSubmit"
                    label="Submit"
                    onClick={this.getRsvp}
                  />
                </div>
              </div>
            </form>
          )}

        {this.state.invitation &&
          !this.state.showThanks && (
            <form onSubmit={this.submitRsvp}>
              <div className={"rsvpGuestContainer"}>{guestEdits}</div>
              <div className={"rsvpGuestContainer"}>
                <RaisedButton
                  className="rsvpSubmit"
                  label="Submit"
                  onClick={this.submitRsvp}
                />
              </div>
            </form>
          )}

        {this.state.showThanks && (
          <div className={"centered-content-block"}>
            <span className="centered-content">Thanks for RSVPing!</span>
          </div>
        )}

        <Snackbar
          open={this.state.error !== null}
          message={this.state.error || ""}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />

        <Dialog
          title="Slider menu"
          modal={false}
          contentStyle={dialogStyles.dialogContent}
          bodyStyle={dialogStyles.dialogBody}
          style={dialogStyles.dialogRoot}
          open={this.state.sliderDetailsOpen}
          autoScrollBodyContent={true}
          onRequestClose={this.toggleSliderDetails}
          repositionOnUpdate={false}
        >
          <div className={"slider-menu-container"}>
            <SliderMenuItem
              slider={this.state.sliders ? this.state.sliders[2] : ""}
              image={burlington}
            />
            <SliderMenuItem
              slider={this.state.sliders ? this.state.sliders[1] : ""}
              image={hawthorne}
            />
            <SliderMenuItem
              slider={this.state.sliders ? this.state.sliders[3] : ""}
              image={rossisland}
            />
            <SliderMenuItem
              slider={this.state.sliders ? this.state.sliders[0] : ""}
              image={sellwood}
            />
            <SliderMenuItem
              slider={this.state.sliders ? this.state.sliders[4] : ""}
              image={tilikum}
            />
          </div>
          <div className={"pdx-slider-text"}>
            For additional details please visit the{" "}
            <a href="http://pdxsliders.com">PDX Sliders website</a>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default Rsvp;
