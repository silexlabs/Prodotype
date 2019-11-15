import "@babel/polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import Editor from './Editor';
import Renderer from './Renderer';

export default class Prodotype {

  constructor(element, rootPath = '') {
    this.componentsDef = null;
    this.container = element;
    if(typeof rootPath === 'string') {
      this.loadComponentsDef(rootPath)
      .then((componentsDef) => this.onLoad(componentsDef))
      .catch(err => this.onLoad(null, err));
    } else {
      Promise.all(
        rootPath.map(path => this.loadComponentsDef(path))
      )
      .then((componentsDefArr) => this.onLoad(componentsDefArr.reduce((aggr, next) => ({
        ...aggr,
        ...next,
      }))))
      .catch(err => this.onLoad(null, err));
    }
    this.renderer = new Renderer();
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
  onLoad(componentsDef, err) {
    this.componentsDef = componentsDef;
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
    return new Promise((resolve, reject) => {
      if(this.isReady) return;
      let oReq = new XMLHttpRequest();
      oReq.open("GET", rootPath + '/components.json');
      oReq.send();
      oReq.addEventListener("error", (e) => {
        reject(e);
      });
      oReq.addEventListener("load", () => {
        if(oReq.status === 200) {
          try {
            const componentsDef = JSON.parse(oReq.responseText);
            Object.keys(componentsDef)
              .map(name => {
                componentsDef[name].rootPath = rootPath;
              });
            resolve(componentsDef);
          } catch(e) {
            console.error('Could not parse component data from', rootPath, oReq.statusText, oReq.status);
            reject(new Error(`Could not parse component data from ${rootPath}. Error: ${oReq.statusText}(${oReq.status})`));
          }
        } else {
          console.error('Could not load components from', rootPath, oReq.statusText, oReq.status);
          reject(new Error(`Could not load components from ${rootPath}. Error: ${oReq.statusText}(${oReq.status})`));
        }
      });
    });
  }
  ///////////////////
  // edition of components
  ///////////////////
  /**
   * build the ui for a component
   * and notify me when user changes a property
   * @param {Object} data the component's data to edit
   * @param {Object} the data sources
   * @param {string} temlateName the type of the component to edit
   * @param {onChange:function, ?onBrowse:function, ?onEditLink} events
   */
  edit(data, dataSources, templateName, events) {
    events = events || {};
    ReactDOM.render(<Editor
      dataSources= {dataSources}
      onBrowse = {events.onBrowse}
      onEditLink = {events.onEditLink}
      data = {data}
      definition = {this.componentsDef[templateName]}
      onChange = {(value) => {
        this.edit(value, dataSources, templateName, events);
        this.decorate(templateName, value, dataSources)
          .then(html => events.onChange(value, html));
      }}
    />, this.container);
  }


  /**
   * render the HTML for a component
   * with the given data merged with defaults
   */
  decorate(templateName, data, dataSources) {
    return this.renderer.render(this.componentsDef[templateName], data, dataSources, templateName);
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
  createName(templateName, components) {
    let idx = 0;
    while(components.map(compData => compData.name).includes(templateName + (++idx))) {
    }
    return templateName + idx;
  }


  /**
   * get the dependencies for the list of components
   * @param {Array.<{name:string, displayName:string, templateName:string}>} the list of all the component names
   */
  getDependencies(components) {
    return components 
      .reduce((prev, current) => {
        const componentDefObj = this.componentsDef[current.templateName];
        if(!componentDefObj) {
          const msg = `Prodotype error: component ${ current.templateName } not found.`;
          console.error(msg, this.componentsDef, current.templateName);
          throw new Error(msg);
        }
        const dependencies = componentDefObj.dependencies;
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
  getMissingDependencies(container, components) {
    let result = [];
    const dependencies = this.getDependencies(components);
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
  getUnusedDependencies(dependencyElements, components) {
    const result = [];
    const dependencies = this.getDependencies(components);
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
