import React from 'react';
import TextField from 'material-ui/TextField';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import PropEditorBase from './PropEditorBase'

export default class ArrayEditor extends React.Component {
  render() {
    return <PropEditorBase onChange={this.props.onChange} data={this.props.data}>
      <TextField
        value={ this.props.data.value.join('\n') }
        name="InputValue"
        onChange={(e) => this.props.onChange(e.target.value.split('\n').map(row => {
          try { return JSON.parse(row); } catch(e) { return row; };
        }))}
        multiLine={true}
        rows={2}
      />
    </PropEditorBase>;
  }
}
