import React from 'react';
import PropEditorBase from './PropEditorBase'

export default class EnumEditor extends React.Component {
  render() {
    let idx = 0;
    const options = this.props.data
      .type.map(name => <option
        key = { idx++ }
        onClick = { e => this.props.onChange(name) }
        value = {  name  }
      >{  name  }</option>);
    return <PropEditorBase data = { this.props.data } >
        <label>{ this.props.data.name }</label>
        <select
          id = {  "InputValue" + (PropEditorBase.idx++) }
          defaultValue = { this.props.data.value }
          >
          { options }
        </select>
    </PropEditorBase>;
  }
}
