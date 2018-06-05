import React, { Component } from 'react';

class ButtonBar extends Component {
  render() {
    const attrs = {
      className:
        'button-bar ' +
        (this.props.vertical ? 'vertical flex-col' : 'horizontal flex-row')
    };
    return <div {...attrs}>{this.props.children}</div>;
  }
}

ButtonBar.defaultProps = {
  vertical: false,
  horizontal: true
};

export default ButtonBar;
