import React from 'react';

export default class PropEditorBase extends React.Component {
  static idx = 0;
  state = {
    expand: false
  }
  render() {
    return <div className={"prop-editor-base " + (this.state.expand ? "prop-editor-expand " : " ") + (this.props.className ? this.props.className : "")}>
      <label
        className="prop-editor-name"
        onClick={e => this.setState({expand:!this.state.expand})}
      >
        <span className={"fa fa-fw fa-inverse " + (this.state.expand ? "fa-caret-down" : "fa-caret-right")}></span>
        { this.props.data.name }
      </label>
      { this.state.expand && this.props.data.description ? <p className="prop-editor-description">{this.props.data.description}</p> : "" }
      <div className="prop-editor-container">
        { this.state.expand ? this.props.children : "" }
      </div>
    </div>;
  }
}
