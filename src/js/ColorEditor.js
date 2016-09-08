import React from 'react';
import PropEditorBase from './PropEditorBase'
import FlatButton from 'material-ui/FlatButton';
import Subheader from 'material-ui/Subheader';

export default class ColorEditor extends React.Component {
  render() {
    return <PropEditorBase data={this.props.data}>
      <Subheader>{ this.props.data.name }</Subheader>
      <input
        type="color"
        onChange={e => this.props.onChange(e.target.value)}
        value={this.props.data.value}
      />
    </PropEditorBase>;
  }
}
