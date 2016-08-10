import React from 'react';
import PropEditorBase from './PropEditorBase'
import Toggle from 'material-ui/Toggle';

export default class BooleanEditor extends React.Component {
  render() {
    return <PropEditorBase onChange={this.props.onChange} data={this.props.data}>
      <Toggle
        name="InputValue"
        label={ this.props.data.name }
        labelPosition="right"
        value={ this.props.data.value || false }
        onToggle={(e) => this.props.onChange(e.target.checked)}
      />
    </PropEditorBase>;
  }
}
