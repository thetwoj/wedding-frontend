import React, { Component } from "react";
import PropTypes from "prop-types";

import Paper from "material-ui/Paper";

export default class SliderMenuItem extends Component {
  static propTypes = {
    slider: PropTypes.object,
    image: PropTypes.element
  };

  render() {
    return (
      <Paper className={"slider-menu-item"} zDepth={1}>
        <div className={"sliderName sliderText"}>
          <b>{this.props.slider.name}</b>
        </div>
        <img className="slider" src={this.props.image} alt={""} />
        <div className={"sliderText"}>{this.props.slider.description}</div>
      </Paper>
    );
  }
}
