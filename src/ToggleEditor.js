import React from 'react';
import PropEditorBase from './PropEditorBase'

export default class ToggleEditor extends React.Component {
  render() {
    let idx = 0;
    return <PropEditorBase data = { this.props.data } >
        <div
          onClick={(e) => {
            const newValue = e.target.getAttribute('data-value');
            if(newValue === this.props.data.value && !this.props.data.default) {
              // untoggle current button, no more value
              this.props.onChange();
            }
            else {
              // activate the current button
              this.props.onChange(newValue);
            }
          }}
          id = {  "InputValue" + (PropEditorBase.idx++) }
          >
          { 
            this.props.data
            .options.map(({value, description, imageUrl}) => <button
              key = { idx++ }
              data-value = { value }
              data-selected = { this.props.data.value === value }
              title = { description }
              style = {{ backgroundImage: `url(${ imageUrl })` }}
              className = "toggle-button"
            ></button>) 
          }
        </div>
    </PropEditorBase>;
  }
}
