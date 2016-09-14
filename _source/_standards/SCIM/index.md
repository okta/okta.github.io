---
title: SCIM
icon: /assets/img/icons/scim.svg
permalink: /standards/SCIM/
excerpt: Enable SCIM-based provisioning from Okta to your application.
redirect_from: "/docs/guides/scim_guidance.html"
---
# SCIM Provisioning Technical Reference

> Okta's SCIM implementation is currently in Beta status and provides
> no guarantees for backwards-compatibility. Okta is free to break
> this SCIM implementation until it is released.

Thank you for your interest in the Okta SCIM beta.

By implementing support for the SCIM standard, an application in the Okta
Application Network can be notified when a user is created, updated,
or removed from their application in Okta.

If you haven't heard of SCIM before, here is a good summary from the
[Wikipedia article on SCIM](https://en.wikipedia.org/wiki/System_for_Cross-domain_Identity_Management):

> System for Cross-domain Identity Management (SCIM) is an open
> standard for automating the exchange of user identity information
> between identity domains, or IT systems.

# Joining the SCIM Provisioning Developer Program

Before building your SCIM Server, please make sure to [apply for admission](http://pages.okta.com/DeveloperSCIM.html) 
to the SCIM Provisioning Developer Program and familiarize yourself with 
the [program process and resources](scim_developer_program.html).

# Understanding User Provisioning in Okta

Okta is a universal directory that stores
identity-related information.  Users can be created in Okta directly
as local users or imported from external systems like Active
Directory or a [Human Resource Management Software](https://en.wikipedia.org/wiki/Category:Human_resource_management_software) system.

An Okta user schema contains many different user attributes,
but always contains a user name, first name, last name, and
email address. This schema can be extended.

Okta user attributes can be mapped from a source into Okta and can
be mapped from Okta to a target.

Below are the main operations in Okta's SCIM user provisioning lifecycle:

1.  Create a user account.
2.  Read a list of accounts, with support for searching for a preexisting account.
3.  Update an account (user profile changes, entitlement changes, etc).
4.  Deactivate an account.

In Okta, an application instance is a connector that provides Single Sign-On
and provisioning functionality with the target application.

# Testing your SCIM server with Runscope

The easiest way for you to develop and verify your SCIM integration
is to make use of an automated test suite that runs on Runscope.

If you are already familiar with Runscope, then just import the
[SCIM\_tests\_for\_Runscope.json](https://raw.githubusercontent.com/joelfranusic-okta/okta-scim-beta/master/SCIM_tests_for_Runscope.json) API test and configure the `SCIM Base
  URL` variable to point at the base URL for your SCIM server, for
example: `https://example.com/scim/v2`.

If you are not familiar with Runscope, follow the detailed
instructions below to get started with using Runscope to test your
SCIM server.

## Set up Runscope

If you do not have a Runscope account already, we suggest starting
with [Runscope's free plan for Okta](https://www.runscope.com/okta). Here is how to get started:

1.  Download the [SCIM\_tests\_for\_Runscope.json](https://raw.githubusercontent.com/joelfranusic-okta/okta-scim-beta/master/SCIM_tests_for_Runscope.json) file from this
    repository to your local hard drive. (You will use this file to
    import Okta's SCIM test suite into Runscope.)
2.  [Sign up for Runscope](//www.runscope.com/signup).
3.  You may see a tutorial after signing up for Runscope, if so, click
    "Skip Tutorial".
4.  You should now see a screen that says "API Tests".
5.  In the lower left of your screen, click on the "Import Tests"
    link.
6.  You should now see a title that starts with "Import Tests into
    &#x2026;"
7.  Select "Runscope API Tests" as the format to import
8.  Click the "Choose File" button and select the
    [SCIM\_tests\_for\_Runscope.json](https://raw.githubusercontent.com/joelfranusic-okta/okta-scim-beta/master/SCIM_tests_for_Runscope.json) that you saved in Step 1 above.
9.  Click the blue "Import API Test" button.
10. After the import completes, click on the "All Tests" link on
    the left hand side of your screen.

Now that you've imported Okta's SCIM test suite into Runscope, your
next step will be to customize the test suite for the SCIM
integration that you are writing.

## Customize the imported Runscope test for your SCIM integration

After importing Okta's SCIM test suite into Runscope, you will need to
configure the test for your SCIM integration. Here is how to do that:

1.  You should be looking at the "API Tests" screen in Runscope, if
    not, click on the "Tests" tab on the top of Runscope's user interface.
2.  You should see a test named "Okta SCIM 2.0 Tests", if not,
    follow the "Set up Runscope" steps above.
3.  Move your mouse over the "Okta SCIM 2.0 Tests" test, then select
    the "Edit" link on the lower left of the test.
4.  In the "Environment" section of your test, you should see a
    collapsed "Test Settings" section, click the arrow on the left
    of "Test Settings" to expand this section.
5.  "Initial Variables" should be selected, click the "Add Initial
    Variable" link.
6.  Name the variable "SCIM Base URL" *(case sensitive, use spaces between words)*
7.  Set the value of the "SCIM Base URL" to the base URL for your
    SCIM integration. 
    
    For example, if your SCIM integration is hosted on
    `https://example.com` and uses a prefix of `/scim/v2` then the
    "SCIM Base URL" for your integration would be:
    `https://example.com/scim/v2` 
    
    If you are developing your SCIM integration in a local
    development environment, we suggest using the excellent tool
    [ngrok](https://ngrok.com/) to expose your local development environment to Runscope
8.  Click the "Save" button at the top of the test.

## Running Okta's SCIM tests against your SCIM server

Now that you have updated your SCIM test in Runscope for your SCIM
server, it is time to run the test:

1.  If you followed the steps above, you should now be seeing a "Run
    Now" button at the top of your test.
2.  Click the "Run Now" button.
3.  On the left side of your screen, you will see a test show up in
    the "Recent Test Results" section.
4.  Click on the top test in the "Recent Test Results" section.
5.  If the test is still running, you will see live updates of the
    test in progress. Once the test is complete, you will see the
    results of your test.
6.  To see the details of tests, click on the little arrow next to
    each test to expand the details of a particular test case.
    
    Doing this will allow you to see the **Request** and **Response**
    for each HTTP request that was made.
7.  Since this test is running in your own Runscope instance, we
    encourage you to update the tests to better fit your own
    environment.
8.  See the "Required SCIM Capabilities" section below for details
    on what your SCIM server will need to implement to pass all of
    the tests.
9.  Keep running this test suite until all the tests pass.
    Here is an [example of a test suite where all tests pass](https://www.runscope.com/radar/qmovuxkrhtws/f95ac15f-3f22-46c3-8f1a-1001fbf8fb66/history/6a35fabf-5ce5-4e48-a13f-7292b1bd3cc5).

## Sharing test results from Runscope

As you are developing your SCIM server, you will likely want to
share test results with teammates or with Okta. 

Here is how to share a test result from Runscope with someone else:

1.  Open the test result that you want to share.
2.  At the top of the test result, Change the "Private / Shareable"
    toggle from "Private" to "Shareable".
3.  Copy the URL for the test result, it will look something like
    this:
    `https://www.runscope.com/radar/abcdefghijkl/m01nopq2-3456-7r8s-9012-t34567uvw890/history/123ef4gh-i567-89j0-1k2l-3m4n5o678901`
4.  Share that URL with the person that you want to share the test
    result with. Here is an example test result from Runscope: 
    <https://www.runscope.com/radar/qmovuxkrhtws/f95ac15f-3f22-46c3-8f1a-1001fbf8fb66/history/6a35fabf-5ce5-4e48-a13f-7292b1bd3cc5>

## Next steps

Once you have a SCIM server that passes all of the Runscope tests,
you will want to do the following things:

1.  Consider using Runscope to monitor your SCIM server.
    
    Once you have a test suite that passes, you should consider
    having Runscope run your SCIM test suite on a schedule and alert
    you if the test suite fails.
2.  Follow the steps in the "Submitting to Okta" section of this
    guide.
    
    In particular, you will want make sure that the Profile 
    Attributes and Attribute Mappings in your Okta application show
    only the attributes and mappings that your SCIM server supports.

# Required SCIM Capabilities

Okta supports provisioning to both SCIM 1.1 and SCIM 2.0 APIs.

If you haven't implemented SCIM, Okta recommends that you implement
SCIM 2.0.

Okta implements SCIM 2.0 as described in RFCs [7642](https://tools.ietf.org/html/rfc7642), [7643](https://tools.ietf.org/html/rfc7643), [7644](https://tools.ietf.org/html/rfc7644).

If you are writing a SCIM implementation for the first time, an
important part of the planning process is determining which of
Okta's provisioning features your SCIM API can or should support and
which features you do not need to support.

Specifically, you do not need to implement the SCIM 2.0
specification fully to work with Okta. At a minimum, Okta requires that
your SCIM 2.0 API implement the features described below:

## Base URL

The API endpoint for your SCIM API **MUST** be secured via [TLS](https://tools.ietf.org/html/rfc5246)
(`https://`), Okta *does not* connect to unsecured API endpoints.

You can choose any Base URL for your API endpoint. If you
are implementing a brand new SCIM API, we suggest using `/scim/v2`
as your Base URL; for example: `https://example.com/scim/v2` -
however, you must support the URL structure described in the
["SCIM Endpoints and HTTP Methods" section of RFC7644](https://tools.ietf.org/html/rfc7644#section-3.2).

## Authentication

Your SCIM API **MUST** be secured against anonymous access. At the
moment, Okta supports authentication against SCIM APIs with one of
the following methods:

1.  [OAuth 2.0 Authorization Code Grant Flow](https://tools.ietf.org/html/rfc6749#section-4.1)
2.  [Basic Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication)
3.  Custom HTTP Header

## Basic User Schema

Your service must be capable of storing the following four user
attributes:

1.  User ID (`userName`)
2.  First Name (`name.givenName`)
3.  Last Name (`name.familyName`)
4.  Email (`emails`)

Note that Okta supports more than the four user attributes listed
above. However, these four attributes are the base attributes that
you must support.  The full user schema for SCIM 2.0 is described
in [section 4 of RFC 7643](https://tools.ietf.org/html/rfc7643#section-4).

> **Best Practice:** Keep your User ID distinct from the User Email
> Address. Many systems use an email address as a user identifier,
> but this is not recommended, as email addresses often change. Using
> a unique User ID to identify user resources prevents future
> complications.

If your service supports user attributes beyond those four base
attributes, add support for those additional
attributes to your SCIM API. In some cases, you might need to
configure Okta to map non-standard user attributes into the user
profile for your application.

Included in this git repository is a sample application written in
Python/Flask, this sample application implements SCIM 2.0. Below is
how this sample application defines these attributes:

    userName = db.Column(db.String(250),
                         unique=True,
                         nullable=False,
                         index=True)
    familyName = db.Column(db.String(250))
    middleName = db.Column(db.String(250))
    givenName = db.Column(db.String(250))

In addition to the basic user schema user attributes described
above, your SCIM API must also have a unique identifier for each
user resource and should also support marking resources as "active"
or "inactive."

In the SCIM specification, the `id` attribute is used to uniquely
identify resources. [Section 3.1](//tools.ietf.org/html/rfc7643#section-3.1) of [RFC 7643](https://tools.ietf.org/html/rfc7643) provides more details
on the `id` attribute:

> A unique identifier for a SCIM resource as defined by the service
> provider.  Each representation of the resource MUST include a
> non-empty "id" value.  This identifier MUST be unique across the
> SCIM service provider's entire set of resources.  It MUST be a
> stable, non-reassignable identifier that does not change when the
> same resource is returned in subsequent requests.  The value of
> the "id" attribute is always issued by the service provider and
> MUST NOT be specified by the client.  The string "bulkId" is a
> reserved keyword and MUST NOT be used within any unique identifier
> value.  The attribute characteristics are "caseExact" as "true", a
> mutability of "readOnly", and a "returned" characteristic of
> "always".

Our sample application defines `id` as a UUID, since
[RFC 7643](https://tools.ietf.org/html/rfc7643) requires that "this identifier MUST be unique across the
SCIM service provider's entire set of resources."

    id = db.Column(db.String(36), primary_key=True)

**Note:** Your SCIM API can use anything as an `id`, provided that the `id`
uniquely identifies reach resource, as described in [section 3.1](https://tools.ietf.org/html/rfc7643#section-3.1) of
[RFC 7643](https://tools.ietf.org/html/rfc7643).

Finally, your SCIM API must also support marking a resource as
"active" or "inactive."

In our sample application, each user resource has a Boolean
"active" attribute which is used to mark a user resource as
"active" or "inactive":

    active = db.Column(db.Boolean, default=False)

## Functionality

Below are a list of the SCIM API endpoints that your SCIM API must
support to work with Okta.

## Create Account: POST /Users

Your SCIM 2.0 API should allow the creation of a new user
account.  The four basic attributes listed above must be supported, along
with any additional attributes that your application supports.  If your
application supports entitlements, your SCIM 2.0 API should allow
configuration of those as well.

An HTTP POST to the `/Users` endpoint must return an immutable or 
system ID of the user (`id`) must be returned to Okta.

Okta will call this SCIM API endpoint under the following circumstances:

-   **Direct assignment**
    
    When a user is assigned to an Okta application using the "Assign
    to People" button in the "People" tab.
-   **Group-based assignment**
    
    When a user is added to a group that is assigned to an Okta
    application. For example, an Okta administrator can assign a
    group of users to an Okta application using the "Assign to
    Groups" button in the "Groups" tab. When a group is assigned to an
    Okta application, Okta sends updates to the assigned
    application when a user is added or removed from that group.

Below is an example demonstrating how the sample application handles account
creation:

    @app.route("/scim/v2/Users", methods=['POST'])
    def users_post():
        user_resource = request.get_json(force=True)
        user = User(user_resource)
        user.id = str(uuid.uuid4())
        db.session.add(user)
        db.session.commit()
        rv = user.to_scim_resource()
        send_to_browser(rv)
        resp = flask.jsonify(rv)
        resp.headers['Location'] = url_for('user_get',
                                           user_id=user.userName,
                                           _external=True)
        return resp, 201

Note: `force=True` is set because Okta sends
`application/scim+json` as the `Content-Type` and the `.get_json()`
method expects `application/json`.

For more information on user creation via the `/Users` SCIM
endpoint, see [section 3.3](https://tools.ietf.org/html/rfc7644#section-3.3) of the [SCIM 2.0 Protocol Specification](https://tools.ietf.org/html/rfc7644).

## Read list of accounts with search: GET /Users

Your SCIM 2.0 API must support the ability for Okta to retrieve
users (and entitlements like groups if available) from your
service.  This allows Okta to fetch all user resources in an
efficient manner for reconciliation and initial bootstrap (to
get all users from your app into the system).

Here is an example using `curl` to make a GET request to `/Users`:

    curl https://joel-scim.herokuapp.com/scim/v2/Users

Below is how the sample application handles listing user resources,
with support for filtering and pagination:

    @app.route("/scim/v2/Users", methods=['GET'])
    def users_get():
        query = User.query
        request_filter = request.args.get('filter')
        match = None
        if request_filter:
            match = re.match('(\w+) eq "([^"]*)"', request_filter)
        if match:
            (search_key_name, search_value) = match.groups()
            search_key = getattr(User, search_key_name)
            query = query.filter(search_key == search_value)
        count = int(request.args.get('count', 100))
        start_index = int(request.args.get('startIndex', 1))
        if start_index < 1:
            start_index = 1
        start_index -= 1
        query = query.offset(start_index).limit(count)
        total_results = query.count()
        found = query.all()
        rv = ListResponse(found,
                          start_index=start_index,
                          count=count,
                          total_results=total_results)
        return flask.jsonify(rv.to_scim_resource())

> If you want to see the SQL query that SQLAlchemy is using for
> the query, add this code after the `query` statement that you want
> to see: `print(str(query.statement))`

For more details on the `/Users` SCIM endpoint, see [section 3.4.2](https://tools.ietf.org/html/rfc7644#section-3.4.2)
of the [SCIM 2.0 Protocol Specification](https://tools.ietf.org/html/rfc7644).

## Read Account Details: GET /Users/{id}

Your SCIM 2.0 API must support fetching of users by user id.

Below is how the sample application handles returning a user resource
by `user_id`:

    @app.route("/scim/v2/Users/<user_id>", methods=['GET'])
    def user_get(user_id):
        try:
            user = User.query.filter_by(id=user_id).one()
        except:
            return scim_error("User not found", 404)
        return render_json(user)

If we don't find a user, we return a HTTP status 404 ("Not found")
with SCIM error message.

For more details on the `/Users/{id}` SCIM endpoint, see [section 3.4.1](https://tools.ietf.org/html/rfc7644#section-3.4.1)
of the [SCIM 2.0 Protocol Specification](https://tools.ietf.org/html/rfc7644).

## Update Account Details: PUT /Users/{id}

When a profile attribute of a user assigned to your SCIM enabled
application is changed, Okta will do the following:

-   Make a GET request against `/Users/{id}` on your SCIM API for the
    user to update.
-   Take the resource returned from your SCIM API and update only the
    attributes that need to be updated.
-   Make a PUT request against `/Users/{id}` in your SCIM API with
    the updated resource as the payload.

Examples of things that can cause changes to an Okta user profile
are:

-   A change in profile a master like Active Directory or a Human Resource
    Management Software system.
-   A direct change of a profile attribute in Okta for a local user.

Below is how the sample application handles account profile updates:

    @app.route("/scim/v2/Users/<user_id>", methods=['PUT'])
    def users_put(user_id):
        user_resource = request.get_json(force=True)
        user = User.query.filter_by(id=user_id).one()
        user.update(user_resource)
        db.session.add(user)
        db.session.commit()
        return render_json(user)

For more details on updates to the `/Users/{id}` SCIM endpoint, see [section 3.5.1](https://tools.ietf.org/html/rfc7644#section-3.5.1)
of the [SCIM 2.0 Protocol Specification](https://tools.ietf.org/html/rfc7644).

## Deactivate Account: PATCH /Users/{id}

Deprovisioning is perhaps the most important reason customers why
customers ask that your application supports provisioning
with Okta. Your SCIM API should support account deactivation via a
PATCH to `/Users/{id}` where the payload of the PATCH request sets
the `active` property of the user to `false`.

Your SCIM API should allow account updates at the attribute level.
If entitlements are supported, your SCIM API should also be able
to update entitlements based on SCIM profile updates.

Okta will send a PATCH request to your application to deactivate a
user when an Okta user is "unassigned" from your
application. Examples of when this happen are as follows:

-   A user is manually unassigned from your application.
-   A user is removed from a group which is assigned to your application.
-   When a user is deactivated in Okta, either manually or via 
    by an external profile master like Active Directory or a Human
    Resource Management Software system.

Below is how the sample application handles account deactivation:

    @app.route("/scim/v2/Users/<user_id>", methods=['PATCH'])
    def users_patch(user_id):
        patch_resource = request.get_json(force=True)
        for attribute in ['schemas', 'Operations']:
            if attribute not in patch_resource:
                message = "Payload must contain '{}' attribute.".format(attribute)
                return message, 400
        schema_patchop = 'urn:ietf:params:scim:api:messages:2.0:PatchOp'
        if schema_patchop not in patch_resource['schemas']:
            return "The 'schemas' type in this request is not supported.", 501
        user = User.query.filter_by(id=user_id).one()
        for operation in patch_resource['Operations']:
            if 'op' not in operation and operation['op'] != 'replace':
                continue
            value = operation['value']
            for key in value.keys():
                setattr(user, key, value[key])
        db.session.add(user)
        db.session.commit()
        return render_json(user)

For more details on user attribute updates to `/Users/{id}` SCIM endpoint, see [section 3.5.2](https://tools.ietf.org/html/rfc7644#section-3.5.2)
of the [SCIM 2.0 Protocol Specification](https://tools.ietf.org/html/rfc7644).

## Filtering on `id`, `userName`, and `emails`

Being able to filter results by the `id`, `userName`, or `emails`
attributes is a critical part of working with Okta. 

Your SCIM API must be able to filter users by `userName` and should
also support filtering by `id` and `emails`. Filtering support
is required because most provisioning actions require the ability
for Okta to determine if a user resource exists on your system. The filter Okta generates will be based on the `userName` field, following the pattern "userName eq "..." ".

Consider the scenario where an Okta customer with thousands of
users has a provisioning integration with your system, which also
has thousands of users. When an Okta customer adds a new user to
their Okta organization, Okta needs a way to determine quickly if a
resource for the newly created user was previously created on your
system.

Examples of filters that Okta might send to your SCIM API are as
follows:

> userName eq "jane.doe"

> userName eq "jane.doe@example.com"

At the moment, Okta only supports the `eq` filter operator. However, the
[filtering capabilities](https://tools.ietf.org/html/rfc7644#section-3.4.2.2) described in the SCIM 2.0 Protocol Specification are
much more complicated.

Here is an example of how to implement SCIM filtering in Python:

    request_filter = request.args.get('filter')
    match = None
    if request_filter:
        match = re.match('(\w+) eq "([^"]*)"', request_filter)
    if match:
        (search_key_name, search_value) = match.groups()
        search_key = getattr(User, search_key_name)
        query = query.filter(search_key == search_value)

Note: The sample code above only supports the `eq` operator. We
recommend that you add support for all of the filter operators
described in [table 3](https://tools.ietf.org/html/rfc7644#page-18) of the SCIM 2.0 Protocol Specification.

For more details on filtering in SCIM 2.0, see [section 3.4.2.2](https://tools.ietf.org/html/rfc7644#section-3.4.2.2)
of the [SCIM 2.0 Protocol Specification](https://tools.ietf.org/html/rfc7644).

## Filtering on `externalId`

In addition to supporting filtering on `id`, `userName`, and
`emails`, your application should also support filtering on
`externalId`.

Okta will use the `externalId` to determine if your application
already has an account. `externalId` is used as a stable identifier
for users, because the `userName` and email addresses for a user
can change.

Here is an example of an `externalId` filter that might be sent to
your application:

> externalId eq "00u1abcdefGHIJKLMNOP"

Note: The sample application included in this project does not yet
demonstrate how to implement storing and filtering by
`externalId`. However, Okta strongly recommends that your SCIM
implementation supports storing and filtering by `externalId`. For
details on supporting `externalId`, see
[section 3.1](https://tools.ietf.org/html/rfc7643#section-3.1) of [RFC 7643](https://tools.ietf.org/html/rfc7643). Quoted below:

> [externalId is] A String that is an identifier for the resource
> as defined by the provisioning client.  The "externalId" may
> simplify identification of a resource between the provisioning
> client and the service provider by allowing the client to use a
> filter to locate the resource with an identifier from the
> provisioning domain, obviating the need to store a local mapping
> between the provisioning domain's identifier of the resource and
> the identifier used by the service provider.  Each resource MAY
> include a non-empty "externalId" value.  The value of the
> "externalId" attribute is always issued by the provisioning
> client and MUST NOT be specified by the service provider.  The
> service provider MUST always interpret the externalId as scoped
> to the provisioning domain.  While the server does not enforce
> uniqueness, it is assumed that the value's uniqueness is
> controlled by the client setting the value.

When adding support for `externalId` filtering to your application,
we suggest that you use OAuth2.0 for authentication and use the
OAuth2.0 `client_id` to scope the `externalId` to the provisioning
domain.

## Resource Paging

When returning large lists of resources, your SCIM implementation
must support pagination using a *limit* (`count`) and *offset*
(`startIndex`) to return smaller groups of resources in a request.

Below is an example of a `curl` command that makes a request to the
`/Users/` SCIM endpoint with `count` and `startIndex` set:

    $ curl 'https://scim-server.example.com/scim/v2/Users?count=1&startIndex=1'
    {
      "Resources": [
        {
          "active": false, 
          "id": 1, 
          "meta": {
            "location": "http://scim-server.example.com/scim/v2/Users/1", 
            "resourceType": "User"
          }, 
          "name": {
            "familyName": "Doe", 
            "givenName": "Jane", 
            "middleName": null
          }, 
          "schemas": [
            "urn:ietf:params:scim:schemas:core:2.0:User"
          ], 
          "userName": "jane.doe@example.com"
        }
      ], 
      "itemsPerPage": 1, 
      "schemas": [
        "urn:ietf:params:scim:api:messages:2.0:ListResponse"
      ], 
      "startIndex": 0, 
      "totalResults": 1
    }

> Note: When returning a paged resource, your API should return a
> capitalized `Resources` JSON key ("Resources"), however Okta will also
> support a lowercase string ("resources"). Okta will also accept
> lowercased JSON strings for the keys of child nodes inside
> `Resources` object ("startindex", "itemsperpage", "totalresults", etc)

One way to handle paged resources is to have your database do the
paging for you. Here is how the sample application handles
pagination with SQLAlchemy:

    count = int(request.args.get('count', 100))
    start_index = int(request.args.get('startIndex', 1))
    if start_index < 1:
        start_index = 1
    start_index -= 1
    query = query.offset(start_index).limit(count)

Note: This code subtracts "1" from the
`startIndex`, because `startIndex` is [1-indexed](https://tools.ietf.org/html/rfc7644#section-3.4.2) and
the OFFSET statement is [0-indexed](http://www.postgresql.org/docs/8.0/static/queries-limit.html).

For more details pagination on a SCIM 2.0 endpoint, see [section 3.4.2.4](https://tools.ietf.org/html/rfc7644#section-3.4.2.4)
of the [SCIM 2.0 Protocol Specification](https://tools.ietf.org/html/rfc7644).

## Rate Limiting

Some customer actions, such as adding hundreds of users at once,
causes large bursts of HTTP requests to your SCIM API. For
scenarios like this, we suggest that your SCIM API return rate
limiting information to Okta via the [HTTP 429 Too Many Requests](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#429)
status code. This helps Okta throttle the rate at which SCIM
requests are made to your API.

For more details on rate limiting requests using the HTTP 429
status code, see [section 4](https://tools.ietf.org/html/rfc6585#section-4) of [RFC 6585](https://tools.ietf.org/html/rfc6585).

## SCIM Features Not Implemented by Okta

The following features are currently not supported by Okta:

### DELETE /Users/{id}

Deleting users via DELETE is covered in
[section 3.6](https://tools.ietf.org/html/rfc7644#section-3.6) of the [SCIM 2.0 Protocol Specification](https://tools.ietf.org/html/rfc7644).

Okta users are never **deleted**; they are **deactivated**
instead. Because of this, Okta never makes an HTTP DELETE
request to a user resource on your SCIM API. Instead, Okta makes
an HTTP PATCH request to set the `active` setting to `false`.

### Querying with POST

The ability to query users with a POST request is described in
[section 3.4.3](https://tools.ietf.org/html/rfc7644#section-3.4.3) of the [SCIM 2.0 Protocol Specification](https://tools.ietf.org/html/rfc7644).

Querying using POST is sometimes useful if your query contains 
[personally identifiable information](https://en.wikipedia.org/wiki/Personally_identifiable_information) that would be exposed in
system logs if used query parameters with a GET request.

Okta currently does not support this feature.

### Bulk Operations

The ability to send a large collection of resource operations in a
single request is covered in
[section 3.7](https://tools.ietf.org/html/rfc7644#section-3.7) of the [SCIM 2.0 Protocol Specification](https://tools.ietf.org/html/rfc7644).

Okta currently does not support this feature and makes
one request per resource operation.

### "/Me" Authenticated Subject Alias

The `/Me` URI alias for the current authenticated subject is
covered in
[section 3.11](https://tools.ietf.org/html/rfc7644#section-3.11) of the [SCIM 2.0 Protocol Specification](https://tools.ietf.org/html/rfc7644).

Okta does not currently make SCIM requests with the `/Me` URI alias.

### /Groups API endpoint

Okta currently does not support using the `/Groups` endpoint of a SCIM
API. When support is added for the `/Groups` endpoint, Okta plans
on using the following HTTP requests against the `/Groups` endpoint:

-   Read list of Groups: GET /Groups

-   Create Group: POST /Groups

-   Read Group detail: GET /Groups/{id}

-   Delete Group: DELETE /Groups/{id}

### /Schemas API endpoint

Okta does not currently make queries against the `/Schemas`
endpoint, but this functionality is being planned.

Here is the specification for the `/Schemas` endpoint, from
[section 4](https://tools.ietf.org/html/rfc7644#section-4) of [RFC 7644](https://tools.ietf.org/html/rfc7644):

> An HTTP GET to this endpoint is used to retrieve information about
> resource schemas supported by a SCIM service provider.  An HTTP
> GET to the endpoint "/Schemas" SHALL return all supported schemas
> in ListResponse format (see Figure 3).  Individual schema
> definitions can be returned by appending the schema URI to the
> /Schemas endpoint.  For example:
> 
> /Schemas/urn:ietf:params:scim:schemas:core:2.0:User
> 
> The contents of each schema returned are described in Section 7 of
> RFC7643.  An example representation of SCIM schemas may be found
> in Section 8.7 of RFC7643.

### /ServiceProviderConfig API endpoint

Okta does not currently make queries against the `/ServiceProviderConfig`
endpoint, but this functionality is being planned.

Here is the specification for the `/ServiceProviderConfig` endpoint, from
[section 4](https://tools.ietf.org/html/rfc7644#section-4) of [RFC 7644](https://tools.ietf.org/html/rfc7644):

> An HTTP GET to this endpoint will return a JSON structure that
> describes the SCIM specification features available on a service
> provider.  This endpoint SHALL return responses with a JSON object
> using a "schemas" attribute of
> "urn:ietf:params:scim:schemas:core:2.0:ServiceProviderConfig".
> The attributes returned in the JSON object are defined in
> Section 5 of RFC7643.  An example representation of SCIM service
> provider configuration may be found in Section 8.5 of RFC7643.

### Filtering on `meta.lastModified`

Okta does not currently make queries for resources using
`meta.lastModified` as part of a filter expression.

Okta plans to add functionality to fetch incremental updates
from SCIM APIs by querying for resources using a filter expression
that requests resources which were updated since the last update.

This will likely be done using the `gt` filter operator. For
example:

> filter=meta.lastModified gt "2011-05-13T04:42:34Z"

# Submitting to Okta

Once you have SCIM provisioning working in your Okta application,
the last thing to do before submitting your
application to Okta is the following:

1.  Check the Profile Attributes for your application.
2.  Check the Attribute Mappings for your application.

## Check the Profile Attributes for Your Application

Before submitting your application to Okta, you should check the
User Attributes to make sure that the attributes are set to what
you would want your users to see.

Check your Profile Attributes as follows:

-   From the "Admin" section in Okta, open the settings page for your
    application.
-   In the "Provisioning" tab, scroll to the bottom and click the
    "Edit Attributes" button in the "User Attributes" section.
-   A "Profile Editor" screen will open, check the following settings:
    -   The "Display name" for the application
    -   The "Description"
    -   In the "Attributes" section, remove all attributes that are not
        supported by your application.
        
        This is an important step! Your users will get confused if your
        application appears to support attributes that are not
        supported by your SCIM API.
        
        You can delete an attribute by selecting an attribute, then
        clicking the "Delete" button located in right hand attribute details pane.
    -   After you've removed all unsupported attributes from the
        "Attributes" section, check through the remaining
        attributes. In particular, check that the following properties
        for each attribute are what you expect them to be:
        -   Display name
        -   Variable name
        -   External name
        -   External namespace
        -   Data type
        -   Attribute required
            Only mark an attribute as required if one of the following is
            true:
            1.  The attribute **must** be set for your provisioning
                integration to work.
            2.  An Okta administrator must populate a value for
                this attribute.
        -   Scope
    -   If the settings for any of your supported user attributes are
        incorrect, contact Okta and request the correction for your
        attribute.
    
    Click the blue "Back to profiles" link when you are done checking
    the Profile Attributes for your application.

## Check the Attribute Mappings for Your Application

The last step for you to complete before submitting your
application to Okta is to check the User Profile Mappings for your
application. These mappings are what determine how profile
attributes are mapped to and from your application to an Okta
user's Universal Directory profile.

To check the User Profile Mappings for your application, do the
following:

-   From the "Admin" section in Okta, open the settings page for your
    application.
-   In the "Provisioning" tab, scroll to the bottom and click the
    "Edit Mappings" button in the "Attribute Mappings" section.
-   Check that each mapping is what you would expect it to be. Be
    sure to check both of the followign:
    1.  From your application to Okta.
    2.  From Okta to your application.

## Contact Okta

To submit your application, follow the instructions in the SCIM Developer Program section ["Submit for Okta Review."](scim_developer_program.html#submit-for-okta-review)

# Appendix: Details on the example SCIM server

Included in this git repository is an example SCIM server written in
Python. 

This example SCIM server demonstrates how to implement a basic SCIM
server that can create, read, update, and deactivate Okta users.

The "Required SCIM Capabilities" section has the sample code that
handles the HTTP requests to this sample application, below we
describe the rest of code used in the example.

## How to run

This example code was written for **Python 2.7** and does not
currently work with Python 3.

Here is how to run the example code on your machine:

First, start by doing a `git checkout` of this repository, then
`cd` to directory that `git` creates. Then, do the following:

1.  `cd` to the directory you just checked out:
    
        $ cd okta-scim-beta
2.  Create an isolated Python environment named "venv" using [virtualenv](http://docs.python-guide.org/en/latest/dev/virtualenvs/):
    
        $ virtualenv venv
3.  Next, activate the newly created virtualenv:
    
        $ source venv/bin/activate
4.  Then, install the dependencies for the sample SCIM server using
    Python's ["pip" package manager](https://en.wikipedia.org/wiki/Pip_%28package_manager%29):
    
        $ pip install -r requirements.txt
5.  Finally, start the example SCIM server using this command:
    
        $ python scim-server.py

## Introduction

Below are instructions for writing a SCIM server in Python, using
Flask and SQLAlchemy.

A completed version of this example server is available in this git
repository in the file named `scim-server.py`.

## Imports

We start by importing the Python packages that the SCIM server will
use:

    import os
    import re
    import uuid
    
    from flask import Flask
    from flask import render_template
    from flask import request
    from flask import url_for
    from flask_socketio import SocketIO
    from flask_socketio import emit
    from flask_sqlalchemy import SQLAlchemy
    import flask

## Setup

`re` adds support for regular expression parsing, `flask` adds the Flask
web framework, `flask_socketio` and `flask_sqlalchemy` add a idiomatic support for
their respective technologies to Flask.

Next we initialize Flask, SQLAlchemy, and SocketIO:

    app = Flask(__name__)
    database_url = os.getenv('DATABASE_URL', 'sqlite:///test-users.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    db = SQLAlchemy(app)
    socketio = SocketIO(app)

## SQLAlchemy support for the "users" table:

Below is the class that SQLAlchemy uses to give us easy access to
the "users" table.

The `update` method is used to "merge" or "update" a new User object
into an existing User object. This is used to simplify the code for
the code that handles PUT calls to `/Users/{id}`.

The `to_scim_resource` method is used to turn a User object into
a [SCIM "User" resource schema](https://tools.ietf.org/html/rfc7643#section-4.1).

    class User(db.Model):
        __tablename__ = 'users'
        id = db.Column(db.String(36), primary_key=True)
        active = db.Column(db.Boolean, default=False)
        userName = db.Column(db.String(250),
                             unique=True,
                             nullable=False,
                             index=True)
        familyName = db.Column(db.String(250))
        middleName = db.Column(db.String(250))
        givenName = db.Column(db.String(250))
    
        def __init__(self, resource):
            self.update(resource)
    
        def update(self, resource):
            for attribute in ['userName', 'active']:
                if attribute in resource:
                    setattr(self, attribute, resource[attribute])
            for attribute in ['givenName', 'middleName', 'familyName']:
                if attribute in resource['name']:
                    setattr(self, attribute, resource['name'][attribute])
    
        def to_scim_resource(self):
            rv = {
                "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
                "id": self.id,
                "userName": self.userName,
                "name": {
                    "familyName": self.familyName,
                    "givenName": self.givenName,
                    "middleName": self.middleName,
                },
                "active": self.active,
                "meta": {
                    "resourceType": "User",
                    "location": url_for('user_get',
                                        user_id=self.id,
                                        _external=True),
                    # "created": "2010-01-23T04:56:22Z",
                    # "lastModified": "2011-05-13T04:42:34Z",
                }
            }
            return rv

## Support for SCIM Query resources

We also define a `ListResponse` class, which is used to return an
array of SCIM resources into a
[Query Resource](https://tools.ietf.org/html/rfc7644#section-3.4.2).

    class ListResponse():
        def __init__(self, list, start_index=1, count=None, total_results=0):
            self.list = list
            self.start_index = start_index
            self.count = count
            self.total_results = total_results
    
        def to_scim_resource(self):
            rv = {
                "schemas": ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
                "totalResults": self.total_results,
                "startIndex": self.start_index,
                "Resources": []
            }
            resources = []
            for item in self.list:
                resources.append(item.to_scim_resource())
            if self.count:
                rv['itemsPerPage'] = self.count
            rv['Resources'] = resources
            return rv

## Support for SCIM error messages

Given a `message` and HTTP `status_code`, this will return a Flask
response with the appropriately formatted SCIM error message.

By default, this function will return an HTTP status of "[HTTP 500
Internal Server Error](https://tools.ietf.org/html/rfc2068#section-10.5.1)". However you should return a more specific
`status_code` when possible.

See [section 3.12](https://tools.ietf.org/html/rfc7644#section-3.12) of [RFC 7644](https://tools.ietf.org/html/rfc7644) for details.

    def scim_error(message, status_code=500):
        rv = {
            "schemas": ["urn:ietf:params:scim:api:messages:2.0:Error"],
            "detail": message,
            "status": str(status_code)
        }
        return flask.jsonify(rv), status_code

## Socket.IO support

This sample application makes use of Socket.IO to give you a "real
time" view of SCIM requests that Okta makes to this sample
application.

When you load the sample application (the "/" route), your browser
will be sent a web application that uses Socket.IO to display
updates without the need for you to reload the page:

    @app.route('/')
    def hello():
        return render_template('base.html')

This page is updated using the functions below:

-   `send_to_browser` is syntactic sugar that will `emit` Socket.IO
    messages to the browser with the proper `broadcast` and
    `namespace` settings.
-   `render_json` is more syntactic sugar which is used to render
    JSON replies to Okta's SCIM client and `emit` the SCIM resource
    to Socket.IO at the same time.
-   `test_connect` is the function called with a browser first starts
    up Socket.IO, it returns a list of currently active users to the
    browser via Socket.IO.
-   `test_disconnect` is a stub that shows how to handle Socket.IO
    "disconnect" messages.

The code described above is as follows:

    def send_to_browser(obj):
        socketio.emit('user',
                      {'data': obj},
                      broadcast=True,
                      namespace='/test')
    
    
    def render_json(obj):
        rv = obj.to_scim_resource()
        send_to_browser(rv)
        return flask.jsonify(rv)
    
    
    @socketio.on('connect', namespace='/test')
    def test_connect():
        for user in User.query.filter_by(active=True).all():
            emit('user', {'data': user.to_scim_resource()})
    
    
    @socketio.on('disconnect', namespace='/test')
    def test_disconnect():
        print('Client disconnected')

## Socket.IO application

Below is the JavaScript that powers the Socket.IO application
described above. For the full contents of the HTML that this
JavaScript is part of, see the `base.html` file in the `templates`
directory of this project.

    $(document).ready(function () {
        namespace = '/test'; // change to an empty string to use the global namespace
        var uri = 'https://' + document.domain  + namespace;
        console.log(uri);
        var socket = io.connect(uri);
    
        socket.on('user', function(msg) {
            console.log(msg);
            var user = msg.data;
            var user_element = '#' + user.id
            var userRow = '<tr id="' + user.id + '"><td>' + user.id + '</td><td>' + user.name.givenName + '</td><td>' + user.name.familyName + '</td><td>' + user.userName + '</td></tr>';
            if($(user_element).length && user.active) {
                $(user_element).replaceWith(userRow);
            } else if (user.active) {
                $('#users-table').append(userRow);
            }
    
            if($(user_element).length && user.active) {
                $(user_element).show();
            }
            if($(user_element).length && !user.active) {
                $(user_element).hide();
            }
        });
    });

## Support for running from the command line

This bit of code allows you to run the sample application by typing
`python scim-server.py` from your command line.

This code also includes a `try/catch` block that creates all tables
of the `User.query.one()` function throws an error (which should
only happen if the User table isn't defined.

    if __name__ == "__main__":
        try:
            User.query.one()
        except:
            db.create_all()
        app.debug = True
        socketio.run(app)

## Frequently Asked Questions (FAQ)

This FAQ covers both app publication and technical questions.

### App Publication Questions

- If I submit my app with a set of attributes, and then I want to add attributes during the testing phase of the app, is this acceptable?

    Yes. Do one of the following if you add attributes during the testing phase:
     
     * Add a new app instance in your dev org to test the new attributes.
     * Ask Support to upgrade their profile template.
     
- Once my app has been published, and I add additional attributes, how do I republish my app? Can I republish frequently?
  
    Yes, you can republish your app, but we recommend you don't do it frequently. Your app goes throught the QA process every time you add additional attributes.
  
- How long does it take for my submission to be reviewed and published?

    Review usually takes 48 hours, followed by QA which is usually another 48 hours. 
    We don't publish the app until one customer tests the app in their production environment and send us a email 
    saying that everything works and they recommend the integration.

### SCIM Technical Questions

-   What are the differences between SCIM 1.1 and 2.0?    
    
    | Section | SCIM 1.1 | SCIM 2.0 | Notes |
    | --- | --- | --- | --- |
    | Namespaces | <ul><li>urn:scim:schemas:core:1.0</li><li>urn:scim:schemas:extension:enterprise:1.0</li><ul> | <ul><li>urn:ietf:params:scim:schemas:core:2.0:User</li><li>urn:ietf:params:scim:schemas:extension:enterprise:2.0:User</li><ul> | Namespaces are different therefore 2.0 is not backwards compatible with 1.1 |
    | Service Provider Config Endpoint | /ServiceProviderConfig<b>s</b> | /ServiceProviderConfig | Notice 2.0 does NOT have an 's' at the end |
    | Patch Protocol | [Section 3.3.2](http://www.simplecloud.info/specs/draft-scim-api-01.html#edit-resource-with-patch) | [Section 3.5.2: Uses JSON Patch](https://tools.ietf.org/html/rfc7644#section-3.5.2) | |
    | Error Response Schema | [Section 3.9](http://www.simplecloud.info/specs/draft-scim-api-01.html#anchor6) | [Section 3.12](https://tools.ietf.org/html/rfc7644#section-3.12) | |
    | Reference Type | N/A | Supports ref type pointing to the full url of another SCIM Resource | |
    | Query by POST /search | N/A | [Section 3.4.3](https://tools.ietf.org/html/rfc7644#section-3.4.3) | |
-   What if the SCIM 1.1 spec isn't clear on a specific use case or
    scenario?
    
    Okta recommends looking at the SCIM 2.0 spec for more
    clarification.  The SCIM 2.0 spec provides more guidelines and
    examples for various scenario's.

-   Why do I need to implement the `type` attribute for attributes
    such as emails/phoneNumbers/addresses?
    
    The SCIM User Profile allows for an array of emails.  The only
    way to differentiate between emails is to use the `type`
    sub-attribute.  See [section 2.4](https://tools.ietf.org/html/rfc7643#section-2.4) of RFC 7643 for more details:
    
    > When returning multi-valued attributes, service providers SHOULD
    > canonicalize the value returned (e.g., by returning a value for the
    > sub-attribute "type", such as "home" or "work") when appropriate
    > (e.g., for email addresses and URLs).
    > 
    > Service providers MAY return element objects with the same "value"
    > sub-attribute more than once with a different "type" sub-attribute
    > (e.g., the same email address may be used for work and home) but
    > SHOULD NOT return the same (type, value) combination more than once
    > per attribute, as this complicates processing by the client.
    > 
    > When defining schema for multi-valued attributes, it is considered a
    > good practice to provide a type attribute that MAY be used for the
    > purpose of canonicalization of values.  In the schema definition for
    > an attribute, the service provider MAY define the recommended
    > canonical values (see Section 7).
-   I only have one email/phone number/address in my user profile.
    Do I need to implement the array of emails/phone
    numbers/addresses?
    
    Yes, the you must return these fields in an array, which is
    specified in the SCIM spec as a multi-valued attribute: [Section
    2.4](https://tools.ietf.org/html/rfc7643#section-2.4)

## Dependencies

Here is a detailed list of the dependencies that this example SCIM
server depends on, and what each dependency does.

| Name | Version | Description | License |
| ---- | --- | --- | --- |
| [Flask](http://flask.pocoo.org) | 0.10.1 | A web framework built with a small core and easy-to-extend philosophy. | [BSD 3-Clause](http://flask.pocoo.org/docs/0.10/license/#flask-license) |
| [Flask-SQLAlchemy](https://github.com/mitsuhiko/flask-sqlalchemy) | 2.1 | Adds SQLAlchemy support to Flask. | [BSD 3-Clause](https://github.com/mitsuhiko/flask-sqlalchemy/blob/master/LICENSE) |
| [Flask-SocketIO](https://github.com/miguelgrinberg/Flask-SocketIO) | 2.1 | Socket.IO integration for Flask applications. | [MIT](https://github.com/miguelgrinberg/Flask-SocketIO/blob/master/LICENSE) |
| [gunicorn](http://gunicorn.org/) | 19.4.5 | A pre-fork worker model HTTP server for WSGI. | [MIT](https://github.com/benoitc/gunicorn/blob/master/LICENSE) |
| [Jinja2](http://jinja.pocoo.org/docs/dev) | 2.8 | A modern and designer-friendly templating language. | [BSD 3-Clause](https://github.com/pallets/jinja/blob/master/LICENSE) |
| [MarkupSafe](http://www.pocoo.org/projects/markupsafe) | 0.23 | A library for Python that implements a unicode string. | [BSD 3-Clause](https://github.com/pallets/markupsafe/blob/master/LICENSE) |
| [SQLAlchemy](https://pypi.python.org/pypi/SQLAlchemy) | 1.0.12 | SQL toolkit and Object Relational Mapper. | [MIT](https://github.com/zzzeek/sqlalchemy/blob/master/LICENSE) |
| [Werkzeug](http://werkzeug.pocoo.org) | 0.11.4 | A WSGI utility library for Python. | [BSD 3-Clause](https://github.com/pallets/werkzeug/blob/master/LICENSE) |
| [itsdangerous](http://pythonhosted.org/itsdangerous) | 0.24 | Used to send data to untrusted environments. | [BSD 3-Clause](https://github.com/pallets/itsdangerous/blob/master/LICENSE) |
| [python-engineio](https://github.com/miguelgrinberg/python-engineio) | 0.8.8 | Implementation of the Engine.IO realtime server. | [MIT](https://github.com/miguelgrinberg/python-engineio/blob/master/LICENSE) |
| [python-socketio](https://github.com/miguelgrinberg/python-socketio) | 1.0 | Implementation of the Socket.IO realtime server. | [MIT](https://github.com/miguelgrinberg/python-socketio/blob/master/LICENSE) |
| [six](https://pypi.python.org/pypi/six) | 1.10.0 | Python 2 and 3 compatibility library. | [MIT](https://bitbucket.org/gutworth/six/src/2c12cd64ff0c7797bb30b0d466e902f7ecd6e562/LICENSE?at=default) |
| [wsgiref](https://pypi.python.org/pypi/wsgiref) | 0.1.2 | Provides validation support for WSGI. | [PSF or ZPL](https://pypi.python.org/pypi/wsgiref) |
| [psycopg2](http://initd.org/psycopg/) |  | Popular PostgreSQL adapter. | [LGPL or ZPL](http://initd.org/psycopg/license/) |

# License information

    Copyright © 2016, Okta, Inc.
    
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
        http://www.apache.org/licenses/LICENSE-2.0
    
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
