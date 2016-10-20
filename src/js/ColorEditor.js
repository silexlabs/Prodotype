import React from 'react';
import PropEditorBase from './PropEditorBase'

export default class ColorEditor extends React.Component {
  render() {
    return <PropEditorBase data={this.props.data}>
      <label>{ this.props.data.name }</label>
      <input
        type="color"
        onChange={e => this.props.onChange(e.target.value)}
        value={this.props.data.value}
      />
    </PropEditorBase>;
  }
}
