import React from 'react';
import PropEditorBase from './PropEditorBase'

export default class NumberEditor extends React.Component {
  getUnit(val, units) {
    if(Array.isArray(units)) {
      return units.reduce((prev, unit) => val.toString().endsWith(unit) ? unit : prev, units[0]);
    }
    return '';
  }
  getUnitSelector(units, currentValue, currentUnit) {
    if(Array.isArray(units)) {
      let idx = 0;
      return <select
        className="unit-selector"
        onChange={(e) => this.props.onChange(isNaN(currentValue) ? '' : currentValue + e.target.value)}
        value = { currentUnit }
        >
        {
          units.map(unit => <option
            value = { unit }
            key = { idx++ }
          >{ unit }</option>)
        }
      </select>
    }
    return null;
  }
  render() {
    const units = this.props.data.unit;
    const value = this.props.data.value || '';
    const currentValue = parseFloat(value);
    const currentUnit = this.getUnit(value, units);
    const unitSelector = this.getUnitSelector(units, currentValue, currentUnit);
    return <PropEditorBase className="number-editor" onChange={this.props.onChange} data={this.props.data}>
      <input
        className="value"
        type="number"
        value={ currentValue }
        onChange={(e) => this.props.onChange(e.target.value === '' ? '' : e.target.value + currentUnit)}
      />
      { unitSelector }
    </PropEditorBase>;
  }
}
