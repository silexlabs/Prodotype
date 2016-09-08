import React from 'react';
import TextField from 'material-ui/TextField';
import Editor from './Editor'
import PropEditorBase from './PropEditorBase'

export default class ObjectArrayEditor extends React.Component {
  render() {
    this.props.data.value = this.props.data.value || [];
    const editors = this.props.data.value.map((subData, idx) => {
      const subEditors = this.props.data.type.map((subType, subIdx) => {
        // clone the definition
        const itemData = JSON.parse(JSON.stringify(subType));
        // compute the value
        itemData.value = subData[itemData.name] || itemData.default;
        console.log('aaa', itemData.value)
        // create the editor
        return Editor.createPropEditors(itemData, this.props.componentNames, this.props.onBrowse, (value) => {
          subData[itemData.name] = value;
          this.props.onChange(this.props.data.value);
        }, subIdx);
      });
      return <div
        key={idx}
        >
          <button onClick={e => {
            this.props.data.value.splice(idx, 1);
            this.props.onChange(this.props.data.value);
          }}>-</button>
          {subEditors}
        </div>;
    });
    return <PropEditorBase>
      { editors }
      <button onClick={e => this.props.onChange(this.props.data.value.concat([{}]))}>+</button>
    </PropEditorBase>;
  }
}
