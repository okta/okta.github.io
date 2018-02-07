---
layout: docs_page
title: API Access Management Troubleshooting
---

# Troubleshooting for API Access Management

If you run into trouble setting up an authorization server or performing
other tasks for API Access Management, use the following suggestions to resolve your issues.

## Always Start with the System Log

The system log contains detailed information about why a request was denied and other useful information. 

## Limits

* Each authorization server can have only one resource. If you have resources that share a common path,
you can control access to the common path with one authorization server.

* Scopes are unique per authorization server. 

* The resource URI you specify in an authorization server must be an absolute path.

* Tokens can expire, be explicitly revoked at the endpoint, or implicitly revoked by a change in configuration. 

* Token revocation can be implicit in two ways: token expiration or a change to the source. 
    * Expiration happens at different times:
        * ID Token expires after one hour.
        * Access Token expiration is configured in a policy, but is always between five minutes and one day.
        * Refresh Token expiration depends on two factors: 1) Expiration is configured in an Access Policy, no limits, 
          but must be greater than or equal to the Access Token lifetime, and 2) Revocation if the Refresh Token
          isn't exercised within a specified time. Configure the specified time in an Access Policy, with a minimum of ten minutes.
    
    * Revocation happens when a configuration is changed or deleted:
        * User deactivation or deletion.
        * Configuration in the authorization server is changed or deleted.
        * The [client app](https://help.okta.com/en/prev/Content/Topics/Apps/Apps_App_Integration_Wizard.htm#OIDCWizard) is deactivated, changed, unassigned, or deleted.
        
* If a client requests multiple scopes, but the policy for that client only allows for a subset of the scopes,
then the token isn't minted and an error is returned. The system log contains the details about the error.

## Subtle Behavior

Some behaviors aren't obvious:

* A user must be assigned to the client in Okta for the client to get Access Tokens from that client. 
You can assign the client directly (direct user assignment) or indirectly (group assignment).

* If you haven't created a rule in a policy in the authorization server to allow the client, user, and 
scope combination that you want, the request fails.
To resolve, create at least one rule in a policy in the authorization server for the relevant resource
that specifies client, user, and scope.

* OpenID Connect scopes are granted by default, so if you are requesting only those scopes ( `openid`, `profile`, `email`, `address`, `phone`, or `offline_access` ), you don't need to define any scopes for them, but you still need a policy and rule
in the authorization server. The rule grants the OpenID Connect scopes by default, so they don't need to be configured in the rule.
Token expiration times depend on how they are defined in the rules, and which policies and rules match the request.

* OpenID scopes can be requested with custom scopes. For example, a request can include `openid` and a custom scope.

* The evaluation of a policy always takes place during the initial authentication of the user (or of the client in case of client credentials flow). If the flow is not immediately finished, such as when a token is requested using `authorization_code` grant type, the policy is not evaluated again, and a change in the policy after the user or client is initially authenticated won't affect the continued flow.
