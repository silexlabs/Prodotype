import React from 'react';
import ReactDOM from 'react-dom';
import Editor from './Editor';
import Renderer from './Renderer';

export default class Prodotype {

  constructor(element, rootPath = '') {
    this.componentsDef = []
    this.container = element;
    this.loadComponentsDef(rootPath);
    this.renderer = new Renderer(rootPath);
  }

  ////////////////////
  // ComponentsDef loading, ready mechanism
  ////////////////////
  isReady = false
  readyCbk = []
  errorLoadingComponents = null
  /**
   * public method to notify the caller that we are ready
   *
   */
  ready(cbk) {
    if(this.isReady) cbk(this.errorLoadingComponents);
    else this.readyCbk.push(cbk);
  }
  /**
   * Components data loaded
   * call the ready callbacks
   */
  onLoad(err) {
    this.isReady = true;
    this.readyCbk.forEach(cbk => cbk(err));
    this.readyCbk = [];
    this.errorLoadingComponents = err;
    this.edit();
  }
  /**
   * load the components data
   */
  loadComponentsDef(rootPath) {
    if(this.isReady) return;
    let oReq = new XMLHttpRequest();
    oReq.open("GET", rootPath + '/components.json');
    oReq.send();
    oReq.addEventListener("error", (e) => {
      this.onLoad(e);
    });
    oReq.addEventListener("load", () => {
      this.componentsDef = JSON.parse(oReq.responseText);
      this.onLoad();
    });
  }
  ///////////////////
  // edition of components
  ///////////////////
  /**
   * build the ui for a component
   * and notify me when user changes a property
   * @param {Object} data the component's data to edit
   * @param {Array.<{name:string, displayName:string, templateName:string}>} the list of all the component names
   * @param {string} temlateName the type of the component to edit
   * @param {onChange:function, ?onBrowse:function} events
   */
  edit(data, componentNames, templateName, events) {
    events = events || {};
    ReactDOM.render(<Editor
      componentNames = {componentNames}
      onBrowse = {events.onBrowse}
      data = {data}
      definition = {this.componentsDef[templateName]}
      onChange = {(value) => {
        this.edit(value, componentNames, templateName, events);
        this.decorate(templateName, value)
          .then(html => events.onChange(value, html));
      }}
    />, this.container);
  }


  /**
   * render the HTML for a component
   * with the given data merged with defaults
   */
  decorate(templateName, data) {
    return this.renderer.render(this.componentsDef[templateName], data, templateName);
  }


  /**
   * reset the ui
   */
  reset() {
    ReactDOM.render(<Editor />, this.container);
  }


  /**
   * create a unique meaningful name
   */
  createName(templateName, componentNames) {
    let idx = 0;
    while(componentNames.map(compData => compData.name).includes(templateName + (++idx))) {
    }
    return templateName + idx;
  }


  /**
   * get the dependencies for the list of components
   * @param {Array.<{name:string, displayName:string, templateName:string}>} the list of all the component names
   */
  getDependencies(componentNames) {
    return componentNames
      .reduce((prev, current) => {
        const dependencies = this.componentsDef[current.templateName].dependencies;
        for(let depType in dependencies) {
          prev[depType] = prev[depType] || [];
          prev[depType] = prev[depType].concat(dependencies[depType]);
        }
        return prev;
      }, {});
  }

  /**
   * find the missing dependencies for a given set of components
   * @param {Array.<Element>} the element containing the dependencies (scripts and style sheets)
   * @param {Array.<{name:string, displayName:string, templateName:string}>} the list of all the component names
   * @return {Array.<Element>} the elements to be added to the site
   */
  getMissingDependencies(container, componentNames) {
    let result = [];
    const dependencies = this.getDependencies(componentNames);
    for(let type in dependencies) {
      let depType = dependencies[type];
      for(let idxDep in depType) {
        let dep = depType[idxDep];
        let attributes = [];
        for(let attrName in dep) attributes.push(attrName + '="' + dep[attrName] + '"');
        let selector = type + '[' + attributes.join('][') + ']';
        let existing = container.querySelector(selector);
        if(!existing) {
          let el = document.createElement(type);
          for(let attrName in dep) el.setAttribute(attrName, dep[attrName]);
          result.push(el);
        }
      }
    }
    return result;
  }


  /**
   * find the missing dependencies for a given set of components
   * @param {Array.<Element>} depencies, i.e. scripts and style sheets
   * @param {Array.<{name:string, displayName:string, templateName:string}>} the list of all the component names
   */
  getUnusedDependencies(dependencyElements, componentNames) {
    const result = [];
    const dependencies = this.getDependencies(componentNames);
    // remove what is not needed
    for(let elIdx = 0; elIdx < dependencyElements.length; elIdx++) {
      const el = dependencyElements[elIdx];
      const tagName = el.tagName.toLowerCase();
      if(dependencies[tagName]) {
        let found = dependencies[tagName].find(function(dep) {
          for(let attrName in dep)
            if(el.getAttribute(attrName) !== dep[attrName])
              return false;
          return true;
        });
        if(!found) {
          result.push(el);
        }
      }
      else {
        result.push(el);
      }
    }
    return result;
  }
}

window.Prodotype = Prodotype;
