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
    var oReq = new XMLHttpRequest();
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
   */
  getDependencies(componentNames) {
    return componentNames
      .reduce((prev, current) => {
        var dependencies = this.componentsDef[current.templateName].dependencies;
        for(var depType in dependencies) {
          prev[depType] = prev[depType] || [];
          prev[depType] = prev[depType].concat(dependencies[depType]);
        }
        return prev;
      }, {});
  }

  /**
   *
   */
  updateDependencies(container, componentNames) {
    var dependencies = this.getDependencies(componentNames);
    // remove what is not needed
    for(var elIdx = 0; elIdx < container.childNodes.length; elIdx++) {
      var el = container.childNodes[elIdx];
      if(el.nodeType === Node.ELEMENT_NODE) {
        var tagName = el.tagName.toLowerCase();
        if(dependencies[tagName]) {
          var found = dependencies[tagName].find(function(dep) {
            for(var attrName in dep)
              if(el.getAttribute(attrName) === dep[attrName])
                return true;
            return false;
          });
          if(!found) {
            console.log('remove 1', el);
            container.removeChild(el);
          }
        }
        else {
          console.log('remove 2', el);
          container.removeChild(el);
        }
      }
    }
    // add what is missing
    for(var type in dependencies) {
      var depType = dependencies[type];
      for(var idxDep in depType) {
        var dep = depType[idxDep];
        var attributes = [];
        for(var attrName in dep) attributes.push(attrName + '="' + dep[attrName] + '"');
        var selector = type + '[' + attributes.join('][') + ']';
        var existing = container.querySelector(selector);
        if(!existing) {
          var el = document.createElement(type);
          for(var attrName in dep) el.setAttribute(attrName, dep[attrName]);
          container.appendChild(el);
          console.log('add', el);
        }
      }
    }
  }


}

window.Prodotype = Prodotype;
