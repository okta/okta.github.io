(function($) {
  /**
   * linkState
   *
   * This object defines the links that will appear, and serves as a state object once
   * the app begins.  If you need to add new libraries, add them to this object.  If
   * you need to change the default active libraries, change the active states in this
   * object.
   *
   * `active` links will be selected by default. As the user navigates, the active
   * properties will be modified accordingly.
   */
  var linkState = {
    clients: [
      {
        name: 'angular',
        label: 'Angular',
        serverExampleType: 'implicit'
      },
      {
        name: 'ios',
        label: 'iOS',
        serverExampleType: 'implicit'
      },
      {
        name: 'widget',
        label: 'Sign-In Widget',
        serverExampleType: 'auth-code',
        active: true
      }
    ],
    servers: [
      {
        active: true,
        name: 'nodejs',
        label: 'Node JS',
        frameworks: [
          {
            active: true,
            name: 'generic',
            label: 'Generic Node'
          },
          {
            name: 'express',
            label: 'Express.js'
          }
        ]
      },
      {
        name: 'java',
        label: 'Java',
        frameworks: [
          {
            name: 'generic',
            label: 'Generic Java',
            active: true
          },
          {
            name: 'spring',
            label: 'Spring'
          }
        ]
      },
      {
        name: 'php',
        label: 'PHP',
        frameworks: [
          {
            name: 'generic',
            label: 'Generic PHP',
            active: true
          }
        ]
      }
    ]
  }

  /**
   * Matches /client/server/framework
   */
  var urlExpression = '/([^\/]*)?\/?([^\/]*)?\/?([^\/]*)';

  /**
   * Iterate through the link state, render buttons and setup click handlers
   */
  function renderLinks() {
    linkState.clients.forEach(function (client) {
      var link = $('<a>', {
        text: client.label,
        class: client.active ? 'active' : '',
        click: function () {
          linkState.clients.forEach(function (client) {
            client.link.removeClass('active');
            client.active = false;
          });
          $(this).addClass('active');
          client.active = true;
          applySelectionTuple(getSelectionTupleFromLinkSate());
        }
      });
      client.link = link;
      $('#client-selector').append(link);
    });

    linkState.servers.forEach(function (server) {
      var link = $('<a>', {
        text: server.label,
        class: server.active ? 'active' : '',
        click: function () {
          linkState.servers.forEach(function (server) {
            server.link.removeClass('active');
              server.active = false;
          });
          renderFrameworkLinks(server);
          $(this).addClass('active');
          server.active = true;
          applySelectionTuple(getSelectionTupleFromLinkSate());
        }
      });
      server.link = link;
      $('#server-selector').append(link);
      if (server.active) {
        renderFrameworkLinks(server);
      }
    });

    function renderFrameworkLinks(server) {
      $('#framework-selector a').each(function (i, element) {
        $(element).remove();
      });

      server.frameworks.forEach(function (framework) {
        var link = $('<a>', {
          text: framework.label,
          class: framework.active ? 'active' : '',
          click: function () {
            server.frameworks.forEach(function (framework) {
              framework.link.removeClass('active');
              framework.active = false;
            });
            $(this).addClass('active');
            framework.active = true;
            applySelectionTuple(getSelectionTupleFromLinkSate());
          }
        });
        framework.link = link;
        $('#framework-selector').append(link);
      });
    }
  }

  /**
   * Fetches the content for a given selection tuple
   */
  function loadContent(clientName, server, framework) {
    var client = linkState.clients.filter(function(client) {
      return client.name === clientName;
    })[0];
    var clientContentUrl = clientName + '/default-example.html';
    var serverContentUrl = server + '/' + framework + '-' + client.serverExampleType + '.html';

    $.ajax({
      url: clientContentUrl
    }).done(function( html ) {
      $( "#client_content" ).html( html );
    });
    $.ajax({
      url: serverContentUrl
    }).done(function( html ) {
      $( "#server_content" ).html( html );
    });
  };

  /**
   * Get the active selections from the window hash
   *
   * @returns [clientName, serverName, frameworkName]
   */
  function getSelectionTupleFromHash() {
    var matches = window.location.hash.match(urlExpression);
    var clientName = matches && matches[1];
    var serverName = matches && matches[2];
    var frameworkName = matches && matches[3];
    return [clientName, serverName, frameworkName];
  }

  /**
   * Get the active selections from the link sate
   *
   * @returns [clientName, serverName, frameworkName]
   */
  function getSelectionTupleFromLinkSate() {
    var tuple = [];
    linkState.clients.forEach(function (client) {
      if (client.active) {
        tuple.push(client.name);
      }
    });
    linkState.servers.forEach(function (server) {
      if (server.active) {
        tuple.push(server.name)
        server.frameworks.forEach(function (framework) {
          if (framework.active) {
            tuple.push(framework.name)
          }
        });
      }
    });
    return tuple;
  }

  /**
   * Apply a selection tuple to the application state (set new window hash and load content)
   */
  function applySelectionTuple(selectionTuple) {
    window.location.replace('#/' + selectionTuple.join('/'));
    loadContent.apply(null, selectionTuple);
  }

  /**
   * Apply a selection tuple to the link state (will modify `active` properties)
   */
  function applySelectionTupleToLinkSate(selectionTuple) {
    var activeClient = selectionTuple[0];
    var activeServer = selectionTuple[1];
    var activeFramework = selectionTuple[2];

    linkState.clients.forEach(function (client) {
      client.active = client.name === activeClient;
    });
    linkState.servers.forEach(function (server) {
      server.active = server.name === activeServer;
      server.frameworks.forEach(function (framework) {
        framework.active = framework.name === activeFramework;
      });
    });
  }


  /**
   * Begin application.  Fetch default selections from link state, and current
   * selections from window hash.  Window hash overrides default link state.
   */
  function main() {
    var hashTuple = getSelectionTupleFromHash();
    var stateTuple = getSelectionTupleFromLinkSate();
    var initialTuple = [
      hashTuple[0] || stateTuple[0],
      hashTuple[1] || stateTuple[1],
      hashTuple[2] || stateTuple[2]
    ];

    applySelectionTupleToLinkSate(initialTuple);
    renderLinks();
    applySelectionTuple(initialTuple);
    $('#client_setup_link').addClass('active');
  }

  // Used to scroll to the right place without anchors, 150 is to account for our header space
  window.scrollToServer = function () {
    $('body').animate({scrollTop: $('#server_setup').offset().top - 150});
    $('#server_setup_link').addClass('active');
    $('#client_setup_link').removeClass('active');
  };
  window.scrollToClient = function () {
    $('body').animate({scrollTop: $('#client_setup').offset().top - 150});
    $('#client_setup_link').addClass('active');
    $('#server_setup_link').removeClass('active');
  };

  if (window.location.pathname.match('^/quickstarts')) {
    main();
  }

})(jQuery);