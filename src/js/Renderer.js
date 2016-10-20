

export default class Renderer {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.templates = {};
  }
  render(def, data, templateName) {
    return new Promise((resolve, reject) => {
      let dataWithDefaults = def.props.reduce((prev, cur) => {
        if(typeof data[cur.name] === 'undefined')
          prev[cur.name] = cur.default;
        else
          prev[cur.name] = data[cur.name];
        return prev;
      }, {});
      if(this.templates[templateName]) {
        this.doRender(dataWithDefaults, this.templates[templateName], resolve, reject);
      }
      else {
        var oReq = new XMLHttpRequest();
        oReq.open("GET", `${ this.rootPath }/${ templateName }.ejs`);
        oReq.send();
        oReq.addEventListener("error", (e) => {
          reject(e);
        });
        oReq.addEventListener("load", () => {
          this.templates[templateName] = oReq.responseText;
          this.doRender(dataWithDefaults, this.templates[templateName], resolve, reject);
        });
      }
    });
  }
  doRender(data, template, resolve, reject) {
    // uid
    if(!data.uid) data.uid = Date.now() + '-' + Math.round(Math.random() * 1000);
    try {
      console.log('render', data);
      resolve(ejs.render(template, data));
    }
    catch(e) {
      console.error('could not render the template', e, data, template);
      reject(e);
    }
  }
}
