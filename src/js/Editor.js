import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import List from 'material-ui/List';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import ActionInfo from 'material-ui/svg-icons/action/info';
import ArrayEditor from './ArrayEditor';
import StringEditor from './StringEditor';
import MulitlineEditor from './MulitlineEditor';
import BooleanEditor from './BooleanEditor';
import NumberEditor from './NumberEditor';
import ActionEditor from './ActionEditor';
import EnumEditor from './EnumEditor';
import FileEditor from './FileEditor';
import ColorEditor from './ColorEditor';

export default class Editor extends React.Component {
  render() {
    if(this.props.data && this.props.definition) {
      let editors = this.props.definition.props
        .map((def, idx) => {
          let itemData = JSON.parse(JSON.stringify(def));
          // compute the value
          itemData.value = this.props.data[itemData.name] || itemData.default;
          // add an id to be used in the template to link several elements together
          itemData.uid = `${Date.now()}-${Math.round(Math.random() * 99999)}`;
          // det which editor for this property
          let itemClass = null;
          if(itemData.type instanceof Array) {
            itemClass = EnumEditor;
          }
          else {
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
              case 'action':
                itemClass = ActionEditor;
                break;
              case 'file':
                itemClass = FileEditor;
                break;
              case 'color':
                itemClass = ColorEditor;
                break;
              default:
                console.error('Unknown property type:', itemData.type, itemData);
                return null;
            }
          }
          return React.createElement(itemClass, {
            key: idx++,
            data: itemData,
            onBrowse: this.props.onBrowse,
            onChange: (value) => {
              this.props.data[itemData.name] = value;
              this.props.onChange(this.props.data);
            }
          });
        });
      return <MuiThemeProvider>
        <section>
          <Card>
            <CardHeader
              title={ this.props.definition.name }
              subtitle={ <span>
                <p>{ this.props.definition.description }</p>
                <ActionInfo onClick={ () => window.open(this.props.definition.doc,'_blank') } />
                </span> }
            />
            <List>{editors}</List>
          </Card>
        </section>
      </MuiThemeProvider>;
    }
    // nothing selected
    return <MuiThemeProvider>
      <section>
        <Card>
          <CardHeader
            title='Select a component'
          />
        </Card>
      </section>
    </MuiThemeProvider>;
  }
}
