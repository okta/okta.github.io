---
layout: docs_page
weight: 3
title: Enabling CORS
redirect_from: "/docs/getting_started/enabling_cors.html"
scripts:
- https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js
js: cors
---

# Overview

[Cross-Origin Resource Sharing (CORS)](http://en.wikipedia.org/wiki/Cross-Origin_Resource_Sharing) is a mechanism that allows a web page to make an AJAX call using [XMLHttpRequest (XHR)](http://en.wikipedia.org/wiki/XMLHttpRequest) to a domain that is  different from the one from where the script was loaded.  Such "cross-domain" requests would otherwise be forbidden by web browsers, per the [same origin security policy](http://en.wikipedia.org/wiki/Same_origin_policy).  CORS defines a [standardized](http://www.w3.org/TR/cors/) way in which the browser and the server can interact to determine whether or not to allow the cross-origin request

In Okta, CORS allows JavaScript hosted on your websites to make an XHR to the Okta API with the Okta session cookie. Every website origin must be explicitly permitted via the Okta Admin Dashboard for CORS.

> **Caution:** Only grant access to specific origins (websites) that you control and trust to access the Okta API.

## API Support

The Okta API supports CORS on an API by API basis. If you're building an application that needs CORS, please check that the specific operation supports CORS for your use case. APIs that support CORS are marked with the following icon <span class="api-label api-label-small api-label-cors"><i class="fa fa-cloud-download"></i> CORS</span>.

## Browser Support

Not all browsers supports CORS.  The following table describes which browsers support this feature.

<iframe frameborder="0" width="100%" height="460px" src="http://caniuse.com/cors/embed/description&amp;links"></iframe>

> IE8 and IE9 do not support authenticated requests and cannot use the Okta session cookie with CORS.

## Granting Cross-Origin Access to Websites

You can enable CORS for websites that need cross-origin requests to the Okta API on the Okta Admin Dashboard. Select **Security** and then, **API**. Select the CORS tab and select **Edit** to see the screen shown below.

{% img okta-admin-ui-cors.png "CORS Settings UI" alt:"CORS Settings UI" %}

1. Enter the base URL of websites with which you want to allow cross-origin AJAX requests, one per line. Again, only list specific websites that you control.
2. Check the **Enable CORS…** box to enable CORS.
3. Select **Save**.

**Note: If you do not enable CORS, or disable it at a later date, the list of websites is retained.**

## Testing

You can test your CORS configuration with the following test tool

1. Explicitly allowing this website (https://developer.okta.com) on the Okta Admin Dashboard
2. Sign-in to your Okta organization on another browser tab
3. Enter your Okta organization in the form below and click **Test**

If you successfully completed the steps above, you should see your Okta User Profile

<div id="cors-test">
  <form class="form-cors-test" role="form">
    <div class="form-group col-md-6">
      <div class="input-group">
        <div class="input-group-addon">https://</div>
        <input id="input-orgUrl" type="text" class="form-control" placeholder="acme.okta.com" required>
      </div>
    </div>
    <button type="button" class="btn btn-primary"><i class="fa fa-cloud-download"></i> Test</button>
  </form>
  <div id="cors-test-result" class="cors-test-result">

  </div>
</div>

##### Request Examples
{:.api .api-request .api-request-example}

The following code samples can be added to your website to test your CORS configuration.  Remember to replace the `baseUrl` with the URL for your Okta organization.

###### XMLHttpRequest

~~~ javascript
var baseUrl = 'https://your-domain.okta.com';
var xhr = new XMLHttpRequest();
if ("withCredentials" in xhr) {
    xhr.onerror = function() {
      alert('Invalid URL or Cross-Origin Request Blocked.  You must explicitly add this site (' + window.location.origin + ') to the list of allowed websites in your Okta Admin Dashboard');
    }
    xhr.onload = function() {
        alert(this.responseText);
    };
    xhr.open('GET', baseUrl + '/api/v1/users/me', true);
    xhr.withCredentials = true;
    xhr.send();
} else {
    alert("CORS is not supported for this browser!")
}
~~~

###### jQuery

~~~ javascript
var baseUrl = 'https://your-domain.okta.com';
$.ajax({
  url: baseUrl + '/api/v1/users/me',
  type: 'GET',
  xhrFields: { withCredentials: true },
  accept: 'application/json'
}).done(function(data) {
    alert(data);
})
.fail(function(xhr, textStatus, error) {
  var title, message;
  switch (xhr.status) {
    case 403 :
      title = xhr.responseJSON.errorSummary;
      message = 'Please login to your Okta organization before running the test';
      break;
    default :
      title = 'Invalid URL or Cross-Origin Request Blocked';
      message = 'You must explicitly add this site (' + window.location.origin + ') to the list of allowed websites in your Okta Admin Dashboard';
      break;
  }
  alert(title + ': ' + message);
});
~~~

##### Response Example
{:.api .api-response .api-response-example}

If you did not enable CORS and allow your website cross-origin access, then you should see the following errors in your browser's developer tool console:

###### Chrome

~~~
XMLHttpRequest cannot load https://your-domain.okta.com/api/v1/users/me. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'https://your-website.com' is therefore not allowed access.
~~~

###### Safari

~~~
XMLHttpRequest cannot load https://your-domain.okta.com/api/v1/users/me. Origin https://your-domain.okta.com is not allowed by Access-Control-Allow-Origin.
~~~

###### Firefox

~~~
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://your-domain.okta.com/api/v1/users/me. This can be fixed by moving the resource to the same domain or enabling CORS.
~~~

###### Internet Explorer

~~~
SEC7118: XMLHttpRequest for https://your-domain.okta.com/api/v1/users/me required Cross Origin Resource Sharing (CORS).

SEC7120: Origin https://your-domain.okta.com not found in Access-Control-Allow-Origin header.

SCRIPT7002: XMLHttpRequest: Network Error 0x80070005, Access is denied.
~~~

## Additional Resources

- [HTTP access control (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)

<script id="template-profile" type="text/template" class="template">
  <div class="panel panel-default panel-profile">
    <div class="panel-heading">
      <span class="panel-title">Profile</span>
    </div>
    <div class="panel-body">
      <div class="form-horizontal" role="form">
        <div class="form-group">
          <label class="col-1-3 control-label">ID</label>
          <div class="col-2-3">
            <p class="form-control-static"><%= user.id %></p>
          </div>
        </div>
        <div class="form-group">
          <label class="col-1-3 control-label">Status</label>
          <div class="col-2-3">
            <p class="form-control-static"><%= user.status %></p>
          </div>
        </div>
        <div class="form-group">
          <label class="col-1-3 control-label">Login</label>
          <div class="col-2-3">
            <p class="form-control-static"><%= user.profile.login %></p>
          </div>
        </div>
        <div class="form-group">
          <label class="col-1-3 control-label">Email</label>
          <div class="col-2-3">
            <p class="form-control-static"><%= user.profile.email %></p>
          </div>
        </div>
        <div class="form-group">
          <label class="col-1-3 control-label">First Name</label>
          <div class="col-2-3">
            <p class="form-control-static"><%= user.profile.firstName %></p>
          </div>
        </div>
        <div class="form-group">
          <label class="col-1-3 control-label">Last Name</label>
          <div class="col-2-3">
            <p class="form-control-static"><%= user.profile.lastName %></p>
          </div>
        </div>
        <div class="form-group">
          <label class="col-1-3 control-label">Mobile Phone</label>
          <div class="col-2-3">
            <p class="form-control-static"><%= user.profile.mobilePhone %></p>
          </div>
        </div>
        <div class="form-group">
          <label class="col-1-3 control-label">Created</label>
          <div class="col-2-3">
            <p class="form-control-static"><%= user.created %></p>
          </div>
        </div>
        <div class="form-group">
          <label class="col-1-3 control-label">Updated</label>
          <div class="col-2-3">
            <p class="form-control-static"><%= user.lastUpdated %></p>
          </div>
        </div>
        <div class="form-group">
          <label class="col-1-3 control-label">Last Login</label>
          <div class="col-2-3">
            <p class="form-control-static"><%= user.lastLogin %></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</script>
