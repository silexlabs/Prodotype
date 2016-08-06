import React from 'react';
import ReactDOM from 'react-dom';
import Editor from './Editor';

export default class Prodotype {
  rootPath = ''
  componentsData = []
  container = null

  constructor(element, rootPath = '') {
    console.log('Prodotype starting', rootPath);
    this.container = element;
    this.rootPath = rootPath;
    this.loadComponentsData();
  }

  ////////////////////
  // ComponentsData loading, ready mechanism
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
  loadComponentsData() {
    if(this.isReady) return;
    var oReq = new XMLHttpRequest();
    oReq.open("GET", this.rootPath + '/components.json');
    oReq.send();
    oReq.addEventListener("error", (e) => {
      this.onLoad(e);
    });
    oReq.addEventListener("load", () => {
      this.componentsData = JSON.parse(oReq.responseText);
      console.log('loaded', this.componentsData);
      this.onLoad();
    });
  }
  ///////////////////
  // edition of components
  ///////////////////
  edit(data, templateName, onChange) {
    console.log('edit', data, templateName);
    ReactDOM.render(<Editor
      data={data}
      componentsData={this.componentsData}
      templateName={templateName}
      onChange={onChange}
    />, this.container);
  }
}

window.Prodotype = Prodotype;
