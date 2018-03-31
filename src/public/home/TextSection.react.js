import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class TextSection extends Component {

  static propTypes = {
    title: PropTypes.string,
    text: PropTypes.element,
    classes: PropTypes.string,
  };

  render() {
    return (
      <div>
        <a className="anchor" id={this.props.title.toLowerCase().replace(/ /g,'')}/>
        <div className={this.props.classes}>
          <div className="row">
            <div className="black-text content">
              <h1 className="title">{this.props.title}</h1>
              {this.props.text}
            </div>
          </div>
        </div>
      </div>
    );
  }
}