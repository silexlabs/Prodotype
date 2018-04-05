import React from 'react';
import ReactDOM from 'react-dom';
import StringArrayEditor from './StringArrayEditor';
import ObjectArrayEditor from './ObjectArrayEditor';
import ObjectEditor from './ObjectEditor';
import StringEditor from './StringEditor';
import MulitlineEditor from './MulitlineEditor';
import BooleanEditor from './BooleanEditor';
import NumberEditor from './NumberEditor';
import ActionEditor from './ActionEditor';
import EnumEditor from './EnumEditor';
import ToggleEditor from './ToggleEditor';
import FileEditor from './FileEditor';
import ColorEditor from './ColorEditor';
import ComponentEditor from './ComponentEditor';

const templates = {};

export default class Editor extends React.Component {
  static getItemClass(itemData) {
    let itemClass = null;
    if(itemData.type instanceof Array && typeof itemData.type[0] === 'string') {
      itemClass = EnumEditor;
    }
    else if(itemData.type instanceof Array) {
      itemClass = ObjectArrayEditor;
    }
    else {
      switch(itemData.type) {
        case 'array':
          itemClass = StringArrayEditor;
          break;
        case 'toggle':
          itemClass = ToggleEditor;
          break;
        case 'object':
          itemClass = ObjectEditor;
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
        case 'component':
          itemClass = ComponentEditor;
          break;
        default:
          console.error('Unknown property type:', itemData.type, itemData);
          return null;
      }
    }
    return itemClass;
  }
  /**
   * @param {data, componentNames, onBrowse, onChange, idx, ...props} options
   */
  static createPropEditors(options) {
    if(templates[options.data.type]) {
      const name = options.data.name;
      Object.assign(options.data, templates[options.data.type], {
        name: name,
        type: 'object',
      });
    }
    // add an id to be used in the template to link several elements together
    options.data.uid = `${Date.now()}_${Math.round(Math.random() * 99999)}`;
    options.key = options.idx++;
    // det which editor for this property
    const itemClass = Editor.getItemClass(options.data);
    // build the editor
    return React.createElement(itemClass, options);
  }
  static getSubEditors(parentProps, props, value) {
    return props.map((prop, idx) => {
      // clone the definition
      const itemData = JSON.parse(JSON.stringify(prop));
      // compute the value
      if(typeof value[itemData.name] === 'undefined') {
        itemData.value = itemData.default;
      }
      else {
        itemData.value = value[itemData.name];
      }
      // create the editor
      return Editor.createPropEditors({
        data: itemData,
        componentNames: parentProps.componentNames,
        onBrowse: parentProps.onBrowse,
        onChange: (value) => {
          value[itemData.name] = value;
          parentProps.onChange(value);
        },
        idx: idx,
      });
    });
  }
  render() {
    if(this.props.data && this.props.definition) {
      const editors = this.props.definition.props
        .map((def, idx) => {
          // clone the definition
          const itemData = JSON.parse(JSON.stringify(def));
          if(itemData.type === 'template') {
            templates[itemData.name] = itemData;
            return null;
          }
          else {
            // compute the value
            if(typeof this.props.data[itemData.name] === 'undefined')
              itemData.value = itemData.default;
            else
              itemData.value = this.props.data[itemData.name];
            // create the editor
            return Editor.createPropEditors({
              data: itemData,
              componentNames: this.props.componentNames,
              onBrowse: this.props.onBrowse,
              onChange: (value) => {
                this.props.data[itemData.name] = value;
                this.props.onChange(this.props.data);
              },
              idx: idx,
            });
          }
        });
      return <section className="editor">
        <h1 className="name">{ this.props.definition.name }</h1>
        <div>{ <span className="description-container">
          <p className="description">{ this.props.definition.description }</p>
          <button className="help" onClick={ () => window.open(this.props.definition.doc,'_blank') }>?</button>
        </span> }
        </div>
        <ul>{ editors }</ul>
      </section>;
    }
    // nothing selected
    return <section></section>;
  }
}
