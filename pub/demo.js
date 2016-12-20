var stage = document.getElementById('stage');
var componentSelect = document.getElementById('components');
var dependenciesElement = document.getElementById('dependencies');
var currentComponent = null;
function add(compName) {
  if(currentComponent) {
    stage.removeChild(currentComponent);
  }
  var compName = compName || componentSelect.value;
  var element = document.createElement('div');
  var name = prodotype.createName(compName, getCompList());
  prodotype.decorate(compName, {
    name: name
  })
    .then(html => element.innerHTML = html);
  element.setAttribute('data-template-name', compName);
  element.setAttribute('data-name', name);
  select(element);
  stage.appendChild(element);
  currentComponent = element;
  updateDependencies();
}
function updateDependencies() {
  // removed unused dependencies (scripts and style sheets)
  var unused = prodotype.getUnusedDependencies(document.head.querySelectorAll('[data-dependency]'), getCompList());
  for(var idx=0; idx < unused.length; idx++) {
    var el = unused[idx];
    document.head.removeChild(el);
  };
  // add missing dependencies (scripts and style sheets)
  var missing = prodotype.getMissingDependencies(document.head, getCompList());
  for(var idx=0; idx < missing.length; idx++) {
    var el = missing[idx];
    el.setAttribute('data-dependency', '')
    document.head.appendChild(el);
  };
}
function getCompList() {
  var comps = document.querySelectorAll('[data-template-name]');
  var compArr = [];
  for(idx=0; idx < comps.length; idx++) compArr.push({
    name: comps[idx].getAttribute('data-name'),
    displayName: (comps[idx].getAttribute('data-name') || 'No name') + ' (' + comps[idx].getAttribute('data-template-name') + ')',
    templateName: comps[idx].getAttribute('data-template-name')
  });
  return compArr;
}
function select(element) {
  var selection = document.querySelectorAll('.selected');
  for(var idx=0; idx < selection.length; idx++) {
    var el = selection[idx];
    el.classList.remove('selected');
  };
  element.classList.add('selected');

  var data = JSON.parse(element.getAttribute('data-data') || '{}');
  var templateName = element.getAttribute('data-template-name');
  prodotype.edit(data, getCompList(), templateName, {
    onChange: function(newData, html) {
      element.setAttribute('data-data', JSON.stringify(newData));
      element.innerHTML = html;
    },
    onBrowse: function(e, cbk) {
      // e.preventDefault();
    }
  });
}

var showPreview = document.getElementById('showPreview');
showPreview.onclick = function(e) {
  document.body.classList.toggle('show-preview');
}

var ui = document.getElementById('ui');
var prodotype = new Prodotype(ui, './components');
prodotype.ready(function(err) {
  var option = document.createElement('option')
  option.value = option.innerHTML = '-';
  componentSelect.appendChild(option);
  for(var name in prodotype.componentsDef) {
    var option = document.createElement('option')
    option.value = option.innerHTML = name;
    componentSelect.appendChild(option);
  }
  componentSelect.onchange = function (e) {
    add(componentSelect.value);
  }
  // var initValue = 'unslider';
  var initValue = 'test-props-editor';
  componentSelect.value = initValue;
  setTimeout(add, 1000);
});
