import React, { Component } from 'react';

class Spacer extends Component {
  render() {
    const attrs = {
      className: 'flex-spacer ' + (this.props['grow'] ? 'flex-grow' : '')
    };
    return <div {...attrs} />;
  }
}

export default Spacer;
