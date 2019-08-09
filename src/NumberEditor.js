import React from 'react';
import "@babel/polyfill"; import PropEditorBase from './PropEditorBase';

export default class NumberEditor extends React.Component {
  getUnit(val, units) {
    if(Array.isArray(units)) {
      const res = units.reduce((prev, unit) => val !== '' && val.toString().endsWith(unit) ? unit : prev, null);
      if(res === null && units.includes('')) return '';
      else return res;
    }
    return '';
  }
  getUnitSelector(units, currentValue, currentUnit) {
    if(Array.isArray(units)) {
      const optional = {};
      if(!isNaN(currentValue) && currentUnit !== null) {
        optional.value = currentUnit;
      }
      return <select
        ref={r => this.select = r}
        className="unit-selector"
        onChange={(e) => this.props.onChange(isNaN(currentValue) || currentValue === '0' ? '' : currentValue + e.target.value)}
        { ...optional }
        >
        {
          units.map((unit) => <option
            value = { unit }
            key = { unit || 'none' }
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
        placeholder={ this.props.data.placeholder }
        value={ isNaN(currentValue) ? '' : currentValue }
        onChange={(e) => this.props.onChange(e.target.value === '' || e.target.value === '0' ? e.target.value : e.target.value + this.select.value)}
      />
      { unitSelector }
    </PropEditorBase>;
  }
}
