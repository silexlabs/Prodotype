import React from 'react';
import PropEditorBase from './PropEditorBase'
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/github';

export default class ActionEditor extends React.Component {
  render() {
    return <PropEditorBase onChange={this.props.onChange} data={this.props.data}>
      <AceEditor
        mode="javascript"
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
