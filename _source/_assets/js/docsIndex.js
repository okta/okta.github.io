(function($) {
  // Handle building the icons and code languages
  var frontend = [
    { name: 'android', label: 'Android' },
    { name: 'angular', label: 'Angular' },
    { name: 'react',label: 'React' },
    { name: 'javascript', label: 'JavaScript' },
    { name: 'ios',  label: 'iOS' },
  ]

  var server = [
    { name: 'java', label: 'Java' },
    { name: 'dotnet', label: '.NET' },
    { name: 'nodejs', label: 'Node.js' },
    { name: 'php', label: 'PHP' },
    { name: 'python', label: 'Python' }
  ]

  function renderCodeLinks(codeLanguages) {
    var row = $('<tr class="docsPageTableRow">');
    codeLanguages.forEach(function(language) {
      var td = $('<td class="docsPageTableData">');
      var icon = $('<i>', {
        class: 'icon docsPage code-' + language.name + '-32',
      });

      var link = $('<a>', {
        text: language.label,
        href: '/code/' + language.name + '/',
      });
      link.prepend($('<br />'));
      link.prepend(icon);
      td.append(link);
      row.append(td);
    });
    return row;
  }

  function renderCodeRows() {
    var table = $('<table class="docsPageTable">');  
    // Build first row of frontend languages
    table.append(renderCodeLinks(frontend));

    // Build second row of server languages
    table.append(renderCodeLinks(server));

    $('#docs-languages').append(table);    
  }

  // Load documentation icons
  renderCodeRows();
})(jQuery);
