import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ArrayEditor from './ArrayEditor';
import StringEditor from './StringEditor';

export default class Editor extends React.Component {
  render() {
    if(this.props.data && this.props.definition) {
      let editors = this.props.definition.props
        .map((def, idx) => {
          let itemData = JSON.parse(JSON.stringify(def));
          itemData.value = this.props.data[itemData.name] || itemData.default;
          let itemClass = null;
          switch(itemData.type) {
            case 'array':
              itemClass = ArrayEditor;
              break;
            case 'string':
              itemClass = StringEditor;
              break;
          }
          return React.createElement(itemClass, {
            key: idx++,
            data: itemData,
            onChange: (value) => {
              this.props.data[itemData.name] = value;
              this.props.onChange(this.props.data);
            }
          });
        });
      return <MuiThemeProvider>
        <section>
          <h1>Editing ({this.props.definition.name})</h1>
          <div>{editors}</div>
        </section>
      </MuiThemeProvider>;

    }
    // nothing selected
    return <MuiThemeProvider>
      <section>Please select a component</section>
    </MuiThemeProvider>;
  }
}
