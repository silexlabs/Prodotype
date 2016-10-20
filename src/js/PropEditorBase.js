import React from 'react';

export default class PropEditorBase extends React.Component {
  static idx = 0;
  render() {
    return <div className="prop-editor-base">
      { this.props.children }
    </div>;
  }
}
