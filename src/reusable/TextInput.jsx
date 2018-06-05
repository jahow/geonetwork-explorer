import React, { Component } from 'react';

class TextInput extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }
  onChange(event) {
    this.props.onChange(event.target.value);
  }

  render() {
    return (
      <div className="input-text width-100">
        <input
          type="text"
          placeholder={this.props.placeholder}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export default TextInput;
