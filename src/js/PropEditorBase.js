import React from 'react';
import {ListItem} from 'material-ui/List';

export default class PropEditorBase extends React.Component {
  static idx = 0;
  state = {}
  render() {
    return <ListItem>
      { this.props.children }
    </ListItem>;
  }
}
