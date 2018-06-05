import React, { Component } from 'react';

class TextInput extends Component {
  render() {
    return (
      <div className="input-text width-100">
        <input type="text" placeholder={this.props.placeholder} />
      </div>
    );
  }
}

export default TextInput;
