import "@babel/polyfill";
import React from 'react';
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
import LinkEditor from './LinkEditor';

let INDEX = 0;
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
        case 'link':
          itemClass = LinkEditor;
          break;
        default:
          throw new Error('Unknown property type: ' + itemData.type);
      }
    }
    return itemClass;
  }
  static getTemplateData({templates, data}) {
    if(!!templates && templates[data.type] || (data.type === 'template' && !!data.extends && templates[data.extends])) {
      const agregatedTemplate = Editor.getTemplateData({templates, data: templates[data.extends || data.type]});
      return {
        ...data,
        type: 'object',
        props: [
          ...agregatedTemplate.props,
          ...(data.props || []),
        ],
      }
    }
    return data;
  }
  /**
   * @param {data, componentNames, onBrowse, onEditLink, onChange, idx, ...props} options
   */
  static createPropEditors(options) {
    const data = Editor.getTemplateData(options);
    // add an id to be used in the template to link several elements together
    data.uid = `${Date.now()}_${Math.round(Math.random() * 99999)}`;
    data.key = options.idx++;
    // det which editor for this property
    const itemClass = Editor.getItemClass(data);
    // build the editor
    return React.createElement(itemClass, {
      ...options,
      data: {
        ...options.data,
        ...data,
      },
    });
  }
  /**
   * @param parentProps, the props of the containing component
   * @param props, the definition of the sub components, i.e. an array of objects which have name, type...
   * @param value, the object containing the actual data of each sub component, i.e. an map of objects with a the prop name as a key and the prop value as a value
   * @param parentValue, optional object to pass to the component's onChange callback, which will contain the value param - defaults to the value param
   */
  static getSubEditors(parentProps, props, value, parentValue) {
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
        onEditLink: parentProps.onEditLink,
        onChange: (newVal) => {
          value[itemData.name] = newVal;
          parentProps.onChange(parentValue || value);
        },
        idx: idx,
      });
    });
  }
  parseDefinition({definition, data}) {
    // TODO: use reduce instead of this strange algo
    const templates = {};
    const editorsData = definition.props
    .map((def, idx) => {
      // clone the definition
      const itemData = JSON.parse(JSON.stringify(def));
      if(itemData.type === 'template') {
        templates[itemData.name] = itemData;
        return null;
      }
      else {
        // compute the value
        if(typeof data[itemData.name] === 'undefined')
          itemData.value = itemData.default;
        else
          itemData.value = data[itemData.name];
        itemData.idx = INDEX++;
        // create the editor
        return itemData;
      }
    })
    .filter(e => !!e);
    return {
      templates,
      editorsData,
    }
  }
  // fixme: this method is bullshit
  createEditors({ templates, editorsData }) {
    return editorsData.map(data => {
      return Editor.createPropEditors({
        templates,
        data,
        componentNames: this.props.componentNames,
        onBrowse: this.props.onBrowse,
        onEditLink: this.props.onEditLink,
        onChange: (value) => {
          this.props.data[data.name] = value;
          this.props.onChange(this.props.data);
        },
        idx: editorsData.idx,
      })
    });
  }
  render() {
    if(this.props.data && this.props.definition) {
      const { templates, editorsData } = this.parseDefinition(this.props);
      const editors = this.createEditors({ templates, editorsData });
      return <section className="editor">
        <h1 className="name">{ this.props.definition.name }</h1>
        { this.props.definition.doc ?
          <button className="help" onClick={ () => window.open(this.props.definition.doc, '_blank') }>?</button>
          : ''
        }
        <div>{ <span className="description-container">
          <p className="description">{ this.props.definition.description }</p>
        </span> }
        </div>
        <ul>{ editors }</ul>
      </section>;
    }
    // nothing selected
    return <section></section>;
  }
}
