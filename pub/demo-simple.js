var stage = document.getElementById('stage');
var ui = document.getElementById('ui');
var prodotype = new Prodotype(ui, './sample');
prodotype.ready(function(err) {
  // create a component in the stage div
  var templateName = 'card';
  var name = prodotype.createName(templateName, []);
  var data = {
    name: name
  };
  prodotype.decorate(templateName, data).then(html => stage.innerHTML = html);
  // update dependencies for this component
  var unused = prodotype.getUnusedDependencies(document.head.querySelectorAll('[data-dependency]'), [{templateName: templateName}]);
  for(var idx=0; idx < unused.length; idx++) {
    document.head.removeChild(unused[idx]);
  }
  // add missing dependencies (scripts and style sheets)
  var missing = prodotype.getMissingDependencies(document.head, [{templateName: templateName}]);
  for(var idx=0; idx < missing.length; idx++) {
    var el = missing[idx];
    el.setAttribute('data-dependency', '')
    document.head.appendChild(el);
  }
  setTimeout(function() {
    // displays tool boxes and edit the component
    prodotype.edit(data, [{templateName:templateName}], templateName, {
      onChange: function(newData, html) {
        data = newData;
        stage.innerHTML = html;
      },
      onBrowse: function(e, cbk) {
        // e.preventDefault();
      }
    });
  }, 1000);
});

