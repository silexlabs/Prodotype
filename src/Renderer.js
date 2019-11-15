

export default class Renderer {
  constructor() {
    this.templates = {};
  }
  render(def, data, dataSources, templateName) {
    return new Promise((resolve, reject) => {
      let dataWithDefaults = loadDefaults(def.props, data);
      if(this.templates[templateName]) {
        this.doRender(dataWithDefaults, dataSources, this.templates[templateName], resolve, reject);
      }
      else {
        var oReq = new XMLHttpRequest();
        oReq.open("GET", `${ def.rootPath }/${ templateName }.ejs`);
        oReq.send();
        oReq.addEventListener("error", (e) => {
          reject(e);
        });
        oReq.addEventListener("load", () => {
          this.templates[templateName] = oReq.responseText;
          this.doRender(dataWithDefaults, dataSources, this.templates[templateName], resolve, reject);
        });
      }
    });
  }
  doRender(data, dataSources, template, resolve, reject) {
    // uid
    if(!data.uid) data.uid = Date.now() + '_' + Math.round(Math.random() * 1000);
    try {
      resolve(ejs.render(template, {
        ...data,
        dataSources,
      }));
    }
    catch(e) {
      console.error('could not render the template', e, data, template);
      reject(e);
    }
  }
}

function loadDefaults(props, data) {
  return props.reduce((prev, cur) => {
    if(typeof data[cur.name] === 'undefined')
      prev[cur.name] = cur.default;
    else if(Array.isArray(data[cur.name]) && Array.isArray(cur.type))
      prev[cur.name] = data[cur.name].map((d) => {
        return loadDefaults(cur.type, d);
      });
    else
      prev[cur.name] = data[cur.name];
    return prev;
  }, {});
}
