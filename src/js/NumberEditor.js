import React from 'react';
import PropEditorBase from './PropEditorBase'

export default class NumberEditor extends React.Component {
  render() {
    return <PropEditorBase onChange={this.props.onChange} data={this.props.data}>
      <label>{ this.props.data.name }</label><br />
      <input
        type="number"
        name="InputValue"
        value={ this.props.data.value || '' }
        onChange={(e) => this.props.onChange(e.target.value)}
      />
    </PropEditorBase>;
  }
}
