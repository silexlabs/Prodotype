import React from 'react';
import PropEditorBase from './PropEditorBase'

export default class ComponentEditor extends React.Component {
  render() {
    let idx = 0;
    const options = this.props.componentNames.map(compData => {
      if(!this.props.data.accept || this.props.data.accept.includes(compData.templateName)) {
        return <option
          key = { idx++ }
          onClick = { e => this.props.onChange(compData.name) }
          value = {  compData.name  }
        >{  compData.displayName  }</option>
      }
      return null;
    });
    return <PropEditorBase data = { this.props.data } >
        <select
          value = { this.props.data.value }
        >
          { options }
        </select>
    </PropEditorBase>;
  }
}
