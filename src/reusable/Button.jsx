import React, { Component } from 'react';
import Spacer from './Spacer.jsx';

class Button extends Component {
  render() {
    const attrs = {
      className:
        'text-nowrap flex-row flex-align-center no-overflow ' +
        (this.props.toggled ? 'toggled ' : '') +
        this.props.className
    };
    return (
      <button {...attrs} onClick={this.props.onClick}>
        <span>{this.props.children}</span>
        {this.props.badge && <Spacer grow />}
        {this.props.badge && (
          <div className="badge flex-noshrink">{this.props.badge}</div>
        )}
      </button>
    );
  }
}

Button.defaultProps = {
  className: '',
  onClick: () => {},
  toggled: false
};

export default Button;
