import React from 'react';
import PropEditorBase from './PropEditorBase'
import {List, ListItem, MakeSelectable} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

let SelectableList = MakeSelectable(List);

export default class ComponentEditor extends React.Component {
  render() {
    let idx = 0;
    const options = this.props.componentNames.map(compData => {
      if(!this.props.data.accept || this.props.data.accept.includes(compData.templateName)) {
        return <ListItem
          key = { idx++ }
          onClick = { e => this.props.onChange(compData.name) }
          primaryText = {  compData.displayName  }
          value = {  compData.name  }
        />
      }
      return null;
    });
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
