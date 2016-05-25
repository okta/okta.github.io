---
layout: docs_page
title: Session Cookie
---

## Overview

Okta utilizes a non-persistent HTTP session cookie to provide access to your Okta organization and applications across web requests for an interactive user-agents such as a browser.  This document provides examples for programmatically retrieving and setting a session cookie for different deployment scenarios to provide SSO capabilities for custom web applications built on the Okta platform.

Okta sessions are created and managed with the [Session API](/docs/api/rest/sessions.html).

## Retrieving a session cookie by visiting a session redirect link

This scenario is ideal for deployment scenarios where you have implemented both a custom login page and custom landing page for your application.  The login page will typically collect the user's credentials via a HTML form submit or POST and the web application will validate the credentials against your Okta organization by calling the [Create Session](/docs/api/rest/sessions.html#create-session-with-session-token) API to obtain a one-time token.

The generated one-time token along with the URL for your landing page can then be used to complete the following [URI Template](http://tools.ietf.org/html/rfc6570) `https://your-subdomain.okta.com/login/sessionCookieRedirect?token={cookieToken}&redirectUrl={redirectUrl}` that will retrieve a session cookie for a user's browser when visited.

> The one-time token may only be used **once** to establish a session.  If the session expires or the user logs out of Okta after using the token, they will not be able to reuse the same one-time token to get a new session cookie.

### Validate credentials & retrieve a one-time token

When processing a user's login request in your web application, retrieve a one-time token by passing the user's credentials with the `cookieToken` additionalFields query param to the [Create Session](/docs/api/rest/sessions.html#create-session-with-session-token) operation.

> Creating a session with `username` and `password` has been deprecated.  Use the [Authentication API](././api/resources/authn.html) to obtain a `sessionToken`.

#### Request Example
{:.api .api-request .api-request-example}

~~~ http
POST /api/v1/sessions?additionalFields=cookieToken HTTP/1.1
Host: your-subdomain.okta.com
Authorization: SSWS yourtoken
Accept: application/json
Content-Type: application/json

{
  "username": "art.vandelay@example.com",
  "password": "correct horse battery staple"
}
~~~

#### Response Example
{:.api .api-response .api-response-example}

~~~ http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "id": "000kYk6cDF7R02z4PxV5mhL4g",
    "userId": "00u9apFCRAIKHVPZLGXT",
    "mfaActive": false,
    "cookieToken": "009Db9G6Sc8o8VfE__SlGj4FPxaG63Wm89TpJnaDF6"
}
~~~

### Visit session redirect URL with the one-time token

After your login flow is complete you often need to establish a session cookie for your own application as well as a session cookie for Okta before visiting your landing page.  This is accomplished by returning a HTTP redirect status code for the login response that includes both your app's session cookie as well as the completed URI template with the one-time token for the Okta session redirect URL:
`https://your-subdomain.okta.com/login/sessionCookieRedirect?token={cookieToken}&redirectUrl={redirectUrl}`

> Only the Okta session redirect URL with one-time token is required

~~~ http
HTTP/1.1 302 Moved Temporarily
Set-Cookie: my_app_session_cookie_name=my_apps_session_cookie_value; Path=/
Location: https://your-subdomain.okta.com/login/sessionCookieRedirect?token=009Db9G6Sc8o8VfE__SlGj4FPxaG63Wm89TpJnaDF6&redirectUrl=https%3A%2F%2Fwww.example.com%2Fportal%2Fhome
~~~

The user's browser will set your app's session cookie and follow the redirect to Okta.  Okta will validate the one-time token and return a 302 status response that sets a session cookie for Okta and redirects the user's browser back to your landing page.  After the page has loaded the user will have an active session with Okta and will be able to SSO into their applications until the session is expired or the user closes the session (logout) or browser application.

~~~ http
GET /login/sessionCookieRedirect?token=009Db9G6Sc8o8VfE__SlGj4FPxaG63Wm89TpJnaDF6&redirectUrl=https%3A%2F%2Fwww.example.com%2Fportal%2Fhome HTTP/1.1
Host: your-subdomain.okta.com
Accept: */*
~~~

~~~ http
HTTP/1.1 302 Moved Temporarily
Set-Cookie: sid=000aC_z7AZKTpSqtHFc0Ak6Vg; Path=/
Location: https://www.example.com/portal/home
~~~

## Retrieving a session cookie by visiting an application embed link

This scenario is ideal for deployment scenarios where you have a custom login page but immediately want to launch an Okta application after login without returning to a landing page.  The login page will typically collect the user's credentials via a HTML form submit or POST and validate the credentials against your Okta organization by calling the [Create Session](/docs/api/rest/sessions.html#create-session-with-session-token) API to obtain a one-time token.

The generated one-time token can than be passed as a query parameter to an Okta application's embed link that will set a session cookie as well as launch the application in a single web request.

> The one-time token may only be used **once** to establish a session.  If the session expires or the user logs out of Okta after using the token, they will not be able to reuse the same one-time token to get a new session cookie.

### Validate credentials & retrieve a one-time token

When processing a user's login request in your web application, retrieve an one-time token by passing the user's credentials with the `cookieToken` additionalFields query param to the [Create Session](/docs/api/rest/sessions.html#create-session-with-session-token) operation.

> Creating a session with `username` and `password` has been deprecated.  Use the [Authentication API](././api/resources/authn.html) to obtain a `sessionToken`.

#### Request Example
{:.api .api-request .api-request-example}

~~~ http
POST /api/v1/sessions?additionalFields=cookieToken HTTP/1.1
Host: your-subdomain.okta.com
Authorization: SSWS yourtoken
Accept: application/json
Content-Type: application/json

{
  "username": "art.vandelay@example.com",
  "password": "correct horse battery staple"
}
~~~

#### Response Example
{:.api .api-response .api-response-example}

~~~ http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "id": "000kYk6cDF7R02z4PxV5mhL4g",
    "userId": "00u9apFCRAIKHVPZLGXT",
    "mfaActive": false,
    "cookieToken": "009Db9G6Sc8o8VfE__SlGj4FPxaG63Wm89TpJnaDF6"
}
~~~

### Visit an embed link with the one-time token

After your login flow is complete you can launch an Okta application for the user with an [embed link](/docs/api/rest/users.html#get-assigned-app-links) that contains the the one-time token as a query parameter `onetimetoken`.

~~~ http
HTTP/1.1 302 Moved Temporarily
Location: https://your-subdomain/app/google/go1013td3mXAQOJCHEHQ/mail?onetimetoken=009Db9G6Sc8o8VfE__SlGj4FPxaG63Wm89TpJnaDF6
~~~

When the link is visited, the token in the request will be used to initiate the user's session before processing the application launch request. A session cookie will be set in the browser and the user will have an active session with Okta and will be able to SSO into additional applications until the session is expired or the user closes the session (logout) or browser application.

~~~ http
HTTP/1.1 302 Moved Temporarily
Set-Cookie: sid=000aC_z7AZKTpSqtHFc0Ak6Vg; Path=/
Location: https://mail.google.com/a/your-subdomain
~~~

> The HTTP response will vary depending on the specific Okta application but will always contain a `Set-Cookie` header.

### Initiate a SAML SSO with the one-time token

After your login flow is complete you can also initiate a SAML SSO into an Okta application for the user with either the `HTTP-Redirect` or `HTTP-POST`binding to the application's SAML SSO URL
that contains the the one-time token as query parameter `onetimetoken`.

~~~ http
GET /app/template_saml_2_0/kbiyMOIMHNLGHJNCBURM/sso/saml?RelayState=%2Fsome%2Fdeep%2Flink&onetimetoken=009Db9G6Sc8o8VfE__SlGj4FPxaG63Wm89TpJnaDF6 HTTP/1.1
Host: your-subdomain.okta.com
Accept: */*
~~~

When the link is visited, the token in the request will be used to initiate the user's session before processing the SAML SSO request. A session cookie will be set in the browser and the user will have an active session with Okta and will be able to SSO into additional applications until the session is expired or the user closes the session (logout) or browser application.

~~~ http
HTTP/1.1 200 OK
Content-Type: text/html;charset=utf-8
Set-Cookie: sid=000aC_z7AZKTpSqtHFc0Ak6Vg; Path=/
<html>
<body>
    <div>
        <form id="appForm" action="https://sp.example.com/auth/saml20" method="POST">
            <input name="SAMLResponse" type="hidden" value="PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c2FtbDJwOlJlc3BvbnNlIHhtbG5zOnNhbWwycD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOnByb3RvY29sIiBEZXN0aW5hdGlvbj0iaHR0cHM6Ly9va3RhcHMxLm9rdGEuY29tL2F1dGgvc2FtbDIwL2thcmwiIElEPSJpZDEzODE1MzU1NjY3MTAwODkwMDAxMzkzODMwOTY2IiBJc3N1ZUluc3RhbnQ9IjIwMTMtMTAtMTFUMjM6NTI6NDYuNjk4WiIgVmVyc2lvbj0iMi4wIj48c2FtbDI6SXNzdWVyIHhtbG5zOnNhbWwyPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YXNzZXJ0aW9uIiBGb3JtYXQ9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDpuYW1laWQtZm9ybWF0OmVudGl0eSI+aHR0cDovL3d3dy5va3RhLmNvbS9rYml5TU9JTUhOTEdISk5DQlVSTTwvc2FtbDI6SXNzdWVyPjxkczpTaWduYXR1cmUgeG1sbnM6ZHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyMiPjxkczpTaWduZWRJbmZvPjxkczpDYW5vbmljYWxpemF0aW9uTWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS8xMC94bWwtZXhjLWMxNG4jIi8+PGRzOlNpZ25hdHVyZU1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyNyc2Etc2hhMSIvPjxkczpSZWZlcmVuY2UgVVJJPSIjaWQxMzgxNTM1NTY2NzEwMDg5MDAwMTM5MzgzMDk2NiI+PGRzOlRyYW5zZm9ybXM+PGRzOlRyYW5zZm9ybSBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyNlbnZlbG9wZWQtc2lnbmF0dXJlIi8+PGRzOlRyYW5zZm9ybSBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMTAveG1sLWV4Yy1jMTRuIyIvPjwvZHM6VHJhbnNmb3Jtcz48ZHM6RGlnZXN0TWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnI3NoYTEiLz48ZHM6RGlnZXN0VmFsdWU+enNDNjJuOUI3S1RxN1pZdG5YM3M2dW9jYXRBPTwvZHM6RGlnZXN0VmFsdWU+PC9kczpSZWZlcmVuY2U+PC9kczpTaWduZWRJbmZvPjxkczpTaWduYXR1cmVWYWx1ZT5aZ3YvamFJdkpGSW9EV29GRnUyM0dJVVJLSU9JMUdOd2FmWXhZbmdWY01pRnQ5UTRwOS9MQUhMSXVKYzhjdXh4UmlmYlpza1ZlRWh1TG1xV3JSSFpMRHh2djJ4Wm15eUM4UGlSc2xFSGlzMEhhQTY3bDF3dlBaTURTSWxhV3lJaFFzVkppVE90Nk9GSXpjNkZwZEFZVWU0Y3ptcEEyaW4vK2RmQTl0S1dYbkU9PC9kczpTaWduYXR1cmVWYWx1ZT48ZHM6S2V5SW5mbz48ZHM6WDUwOURhdGE+PGRzOlg1MDlDZXJ0aWZpY2F0ZT5NSUlDblRDQ0FnYWdBd0lCQWdJR0FTbE1OYXdETUEwR0NTcUdTSWIzRFFFQkJRVUFNSUdSTVFzd0NRWURWUVFHRXdKVlV6RVRNQkVHCkExVUVDQXdLUTJGc2FXWnZjbTVwWVRFV01CUUdBMVVFQnd3TlUyRnVJRVp5WVc1amFYTmpiekVOTUFzR0ExVUVDZ3dFVDJ0MFlURVUKTUJJR0ExVUVDd3dMVTFOUFVISnZkbWxrWlhJeEVqQVFCZ05WQkFNTUNXSnZiM1J6ZEhKaGNERWNNQm9HQ1NxR1NJYjNEUUVKQVJZTgphVzVtYjBCdmEzUmhMbU52YlRBZUZ3MHhNREEyTVRneE56VTJOVEphRncwME1EQTJNVGd4TnpVM05USmFNSUdSTVFzd0NRWURWUVFHCkV3SlZVekVUTUJFR0ExVUVDQXdLUTJGc2FXWnZjbTVwWVRFV01CUUdBMVVFQnd3TlUyRnVJRVp5WVc1amFYTmpiekVOTUFzR0ExVUUKQ2d3RVQydDBZVEVVTUJJR0ExVUVDd3dMVTFOUFVISnZkbWxrWlhJeEVqQVFCZ05WQkFNTUNXSnZiM1J6ZEhKaGNERWNNQm9HQ1NxRwpTSWIzRFFFSkFSWU5hVzVtYjBCdmEzUmhMbU52YlRDQm56QU5CZ2txaGtpRzl3MEJBUUVGQUFPQmpRQXdnWWtDZ1lFQWtIUDlpSGNYCnRja0ZVMmliNkpWUTNVUDRaMDFoc1QyWXh1ZUhqa2pxL0Z3N1o3aEtueDMwb0JBeFl6dGxUZitsSVpjVWlRVnc5WUF2NVVKNC9uaEMKSTdiQmM2SVVuYnIzUTZ5NitjbWJ1VlVnaVhodzVsTTR5a2tMQ2dLZ01uVk5hcHRYNGt4RGY0ZGVRbEorS0pLeFdDWjN5TXR5aEZYZQo0bUtvbUwxQzRyc0NBd0VBQVRBTkJna3Foa2lHOXcwQkFRVUZBQU9CZ1FBbVJEODBnMVYzU2lNYjdEdHZwMG1CZWk5elczaEw3Y0RYCnV2ZFlBMXU0Vmhhais1bWppYVJ5QlFDODJLaU1UZ1l4MGExOWZGeUVRWHlwcGU0Nzh3MUNBUFFBbjhIWEFMVHR3WUJpMUgvbHpKRTUKaU5MRE55dWVtTjhaUVV5TTFNeVNYbDhiVmNRSE4wZmpnOWVmWG9kYkw4VzVhLzZwTW9Mc2NaaDJHTUsrVkE9PTwvZHM6WDUwOUNlcnRpZmljYXRlPjwvZHM6WDUwOURhdGE+PC9kczpLZXlJbmZvPjwvZHM6U2lnbmF0dXJlPjxzYW1sMnA6U3RhdHVzIHhtbG5zOnNhbWwycD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOnByb3RvY29sIj48c2FtbDJwOlN0YXR1c0NvZGUgVmFsdWU9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDpzdGF0dXM6U3VjY2VzcyIvPjwvc2FtbDJwOlN0YXR1cz48c2FtbDI6QXNzZXJ0aW9uIHhtbG5zOnNhbWwyPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YXNzZXJ0aW9uIiBJRD0iaWQxMzgxNTM1NTY2NzE0OTg5MDAwMjMxOTQzNDgiIElzc3VlSW5zdGFudD0iMjAxMy0xMC0xMVQyMzo1Mjo0Ni42OThaIiBWZXJzaW9uPSIyLjAiPjxzYW1sMjpJc3N1ZXIgRm9ybWF0PSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6bmFtZWlkLWZvcm1hdDplbnRpdHkiIHhtbG5zOnNhbWwyPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YXNzZXJ0aW9uIj5odHRwOi8vd3d3Lm9rdGEuY29tL2tiaXlNT0lNSE5MR0hKTkNCVVJNPC9zYW1sMjpJc3N1ZXI+PGRzOlNpZ25hdHVyZSB4bWxuczpkcz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnIyI+PGRzOlNpZ25lZEluZm8+PGRzOkNhbm9uaWNhbGl6YXRpb25NZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzEwL3htbC1leGMtYzE0biMiLz48ZHM6U2lnbmF0dXJlTWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnI3JzYS1zaGExIi8+PGRzOlJlZmVyZW5jZSBVUkk9IiNpZDEzODE1MzU1NjY3MTQ5ODkwMDAyMzE5NDM0OCI+PGRzOlRyYW5zZm9ybXM+PGRzOlRyYW5zZm9ybSBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyNlbnZlbG9wZWQtc2lnbmF0dXJlIi8+PGRzOlRyYW5zZm9ybSBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMTAveG1sLWV4Yy1jMTRuIyIvPjwvZHM6VHJhbnNmb3Jtcz48ZHM6RGlnZXN0TWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnI3NoYTEiLz48ZHM6RGlnZXN0VmFsdWU+LzRvakxrbFE3SDVLVlQvYXhMSk9nVEttQkRRPTwvZHM6RGlnZXN0VmFsdWU+PC9kczpSZWZlcmVuY2U+PC9kczpTaWduZWRJbmZvPjxkczpTaWduYXR1cmVWYWx1ZT5OSGNxQVJGT2FHd2N3bVlyRklMeTlGendnWDZDenVMcDlhQm5UZkxXdFpic0tOWFRvSS92dG9GVjhDMzFEOUlKVlVoOVhNcmtQckN4Q2VZZGczdnlUbmx5dG80SlJ1TlR2elhncFBEcGlDZ2RGaWhHeFJPRk9JVFhoQkdkRFNXbVdkYkNuQWJDZzBWT2xlZHNnQjMxTExudXFJaGIxSGJGVy9ZeFBhUTRmbEU9PC9kczpTaWduYXR1cmVWYWx1ZT48ZHM6S2V5SW5mbz48ZHM6WDUwOURhdGE+PGRzOlg1MDlDZXJ0aWZpY2F0ZT5NSUlDblRDQ0FnYWdBd0lCQWdJR0FTbE1OYXdETUEwR0NTcUdTSWIzRFFFQkJRVUFNSUdSTVFzd0NRWURWUVFHRXdKVlV6RVRNQkVHCkExVUVDQXdLUTJGc2FXWnZjbTVwWVRFV01CUUdBMVVFQnd3TlUyRnVJRVp5WVc1amFYTmpiekVOTUFzR0ExVUVDZ3dFVDJ0MFlURVUKTUJJR0ExVUVDd3dMVTFOUFVISnZkbWxrWlhJeEVqQVFCZ05WQkFNTUNXSnZiM1J6ZEhKaGNERWNNQm9HQ1NxR1NJYjNEUUVKQVJZTgphVzVtYjBCdmEzUmhMbU52YlRBZUZ3MHhNREEyTVRneE56VTJOVEphRncwME1EQTJNVGd4TnpVM05USmFNSUdSTVFzd0NRWURWUVFHCkV3SlZVekVUTUJFR0ExVUVDQXdLUTJGc2FXWnZjbTVwWVRFV01CUUdBMVVFQnd3TlUyRnVJRVp5WVc1amFYTmpiekVOTUFzR0ExVUUKQ2d3RVQydDBZVEVVTUJJR0ExVUVDd3dMVTFOUFVISnZkbWxrWlhJeEVqQVFCZ05WQkFNTUNXSnZiM1J6ZEhKaGNERWNNQm9HQ1NxRwpTSWIzRFFFSkFSWU5hVzVtYjBCdmEzUmhMbU52YlRDQm56QU5CZ2txaGtpRzl3MEJBUUVGQUFPQmpRQXdnWWtDZ1lFQWtIUDlpSGNYCnRja0ZVMmliNkpWUTNVUDRaMDFoc1QyWXh1ZUhqa2pxL0Z3N1o3aEtueDMwb0JBeFl6dGxUZitsSVpjVWlRVnc5WUF2NVVKNC9uaEMKSTdiQmM2SVVuYnIzUTZ5NitjbWJ1VlVnaVhodzVsTTR5a2tMQ2dLZ01uVk5hcHRYNGt4RGY0ZGVRbEorS0pLeFdDWjN5TXR5aEZYZQo0bUtvbUwxQzRyc0NBd0VBQVRBTkJna3Foa2lHOXcwQkFRVUZBQU9CZ1FBbVJEODBnMVYzU2lNYjdEdHZwMG1CZWk5elczaEw3Y0RYCnV2ZFlBMXU0Vmhhais1bWppYVJ5QlFDODJLaU1UZ1l4MGExOWZGeUVRWHlwcGU0Nzh3MUNBUFFBbjhIWEFMVHR3WUJpMUgvbHpKRTUKaU5MRE55dWVtTjhaUVV5TTFNeVNYbDhiVmNRSE4wZmpnOWVmWG9kYkw4VzVhLzZwTW9Mc2NaaDJHTUsrVkE9PTwvZHM6WDUwOUNlcnRpZmljYXRlPjwvZHM6WDUwOURhdGE+PC9kczpLZXlJbmZvPjwvZHM6U2lnbmF0dXJlPjxzYW1sMjpTdWJqZWN0IHhtbG5zOnNhbWwyPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YXNzZXJ0aW9uIj48c2FtbDI6TmFtZUlEIEZvcm1hdD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6MS4xOm5hbWVpZC1mb3JtYXQ6ZW1haWxBZGRyZXNzIj5mcmVkZmxpbnRzdG9uZUByaW5jb25oaWxsLmNvbTwvc2FtbDI6TmFtZUlEPjxzYW1sMjpTdWJqZWN0Q29uZmlybWF0aW9uIE1ldGhvZD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmNtOmJlYXJlciI+PHNhbWwyOlN1YmplY3RDb25maXJtYXRpb25EYXRhIE5vdE9uT3JBZnRlcj0iMjAxMy0xMC0xMVQyMzo1Nzo0Ni43MTdaIiBSZWNpcGllbnQ9Imh0dHBzOi8vb2t0YXBzMS5va3RhLmNvbS9hdXRoL3NhbWwyMC9rYXJsIi8+PC9zYW1sMjpTdWJqZWN0Q29uZmlybWF0aW9uPjwvc2FtbDI6U3ViamVjdD48c2FtbDI6Q29uZGl0aW9ucyBOb3RCZWZvcmU9IjIwMTMtMTAtMTFUMjM6NDc6NDYuNzE3WiIgTm90T25PckFmdGVyPSIyMDEzLTEwLTExVDIzOjU3OjQ2LjcxN1oiIHhtbG5zOnNhbWwyPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YXNzZXJ0aW9uIj48c2FtbDI6QXVkaWVuY2VSZXN0cmljdGlvbj48c2FtbDI6QXVkaWVuY2U+aHR0cHM6Ly93d3cub2t0YS5jb20vc2FtbDIvc2VydmljZS1wcm92aWRlci9zcGJmZHY5MnFLU0JUR1VZR1VQTzwvc2FtbDI6QXVkaWVuY2U+PC9zYW1sMjpBdWRpZW5jZVJlc3RyaWN0aW9uPjwvc2FtbDI6Q29uZGl0aW9ucz48c2FtbDI6QXV0aG5TdGF0ZW1lbnQgQXV0aG5JbnN0YW50PSIyMDEzLTEwLTExVDIzOjUyOjQ2LjY5OFoiIFNlc3Npb25JbmRleD0iaWQxMzgxNTM1NTY2Njk4LjY4MDQ3Mjc3IiB4bWxuczpzYW1sMj0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmFzc2VydGlvbiI+PHNhbWwyOkF1dGhuQ29udGV4dD48c2FtbDI6QXV0aG5Db250ZXh0Q2xhc3NSZWY+dXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmFjOmNsYXNzZXM6UGFzc3dvcmRQcm90ZWN0ZWRUcmFuc3BvcnQ8L3NhbWwyOkF1dGhuQ29udGV4dENsYXNzUmVmPjwvc2FtbDI6QXV0aG5Db250ZXh0Pjwvc2FtbDI6QXV0aG5TdGF0ZW1lbnQ+PC9zYW1sMjpBc3NlcnRpb24+PC9zYW1sMnA6UmVzcG9uc2U+"/>
            <input name="RelayState" type="hidden" value="/some/deep/link"/>
        </form>

        <script type="text/javascript">

          $(function(){
            document.getElementById('appForm').submit();
          });
      </script>
  </div>
</body>
</html>
~~~

### Initiate a WS-Federation SSO with the one-time token

You can also use the same [flow as SAML](#initiate-a-saml-sso-with-the-session-token) for template WS-Federation application as well by passing the one-time token as query parameter `onetimetoken`.

~~~ http
GET /app/template_wsfed/k9x69oiKYSUWMIYZBKTY/sso/wsfed/passive?wa=wsignin1.0&wtrealm=https%3A%2F%2Fexample.com%2FApp%2F&wctx=rm%3D0%26id%3Dpassive%26ru%3D%2FApp%2FHome%2FAbout&onetimetoken=009Db9G6Sc8o8VfE__SlGj4FPxaG63Wm89TpJnaDF6 HTTP/1.1
Host: your-subdomain.okta.com
Accept: */*
~~~

## Retrieving a session cookie with a hidden image

This flow uses a browser trick to establish a session by setting a cookie when retrieving a transparent 1x1 image with a one-time token.  Your login page will typically collect the user's credentials via a HTML form submit or POST and validate the credentials against your Okta organization by calling the [Create Session](/docs/api/rest/sessions.html#create-session-with-embed-image-url) API to obtain a session cookie image URL with a one-time token.

> This flow is now deprecated as some major browser vendors such as Safari block cookies from 3rd-party sites by default.  Please use an alternative flow as browser vendors are increasingly blocking cookies from 3rd party sites by default

### Validate credentials & retrieve a session cookie image URL

When processing a user's login request in your web application, retrieve a session cookie image URL by passing the user's credentials with the `cookieTokenUrl` additionalFields query param to the [Create Session](/docs/api/rest/sessions.html#create-session-with-embed-image-url) operation.

#### Request Example
{:.api .api-request .api-request-example}

~~~ http
POST /api/v1/sessions?additionalFields=cookieTokenUrl HTTP/1.1
Host: your-subdomain.okta.com
Authorization: SSWS yourtoken
Accept: application/json
Content-Type: application/json

{
  "username": "art.vandelay@example.com",
  "password": "correct horse battery staple"
}
~~~

#### Response Example
{:.api .api-response .api-response-example}

~~~ http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "id": "000kYk6cDF7R02z4PxV5mhL4g",
    "userId": "00u9apFCRAIKHVPZLGXT",
    "mfaActive": false,
    "cookieTokenUrl": "https://your-subdomain.okta.com/login/sessionCookie?token=00nwBmuBFS4o2E5l58eSbgnr4NmY0-ELQR4Pvn2RZV"
}
~~~

### Add image tag with session cookie image URL

When you are ready to establish a session with Okta for the user, include the session cookie image URL in an image tag.

~~~ html
<img src="https://your-subdomain.okta.com/login/sessionCookie?token=00nwBmuBFS4o2E5l58eSbgnr4NmY0-ELQR4Pvn2RZV">
~~~

When the page containing the tag is loaded, the token in the request will be used to initiate the user's session, and a session cookie will be set in the browser. The image that renders is a 1x1 transparent image. After the page has loaded the user will have an active session with Okta and will be able to SSO into their applications. The token is a one-time token, so successive page loads will have no impact on the user's session. If the user logs out of Okta after using the token, they will not be able to reuse that same token to get a session cookie.

~~~ http
HTTP/1.1 200 OK
Content-Type: image/png
Set-Cookie: sid=000O8P2OlZLTHuz4RZV8locXA; Path=/
~~~
