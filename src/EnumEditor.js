import React from 'react';
import PropEditorBase from './PropEditorBase';

export default class EnumEditor extends React.Component {
  render() {
    let idx = 0;
    const options = this.props.data
      .type.map(name => <option
        key = { idx++ }
        value = {  name  }
      >{  name  }</option>);
    return <PropEditorBase data = { this.props.data } >
        <select
          onChange={(e) => this.props.onChange(e.target.value)}
          id = {  "InputValue" + (PropEditorBase.idx++) }
          defaultValue = { this.props.data.value }
          >
          { options }
        </select>
    </PropEditorBase>;
  }
}
