import React from 'react';
import PropEditorBase from './PropEditorBase'

export default class BooleanEditor extends React.Component {
  render() {
    return <PropEditorBase onChange={this.props.onChange} data={this.props.data}>
      <input
        type = "checkbox"
        checked={ this.props.data.value ? 'checked' : '' }
        onChange={(e) => this.props.onChange(e.target.checked)}
      />
    </PropEditorBase>;
  }
}
