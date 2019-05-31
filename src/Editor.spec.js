import React from 'react';
import renderer from 'react-test-renderer';
import Editor from './Editor.js';
import StringArrayEditor from './StringArrayEditor.js';
import ToggleEditor from './ToggleEditor.js';
import ObjectEditor from './ObjectEditor.js';
import MulitlineEditor from './MulitlineEditor.js';
import StringEditor from './StringEditor.js';
import BooleanEditor from './BooleanEditor.js';
import NumberEditor from './NumberEditor.js';
import ActionEditor from './ActionEditor.js';
import FileEditor from './FileEditor.js';
import ColorEditor from './ColorEditor.js';
import ComponentEditor from './ComponentEditor.js';
import LinkEditor from './LinkEditor.js';
import EnumEditor from './EnumEditor.js';
import ObjectArrayEditor from './ObjectArrayEditor.js';

test('Init empty component', () => {
  const component = renderer.create(
    <Editor />
  );
  const tree = component.toJSON();
  expect(tree).not.toBeNull();
});

test('Get simple types', () => {
  const testGetItemClass = (type, EditorClass) => {
    const itemClass = Editor.getItemClass({
      type,
    });
    expect(itemClass).not.toBeNull();
    expect(itemClass).toBe(EditorClass);
  }
  testGetItemClass('array', StringArrayEditor);
  testGetItemClass('toggle', ToggleEditor);
  testGetItemClass('object', ObjectEditor);
  testGetItemClass('string', StringEditor);
  testGetItemClass('multiline', MulitlineEditor);
  testGetItemClass('boolean', BooleanEditor);
  testGetItemClass('number', NumberEditor);
  testGetItemClass('action', ActionEditor);
  testGetItemClass('file', FileEditor);
  testGetItemClass('color', ColorEditor);
  testGetItemClass('component', ComponentEditor);
  testGetItemClass('link', LinkEditor);
});

test('Get complex types', () => {
  const itemClassEnum = Editor.getItemClass({
    type: ['enum1', 'enum2', 'enum3'],
  });
  expect(itemClassEnum).not.toBeNull();
  expect(itemClassEnum).toBe(EnumEditor);

  const itemClassArray = Editor.getItemClass({
    type: [{type: 'number'}, {type: 'number'}, {type: 'number'}],
  });
  expect(itemClassArray).not.toBeNull();
  expect(itemClassArray).toBe(ObjectArrayEditor);

  expect(() => Editor.getItemClass({
    type: 'unknown',
  })).toThrow();
});

test('createPropEditors for basic types', () => {
  const testCreatePropEditors = (type) => {
    const testNumber = Editor.createPropEditors({
      templates: {},
      data: {
        type,
      },
    });
    expect(testNumber).not.toBeNull();
    expect(testNumber.props.data.uid).not.toBeNull();
  };
  testCreatePropEditors('array', StringArrayEditor);
  testCreatePropEditors('toggle', ToggleEditor);
  testCreatePropEditors('object', ObjectEditor);
  testCreatePropEditors('string', StringEditor);
  testCreatePropEditors('multiline', MulitlineEditor);
  testCreatePropEditors('boolean', BooleanEditor);
  testCreatePropEditors('number', NumberEditor);
  testCreatePropEditors('action', ActionEditor);
  testCreatePropEditors('file', FileEditor);
  testCreatePropEditors('color', ColorEditor);
  testCreatePropEditors('component', ComponentEditor);
  testCreatePropEditors('link', LinkEditor);
  testCreatePropEditors(['enum1', 'enum2', 'enum3'], EnumEditor);
  testCreatePropEditors([{type: 'number'}, {type: 'number'}, {type: 'number'}], ObjectArrayEditor);
});

// test('Create with templates', () => {
//   const testTemplate = Editor.createPropEditors({
//     templates: {
//       'TestTemplate': {
//         props: [
//           {type: 'number', name: 'propTemplate'},
//         ],
//       },
//     },
//     data: {
//       type: 'TestTemplate',
//       name: 'propMixed',
//       props: [
//         {type: 'string', name: 'propComp'},
//       ],
//     },
//   });
//   expect(testTemplate).not.toBeNull();
//   expect(testTemplate.props.data.uid).not.toBeNull();
//   expect(testTemplate.props.data.type).toBe('object');
//   expect(testTemplate.props.data.name).toBe('propMixed');
//   expect(testTemplate.props.data.props[0]).not.toBeNull();
//   expect(testTemplate.props.data.props[0].name).toBe('propComp');
//   expect(testTemplate.props.data.props[1]).not.toBeNull();
//   expect(testTemplate.props.data.props[1].name).toBe('propTemplate');
// })

test('Create templates of templates', () => {
  const testTemplate = Editor.createPropEditors({
    templates: {
      'TestTemplate1': {
        type: 'template',
        extends: 'TestTemplate2',
        props: [
          {type: 'number', name: 'propTemplate1'},
        ],
      },
      'TestTemplate2': {
        type: 'template',
        props: [
          {type: 'number', name: 'propTemplate2'},
        ],
      },
    },
    data: {
      type: 'TestTemplate1',
      name: 'propMixed',
      props: [
        {type: 'string', name: 'propComp'},
      ],
    },
  });
  expect(testTemplate).not.toBeNull();
  expect(testTemplate.props.data.uid).not.toBeNull();
  expect(testTemplate.props.data.type).toBe('object');
  expect(testTemplate.props.data.name).toBe('propMixed');
  expect(testTemplate.props.data.props.length).toBe(3);
  expect(testTemplate.props.data.props[2]).not.toBeNull();
  expect(testTemplate.props.data.props[2].name).toBe('propComp');
  expect(testTemplate.props.data.props[2].type).toBe('string');
  expect(testTemplate.props.data.props[1]).not.toBeNull();
  expect(testTemplate.props.data.props[1].name).toBe('propTemplate1');
  expect(testTemplate.props.data.props[1].type).toBe('number');
  expect(testTemplate.props.data.props[0]).not.toBeNull();
  expect(testTemplate.props.data.props[0].name).toBe('propTemplate2');
  expect(testTemplate.props.data.props[0].type).toBe('number');
})
