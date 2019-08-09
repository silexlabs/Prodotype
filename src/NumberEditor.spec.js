import React from 'react'
import ReactDOM from 'react-dom';
import NumberEditor from './NumberEditor.js'
import { act } from 'react-dom/test-utils'
import ReactTestUtils from 'react-dom/test-utils';

let container

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  document.body.removeChild(container)
  container = null
})

test('Display a value', () => {
  const data = {
    value: '50%',
    unit: ['', '%', 'px'],
  }
  act(() => {
    ReactDOM.render(
      <NumberEditor
        data={data}
      />, container)
  })
  const input = container.querySelector('.value')
  const select = container.querySelector('.unit-selector')
  expect(input).not.toBeNull()
  expect(select).not.toBeNull()
  expect(input.value).toBe('50')
  expect(select.value).toBe('%')
})

test('Display a value of zero', () => {
  const data = {
    value: '0',
    unit: ['', '%', 'px'],
  }
  act(() => {
    ReactDOM.render(
      <NumberEditor
        data={data}
      />, container)
  })
  const input = container.querySelector('.value')
  const select = container.querySelector('.unit-selector')
  expect(input).not.toBeNull()
  expect(select).not.toBeNull()
  expect(input.value).toBe('0')
  expect(select.value).toBe('')
})

test('Display a value without unit in it', () => {
  const data = {
    value: '10',
    unit: ['', '%', 'px'],
  }
  act(() => {
    ReactDOM.render(
      <NumberEditor
        data={data}
      />, container)
  })
  const input = container.querySelector('.value')
  const select = container.querySelector('.unit-selector')
  expect(input).not.toBeNull()
  expect(select).not.toBeNull()
  expect(input.value).toBe('10')
  expect(select.value).toBe('')
})

test('Display a value without unit defined', () => {
  const data = {
    value: '10',
  }
  act(() => {
    ReactDOM.render(
      <NumberEditor
        data={data}
      />, container)
  })
  const input = container.querySelector('.value')
  const select = container.querySelector('.unit-selector')
  expect(input).not.toBeNull()
  expect(select).toBeNull()
  expect(input.value).toBe('10')
})

test('Display an empty value without unit', () => {
  const data = {
    value: null,
    unit: ['', '%', 'px'],
  }
  act(() => {
    ReactDOM.render(
      <NumberEditor
        data={data}
      />, container)
  })
  const input = container.querySelector('.value')
  const select = container.querySelector('.unit-selector')
  expect(input).not.toBeNull()
  expect(select).not.toBeNull()
  expect(input.value).toBe('')
  expect(select.value).toBe('')
})

test('Display an empty value with default unit', () => {
  const data = {
    value: null,
    unit: ['%', 'px'],
  }
  act(() => {
    ReactDOM.render(
      <NumberEditor
        data={data}
      />, container)
  })
  const input = container.querySelector('.value')
  const select = container.querySelector('.unit-selector')
  expect(input).not.toBeNull()
  expect(select).not.toBeNull()
  expect(input.value).toBe('')
  expect(select.value).toBe('%')
})

test('Change the value', () => {
  const data = {
    value: '50%',
    unit: ['', '%', 'px'],
  }
  let component = null
  act(() => {
    component = ReactDOM.render(
      <NumberEditor
        data={data}
        onChange={jest.fn()}
      />, container)
  })
  expect(component).not.toBeNull()

  const input = container.querySelector('.value')
  const select = container.querySelector('.unit-selector')

  ReactTestUtils.Simulate.change(input, {target: {value: '100'}})
  expect(component.props.onChange).toHaveBeenCalledTimes(1)
  expect(component.props.onChange).toHaveBeenCalledWith('100%')

  ReactTestUtils.Simulate.change(select, {target: {value: 'px'}})
  expect(component.props.onChange).toHaveBeenCalledTimes(2)
  expect(component.props.onChange).toHaveBeenCalledWith('50px')
})

test('Change the value to empty value', () => {
  const data = {
    value: '50%',
    unit: ['', '%', 'px'],
  }
  let component = null
  act(() => {
    component = ReactDOM.render(
      <NumberEditor
        data={data}
        onChange={jest.fn()}
      />, container)
  })
  expect(component).not.toBeNull()

  const input = container.querySelector('.value')
  const select = container.querySelector('.unit-selector')

  ReactTestUtils.Simulate.change(input, {target: {value: ''}})
  expect(component.props.onChange).toHaveBeenCalledTimes(1)
  expect(component.props.onChange).toHaveBeenCalledWith('')

  ReactTestUtils.Simulate.change(select, {target: {value: ''}})
  expect(component.props.onChange).toHaveBeenCalledTimes(2)
  expect(component.props.onChange).toHaveBeenCalledWith('50')
})

test('Change the value to zero', () => {
  const data = {
    value: '50%',
    unit: ['', '%', 'px'],
  }
  let component = null
  act(() => {
    component = ReactDOM.render(
      <NumberEditor
        data={data}
        onChange={jest.fn()}
      />, container)
  })
  expect(component).not.toBeNull()

  const input = container.querySelector('.value')

  ReactTestUtils.Simulate.change(input, {target: {value: '0'}})
  expect(component.props.onChange).toHaveBeenCalledTimes(1)
  expect(component.props.onChange).toHaveBeenCalledWith('0')
})

test('Change the value when there are no units', () => {
  const data = {
    value: '50',
  }
  let component = null
  act(() => {
    component = ReactDOM.render(
      <NumberEditor
        data={data}
        onChange={jest.fn()}
      />, container)
  })
  expect(component).not.toBeNull()

  const input = container.querySelector('.value')

  ReactTestUtils.Simulate.change(input, {target: {value: '10'}})
  expect(component.props.onChange).toHaveBeenCalledTimes(1)
  expect(component.props.onChange).toHaveBeenCalledWith('10')
})
