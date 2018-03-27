(function($) {
  // Handle building the icons and code languages
  var codeLanguages = [
    { name: 'android', label: 'Android' },
    { name: 'angular', label: 'Angular' },
    { name: 'react',label: 'React' },
    { name: 'ios',  label: 'iOS' },
    { name: 'javascript', label: 'JavaScript' },
    { name: 'java', label: 'Java' },
    { name: 'dotnet', label: '.NET' },
    { name: 'nodejs', label: 'Node.js' },
    { name: 'php', label: 'PHP' },
    { name: 'python', label: 'Python' }
  ];

  function renderCodeLinks() {
    var flexBox = $('<div class="docs-page-tiles">');
    codeLanguages.forEach(function(language) {
      var icon = $('<i>', {
        class: 'icon docsPage code-' + language.name + '-32',
      });
      var link = $('<a>', {
        text: language.label,
        href: '/code/' + language.name + '/',
      });
      link.prepend($('<br />'));
      link.prepend(icon);
      flexBox.append(link);
    });

    $('#docs-languages').append(flexBox);
  }

  // Load documentation icons
  renderCodeLinks();
})(jQuery);
