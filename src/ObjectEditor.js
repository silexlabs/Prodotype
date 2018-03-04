import React from 'react';
import Editor from './Editor'
import PropEditorBase from './PropEditorBase'

export default class ObjectEditor extends React.Component {
  render() {
    this.props.data.value = this.props.data.value || {};
    const editors = this.props.data.props.map((prop, idx) => {
      // clone the definition
      const itemData = JSON.parse(JSON.stringify(prop));
      // compute the value
      if(typeof this.props.data.value[itemData.name] === 'undefined') {
        itemData.value = itemData.default;
      }
      else {
        itemData.value = this.props.data.value[itemData.name];
      }
      // create the editor
      return Editor.createPropEditors(itemData, this.props.componentNames, this.props.onBrowse, (value) => {
        this.props.data.value[itemData.name] = value;
        this.props.onChange(this.props.data.value);
      }, idx);
    });
    return <PropEditorBase data={this.props.data}>
      <div className="sub-editors-container">
        <div className="sub-editors">
          { editors }
        </div>
      </div>
    </PropEditorBase>;
  }
}
