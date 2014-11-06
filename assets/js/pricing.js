// pricing page javascript


$(document).ready(function() {
  $('.tip').tooltipster({
    animation: 'grow',
    maxWidth: 300,
    theme: 'tooltipster-okta'
  });

  $('#mfa-tip').tooltipster({
    content: $('<p>The easiest way to add 2-factor authentication to your application. Okta provides both built-in factors as well as integrations for 3rd party solutions.</p><ul><li>Built-In: security questions, SMS, Okta Verify</li><li>3rd Party Integrations: Google Authenticator, RSA SecureId, Verisign VIP, and Duo Security.</li><li>Support for mult-factor authentication over Radius (for VPNs).</li></ul>'),
    animation: 'grow',
    maxWidth: 300,
    theme: 'tooltipster-okta'
  });

  $('#policy-engine-tip').tooltipster({
    content: $('<ul><li>IP range restrictions</li><li>Custom password policy</li></ul>'),
    animation: 'grow',
    maxWidth: 300,
    theme: 'tooltipster-okta'
  });

});




