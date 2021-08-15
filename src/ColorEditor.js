import React from 'react';
import PropEditorBase from './PropEditorBase';

export default class ColorEditor extends React.Component {
  render() {
    return <PropEditorBase data={this.props.data}>
      <input
        type="color"
        onChange={e => this.props.onChange(e.target.value)}
        value={this.props.data.value}
      />
      <input
        type="text"
        onChange={e => this.props.onChange(e.target.value)}
        value={this.props.data.value}
        placeholder="#"
      />
    </PropEditorBase>;
  }
}
