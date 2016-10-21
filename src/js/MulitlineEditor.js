import React from 'react';
import PropEditorBase from './PropEditorBase'

export default class MultilineEditor extends React.Component {
  render() {
    return <PropEditorBase onChange={this.props.onChange} data={this.props.data}>
      <textarea
        value={ this.props.data.value || '' }
        onChange={(e) => this.props.onChange(e.target.value)}
        rows={5}
      />
    </PropEditorBase>;
  }
}
