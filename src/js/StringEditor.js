import React from 'react';
import TextField from 'material-ui/TextField';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import PropEditorBase from './PropEditorBase'

export default class StringEditor extends React.Component {
  render() {
    return <PropEditorBase onChange={this.props.onChange} data={this.props.data}>
      <TextField
        ref={c => this.input = c}
        value={ this.props.data.value }
        name="InputValue"
        onChange={(e) => this.props.onChange(e.target.value)}
      />
    </PropEditorBase>;
  }
}
