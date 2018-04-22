import React from 'react';
import Editor from './Editor'
import PropEditorBase from './PropEditorBase'

export default class ObjectArrayEditor extends React.Component {
  render() {
    this.props.data.value = this.props.data.value || [];
    if(!this.props.data.value.map) {
      console.error('ObjectArrayEditor: the property needs to be an array but it is not (', typeof this.props.data.value, ')');
      return null;
    }
    const editors = this.props.data.value.map((subData, idx) => {
      const subEditors = Editor.getSubEditors(this.props, this.props.data.type, subData, this.props.data.value);
      return <div
        className="sub-editors-container"
        key={idx}
        >
          <div className="sub-editors">
            {subEditors}
          </div>
          <span
            className="btn remove-btn fa fa-trash-o"
            onClick={e => {
              this.props.data.value.splice(idx, 1);
              this.props.onChange(this.props.data.value);
            }}
          ></span>
          <span
            className="btn up-btn fa fa-angle-up"
            onClick={e => {
              this.props.data.value.splice(Math.max(0, idx - 1), 0, this.props.data.value.splice(idx, 1)[0]);
              this.props.onChange(this.props.data.value);
            }}
          ></span>
          <span
            className="btn up-btn fa fa-angle-down"
            onClick={e => {
              this.props.data.value.splice(Math.min(this.props.data.value.length, idx + 1), 0, this.props.data.value.splice(idx, 1)[0]);
              this.props.onChange(this.props.data.value);
            }}
          ></span>
        </div>;
    });
    return <PropEditorBase data={this.props.data}>
      { editors }
      <div
        className="btn add-btn fa fa-2x fa-plus-square-o"
        onClick={e => this.props.onChange(this.props.data.value.concat([{}]))}
      ></div>
    </PropEditorBase>;
  }
}
