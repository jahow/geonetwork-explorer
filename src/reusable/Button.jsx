import React, { Component } from 'react';

class Button extends Component {
  render() {
    const attrs = {
      className: 'text-nowrap ' + this.props.className
    };
    return (
      <button {...attrs} onClick={this.props.onClick}>
        <span>{this.props.children}</span>
        {this.props.badge && <div className="badge">{this.props.badge}</div>}
      </button>
    );
  }
}

Button.defaultProps = {
  className: '',
  onClick: () => {}
};

export default Button;
