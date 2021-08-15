import React from 'react';
import Editor from './Editor'
import PropEditorBase from './PropEditorBase';

export default class ObjectEditor extends React.Component {
  render() {
    this.props.data.value = this.props.data.value || {};
    const editors = Editor.getSubEditors(this.props, this.props.data.props, this.props.data.value);
    return <PropEditorBase data={this.props.data}>
      <div className="sub-editors-container">
        <div className="sub-editors">
          { editors }
        </div>
      </div>
    </PropEditorBase>;
  }
}
