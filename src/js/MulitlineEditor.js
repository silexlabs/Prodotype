import React from 'react';
import TextField from 'material-ui/TextField';
import PropEditorBase from './PropEditorBase'

export default class MultilineEditor extends React.Component {
  render() {
    return <PropEditorBase onChange={this.props.onChange} data={this.props.data}>
      <TextField
        value={ this.props.data.value || '' }
        floatingLabelText={ this.props.data.name }
        floatingLabelFixed={true}
        name={ "InputValue" + (PropEditorBase.idx++) }
        onChange={(e) => this.props.onChange(e.target.value)}
        multiLine={true}
        rows={2}
      />
    </PropEditorBase>;
  }
}
