import React from 'react';
import PropEditorBase from './PropEditorBase';
import * as objectPath from 'object-path';

export default class extends React.Component {
  render() {
    const dataSource = this.props.dataSources[this.props.data.dataSourceName];
    const root = dataSource ? objectPath.get(dataSource, this.props.data.dataRoot) : null;
    const options = root ? Object.keys(root).map(key => {
      return <option
        key = { key }
        value = {  key  }
        >{  root[key].displayName || key }</option>
      return null;
    }) : [];
    return <PropEditorBase data = { this.props.data } >
        <select
          onChange={(e) => this.props.onChange(e.target.value)}
          value = { this.props.data.value }
        >
          <option key="none" />
          { options }
        </select>
    </PropEditorBase>;
  }
}
