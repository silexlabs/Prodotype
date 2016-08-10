import React from 'react';
import TextField from 'material-ui/TextField';
import {ListItem} from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';

export default class PropEditorBase extends React.Component {
  state = {}
  render() {
    return <ListItem>
      { this.props.children }
    </ListItem>;
  }
}
