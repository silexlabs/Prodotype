import React from 'react';
import PropEditorBase from './PropEditorBase';
import AceEditor from 'react-ace';

export default class ActionEditor extends React.Component {
  render() {
    return <PropEditorBase onChange={this.props.onChange} data={this.props.data}>
      <AceEditor
        mode="javascript"
        theme="github"
        onChange={(value) => this.props.onChange(value)}
        name={ "InputValue" + (PropEditorBase.idx++) }
        value={ this.props.data.value || '' }
        enableBasicAutocompletion={true}
        enableSnippets={true}
        enableLiveAutocompletion={true}
        showGutter={true}
        tabSize={2}
        height="100px"
        width="100%"
      />
    </PropEditorBase>;
  }
}
