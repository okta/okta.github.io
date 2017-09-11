(function($) {    
  $(window).load(function() {
    // Once the page is loaded, find the hidden iframe element
    // and make a postMessage request
    var iframe = document.getElementById('myOkta');
    if (!iframe) { return; }
    iframe.contentWindow.postMessage({messageType: 'get_accounts_json'}, 'https://login.okta.com');        
    window.addEventListener("message", receiveMessage, false);
  });

  function receiveMessage(event) {
    if (!event.data) { return; }

    event.data.forEach( function(account) {
      // Extract the first 'oktapreview' domain
      if (account.origin.indexOf('.oktapreview.com') !== -1){
        document.body.innerHTML = document.body.innerHTML.replace(/https:\/\/{yourOktaDomain}.com/g, account.origin);
        return;
      }
    })
  }
})(jQuery); 
