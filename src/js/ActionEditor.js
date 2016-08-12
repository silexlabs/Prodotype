import React from 'react';
import PropEditorBase from './PropEditorBase'
import AceEditor from 'react-ace';

export default class ActionEditor extends React.Component {
  render() {
    return <PropEditorBase onChange={this.props.onChange} data={this.props.data}>
      { this.props.data.name }
      <AceEditor
        mode="javascript"
        onChange={(value) => this.props.onChange(value)}
        enableBasicAutocompletion={true}
        name={ "InputValue" + (PropEditorBase.idx++) }
        value={ this.props.data.value || '' }
      />
    </PropEditorBase>;
  }
}
