import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import List from 'material-ui/List';
import AppBar from 'material-ui/AppBar';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import ArrayEditor from './ArrayEditor';
import StringEditor from './StringEditor';
import MulitlineEditor from './MulitlineEditor';
import BooleanEditor from './BooleanEditor';
import NumberEditor from './NumberEditor';

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
            case 'multiline':
              itemClass = MulitlineEditor;
              break;
            case 'boolean':
              itemClass = BooleanEditor;
              break;
            case 'number':
              itemClass = NumberEditor;
              break;
            default:
              console.error('Unknown property type:', itemData.type, itemData);
              return null;
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
          <AppBar
            title="Prodotype editor"
          />
          <Card>
            <CardHeader
              title={ this.props.definition.name }
              subtitle={ this.props.definition.description }
            />
            <List>{editors}</List>
          </Card>
        </section>
      </MuiThemeProvider>;
    }
    // nothing selected
    return <MuiThemeProvider>
      <section>
        <AppBar
          title="Prodotype editor"
        />
        <Card>
          <CardHeader
            title="Please select a component"
          />
        </Card>
      </section>
    </MuiThemeProvider>;
  }
}
