import React from 'react';

export default class PropEditorBase extends React.Component {
  static idx = 0;
  state = {
  }
  render() {
    if(this.props.data.expandable) {
      const expand = typeof this.state.expand === 'undefined' ? this.props.expand : this.state.expand || false;
      return <div className={"prop-editor-base prop-editor-expandable " + (expand ? "prop-editor-expand " : " ") + (this.props.className ? this.props.className + " " : "") + (this.props.data.className ? this.props.data.className + " " : "") + ("prop_" + this.props.data.name + " ")}>
        <label
          className="prop-editor-name"
          onClick={e => this.setState({expand:!expand})}
        >
          <span className={"fa fa-fw fa-inverse " + (expand ? "fa-caret-down" : "fa-caret-right")}></span>
          { this.props.data.name }
        </label>
        { expand && this.props.data.description ? <p className="prop-editor-description">{this.props.data.description}</p> : "" }
        <div className="prop-editor-container">
          { expand ? this.props.children : "" }
        </div>
      </div>;
    }
    else {
      return <div className={"prop-editor-base prop-editor-no-expandable " + (this.props.className ? this.props.className + " " : "") + (this.props.data.className ? this.props.data.className + " " : "") + ("prop_" + this.props.data.name + " ")}>
        <label
          className="prop-editor-name"
          title={this.props.data.description}
        >
          { this.props.data.name }
        </label>
        <div className="prop-editor-container">
          { this.props.children }
        </div>
      </div>;
    }
  }
}
