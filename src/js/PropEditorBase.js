import React from 'react';

export default class PropEditorBase extends React.Component {
  static idx = 0;
  render() {
    return <div className="prop-editor-base">
      <label>{ this.props.data.name }</label>
      { this.props.children }
    </div>;
  }
}
