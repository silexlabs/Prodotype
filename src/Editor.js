import React from 'react';
import ReactDOM from 'react-dom';
import StringArrayEditor from './StringArrayEditor';
import ObjectArrayEditor from './ObjectArrayEditor';
import StringEditor from './StringEditor';
import MulitlineEditor from './MulitlineEditor';
import BooleanEditor from './BooleanEditor';
import NumberEditor from './NumberEditor';
import ActionEditor from './ActionEditor';
import EnumEditor from './EnumEditor';
import FileEditor from './FileEditor';
import ColorEditor from './ColorEditor';
import ComponentEditor from './ComponentEditor';

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
  static createPropEditors(itemData, componentNames, onBrowse, onChange, idx) {
    // add an id to be used in the template to link several elements together
    itemData.uid = `${Date.now()}_${Math.round(Math.random() * 99999)}`;
    // det which editor for this property
    const itemClass = Editor.getItemClass(itemData);
    // build the editor
    return React.createElement(itemClass, {
      key: idx++,
      data: itemData,
      componentNames: componentNames,
      onBrowse: onBrowse,
      onChange: onChange,
    });
  }
  render() {
    if(this.props.data && this.props.definition) {
      const editors = this.props.definition.props
        .map((def, idx) => {
          // clone the definition
          const itemData = JSON.parse(JSON.stringify(def));
          // compute the value
          if(typeof this.props.data[itemData.name] === 'undefined')
            itemData.value = itemData.default;
          else
            itemData.value = this.props.data[itemData.name];
          // create the editor
          return Editor.createPropEditors(itemData, this.props.componentNames, this.props.onBrowse, (value) => {
            this.props.data[itemData.name] = value;
            this.props.onChange(this.props.data);
          }, idx);
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
