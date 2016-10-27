import React from 'react';

export default class PropEditorBase extends React.Component {
  static idx = 0;
  state = {
    expand: false
  }
  render() {
    return <div className={"prop-editor-base " + (this.state.expand ? "prop-editor-expand" : "")}>
      <label
        className="prop-editor-description"
        onClick={e => this.setState({expand:!this.state.expand})}
      >
        <span className={"fa fa-fw fa-inverse " + (this.state.expand ? "fa-caret-down" : "fa-caret-right")}></span>
        { this.props.data.name }
      </label>
      <div className="prop-editor-container">
        { this.state.expand ? this.props.children : "" }
      </div>
    </div>;
  }
}
