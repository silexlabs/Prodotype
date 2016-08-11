import React from 'react';
import PropEditorBase from './PropEditorBase'
import {List, ListItem, MakeSelectable} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

let SelectableList = MakeSelectable(List);

export default class EnumEditor extends React.Component {
  render() {
    let idx = 0;
    const options = this.props.data
      .type.map(name => <ListItem
        key = { idx++ }
        onClick = { e => this.props.onChange(name) }
        primaryText = {  name  }
        value = {  name  }
      />);
    return <PropEditorBase data = { this.props.data } >
        <SelectableList
          name = {  "InputValue" + (PropEditorBase.idx++) }
          value = { this.props.data.value }
        >
          <Subheader>{ this.props.data.name }</Subheader>
          { options }
        </SelectableList>
    </PropEditorBase>;
  }
}
