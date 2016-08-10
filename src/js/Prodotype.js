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
   */
  edit(data, templateName, onChange) {
    ReactDOM.render(<Editor
      data={data}
      definition={this.componentsDef[templateName]}
      onChange={(value) => {
        this.edit(value, templateName, onChange);
        this.decorate(templateName, value)
          .then(html => onChange(value, html));
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
}

window.Prodotype = Prodotype;
