import React from 'react';
import PropEditorBase from './PropEditorBase'

export default class StringArrayEditor extends React.Component {
  render() {
    return <PropEditorBase onChange={this.props.onChange} data={this.props.data}>
      <textarea
        id={ "InputValue" + (PropEditorBase.idx++) }
        value={ this.props.data.value.join('\n') }
        onChange={(e) => this.props.onChange(e.target.value.split('\n').map(row => {
          try { return JSON.parse(row); } catch(e) { return row; };
        }))}
        rows={5}
      />
    </PropEditorBase>;
  }
}
