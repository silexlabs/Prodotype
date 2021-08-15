import React from 'react';
import PropEditorBase from './PropEditorBase';

export default class ComponentEditor extends React.Component {
  render() {
    let idx = 0;
    const options = this.props.dataSources.components ? this.props.dataSources.components.map(compData => {
      if(!this.props.data.accept || this.props.data.accept.includes(compData.templateName)) {
        return <option
          key = { idx++ }
          value = {  compData.name  }
        >{  compData.displayName  }</option>
      }
      return null;
    }) : [];
    return <PropEditorBase data = { this.props.data } >
        <select
          onChange={(e) => this.props.onChange(e.target.value)}
          value = { this.props.data.value }
        >
          { options }
        </select>
    </PropEditorBase>;
  }
}
