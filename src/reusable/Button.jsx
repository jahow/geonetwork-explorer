import React, { Component } from 'react';

class Button extends Component {
  static defaultProps = {
    className: ''
  };

  render() {
    const props = {
      className: 'text-nowrap ' + this.props.className
    };
    return (
      <button {...props}>
        <span>this.props.children</span>
        {this.props.badge && <div className="badge">{this.props.badge}</div>}
      </button>
    );
  }
}

export default Button;
