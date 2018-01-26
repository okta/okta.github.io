---
layout: docs_page
title: Importing Your Stormpath Data Into Okta
---

# Importing Your Stormpath Data Into Okta

The Stormpath Import tool is a script that takes the data that you exported from Stormpath and imports it into Okta using Okta's REST API. Once you have run the script, you will have to update your Stormpath Integration to use the Okta API.

<a name="prerequisites-and-capacity-planning"></a>
## Prerequisites and Capacity Planning

Before you begin the import process, you need the following:

- A decompressed local copy of the data you [exported from Stormpath](https://stormpath.com/export)
- An Okta account which you can sign-up for here: [https://developer.okta.com/signup/stormpath/](https://developer.okta.com/signup/stormpath/)
- The URL for your new Okta org (for example: https://{yourOktaDomain}.com)
- An Okta API token: [Instructions](/docs/api/getting_started/getting_a_token)

Once you have collected all these, start [the import process](#running-the-import).

> **NOTE:** If you are planning on migrating more than 20,000 users and/or 20 apps, you will need to get your limits increased. To increase your limit, email [developers@okta.com](mailto:developers@okta.com).

<a name="things-that-wont-migrate-and-known-caveats"></a>
## Things That Won't Migrate and Known Caveats

<a name="usernames-must-be-in-email-format"></a>
#### Usernames Must be in Email Format

The Stormpath Account `username` will be imported into the Okta User Profile `login` property. However, this value must be in email format: `example@domain.xyz`. If an Account's `username` is not in email format, the import tool will convert it into email format by appending `@emailnotprovided.local`. For example, a Stormpath `username` value of `susan` will become `susan@emailnotprovided.local` after the import into Okta. 

<a name="email-prefixes-must-be-unique"></a>
#### Email Prefixes Must be Unique

Username prefixes must be unique in order for Stormpath Accounts to be successfully imported. This is because users in Okta may sign in with either  their username prefix, or their full username (in email format). This means that from Okta's perspective `susan@example.com` and `susan` can both be used for sign in. 

This means that if a Stormpath Account shares an email prefix with one or more other Accounts, these Accounts will be imported, but the import tool will also log a warning to the console. Technically both users will still be able to log in, though they would only be able to do it with their full username (for example `susan@emailnotprovided.local`). The recommended options for this situation are:

- Let affected users know that they need to sign in with the email suffix, and after they sign in they should update their username to use their real email address
- Pre-process the Stormpath Accounts to use a different email suffix of your choosing
- Contact [developers@okta.com](mailto:developers@okta.com) to disable the requirement that usernames must be in the form of an email address.


<a name="custom-data-for-accounts-only"></a>
#### Custom Data For Accounts Only

Custom Data on any Stormpath resources other than Accounts is not imported. This means that Custom Data will not be imported from any of the following resources:

- Tenant
- Application
- Directory
- Group
- Organization

Account Custom Data will be imported according to the rules explained [below](#stormpath-custom-data).

<a name="account-links--duplicate-emails"></a>
#### Account Links & Duplicate Emails

Accounts are identified based on their email address and merged based on their Account Links. If multiple Accounts have the same email address and are linked with Account Links, then the import tool merges these Accounts into a single Okta User. There are two scenarios in which an Account is not imported:

- If there are multiple Stormpath Accounts with the same email address that are not linked with AccountLinks
- If there are multiple Stormpath Accounts with different email addresses that are linked with AccountLinks.

<a name="unverified-accounts"></a>
#### Unverified Accounts

Accounts with `status` value `UNVERIFIED` are not imported. For more information on the `UNVERIFIED` status in Stormpath, see [the Stormpath documentation](https://docs.stormpath.com/rest/product-guide/latest/accnt_mgmt.html#the-email-verification-workflow).

<a name="active-directory-and-other-ldap-directories"></a>
#### Active Directory and other LDAP Directories

LDAP Directories are not imported. For more information see [below](#stormpath-directories-ldap).

<a name="social-directory-caveats"></a>
#### Social Directory Caveats

Only Facebook, Google, and LinkedIn Directories are imported, as explained [below](#stormpath-directories-social). GitHub and Twitter Social Directories are not supported.

<a name="password-strength-caveats"></a>
#### Password Strength Caveats

The Stormpath Password Policy attributes `maxLength` and `minDiacritic` are not supported in Okta and will not be imported. For more information see the [Password Strength section below](#stormpath-directory-password-strength).

<a name="running-the-import"></a>
## Running the Import Tool

<a name="install"></a>
#### Install

The Import Tool is written in Node.js, and requires Node.js version 7 or higher.

```
npm install -g @okta/stormpath-migration
```

<a name="run"></a>
#### Run

```
import-stormpath --stormPathBaseDir /path/to/export/data --oktaBaseUrl https://{yourOktaDomain}.com --oktaApiToken yourApiToken
```


> NOTE: The import tool uses the Okta API and respects the API's rate limiting. If your import exceeds the rate limit at any time, the tool will automatically pause. It will then automatically resume once it is able to do so. These actions will be logged to the console.

<a name="required-args"></a>
#### Required Args

- `--stormPathBaseDir (-b)`: Root directory where your Stormpath tenant export data lives

    - Example: `--stormPathBaseDir ~/Desktop/stormpath-exports/683IDSZVtUQewtFoqVrIEe`

- `--oktaBaseUrl (-u)`: Base URL of your Okta tenant

    - Example: `--oktaBaseUrl https://{yourOktaDomain}.com`

- `--oktaApiToken (-t)`: API token for your Okta tenant (SSWS token)

    - Example: `--oktaApiToken 00gdoRRz2HUBdy06kTDwTOiPeVInGKpKfG-H4P_Lij`

<a name="optional-args"></a>
#### Optional Args

- `--customData (-d)`: Strategy for importing Stormpath Account custom data. Defaults to `flatten`.

    - Options

      - `flatten` - (Default) Add [custom user profile schema properties](/docs/api/resources/schemas#user-profile-schema-property-object) for each custom data property. Use this for simple custom data objects. For more information see [below](#custom-data-objects).
      - `stringify` - Stringify the Account custom data object into one `customData` [custom user profile schema property](/docs/api/resources/schemas#user-profile-schema-property-object). Use this for more complex custom data objects. For more information see [below](#custom-data-objects).
      - `exclude` - Exclude Stormpath Account custom data from the import

    - Example: `--customData stringify`

- `--concurrencyLimit (-c)`: Max number of concurrent transactions. Defaults to `30`. Higher values may speed up your import.

    - Example: `--concurrencyLimit 200`

- `--maxFiles (-f)`: Max number of files to parse per directory. You can use this to test an import without processing all of your files.
    - Example: `--maxFiles 500`

- `--logLevel (-l)`: Logging level. Defaults to `info`.

    - Options: `error`, `warn`, `info`, `verbose`, `debug`, `silly`
    - Example: `--logLevel verbose`

<a name="how-to-sanity-check-your-import"></a>
### How to Sanity Check Your Import

At a minimum, you should log in to your Okta Admin Console and check to make sure that the imported data looks the way you’d expect it to. For more information on this, see [How Stormpath Maps to Okta](#how-stormpath-maps-to-okta) below.

<a name="updating-your-application"></a>
### Updating Your Application

After you run the import tool and check the results, update your application to use the latest version of the Stormpath integration. It is very important that you read the changelog for your integration to understand how the upgrade will affect your application.

> NOTE: These integrations will not be supported after 2017-08-17. They will continue to work with the Okta API, but we are not planning any new feature development on these packages.

Integration | Version | Documentation
--- | --- | ---
Java Spring | 2.0.0-okta | Release candidates currently documented [here](https://github.com/stormpath/stormpath-sdk-java/blob/okta/OktaGettingStarted.md)
Java Spring Boot | 2.0.0-okta | Release candidates currently documented [here](https://github.com/stormpath/stormpath-sdk-java/blob/okta/OktaGettingStarted.md)
Node Express-Stormpath | 4 | Release candidates currently documented [here](https://github.com/stormpath/express-stormpath/blob/4.0.0/docs/changelog.rst).
ASP.NET 4.x | 4 | [Changelog](https://github.com/stormpath/stormpath-dotnet-owin-middleware/blob/master/changelog.md), [Migration Guide](https://github.com/stormpath/stormpath-dotnet-owin-middleware/blob/master/migrating.md)
ASP.NET Core | 4 | [Changelog](https://github.com/stormpath/stormpath-dotnet-owin-middleware/blob/master/changelog.md), [Migration Guide](https://github.com/stormpath/stormpath-dotnet-owin-middleware/blob/master/migrating.md)

> NOTE: If you are not using one of these integrations, then you will have to port the SDK functionality to use the Okta REST API.

Once you have updated your application and read the Changelog, you should try logging in with a known user to confirm the import has succeeded. If you are experiencing any problems, get in touch: [developers@okta.com](mailto:developers@okta.com)

<a name="debugging-the-tool"></a>
### Debugging the tool

If you experience problems with your import, try setting the `logLevel` higher, as documented [above](#optional-args). You can also read the import script's source code [on GitHub](https://github.com/okta/stormpath-migration
).

<a name="how-stormpath-maps-to-okta"></a>
## How Stormpath Maps to Okta

<a name="overview"></a>
### Overview

The Okta Organization (or Org) represents your private space inside Okta, which means it is equivalent to a Stormpath Tenant. Your Stormpath Accounts are modeled as Users inside Okta. The equivalent of the Stormpath Directory, Group, or Organization in Okta is the Group. In Okta, Groups can be thought of as sets of Users, and Users can be members of many different sets. Whereas in Stormpath your user Account belonged to a particular Directory, in Okta these associations are far more free-form. An Okta User can be associated with many different Groups simultaneously. For an example of how this can affect your user model, see [below](#changes-in-structure-and-hierarchy).

The import tool works by iterating over your Stormpath data and then uses the Okta API to create equivalent objects inside Okta. The table below shows how this mapping happens. Further information on this mapping can be found in dedicated sections below:

**Headline Resources**

Stormpath Resource | Okta Equivalent
--- | ---
Account | [User](/docs/api/resources/users#user-properties)
Application | [Client applications](/docs/api/resources/oauth-clients) acting as a client for an [OAuth 2.0 Authorization Server](/docs/api/resources/oauth2#authorization-operations)
Directory (Cloud) | [Group](/docs/api/resources/groups)
Directory (Social) | [Identity Provider](/docs/api/resources/idps) + [Group](/docs/api/resources/groups)
Directory (SAML) | [Identity Provider](/docs/api/resources/idps)
Directory (LDAP) | Not imported ([see below](#stormpath-directories-ldap))
Directory Password Strength | [Group Password Policy](/docs/api/resources/policy#GroupPasswordPolicy)
Group | [Group](/docs/api/resources/groups)
Organization | [Group](/docs/api/resources/groups)
Custom Data | [Custom Schema Properties](/docs/api/resources/schemas)


You may notice that many Stormpath resources are becoming Groups inside Okta. This is primarily because the Okta Groups API supports prefix searching. As part of the import process, your Okta entities will have relevant prefixes attached to them. So, to fetch all Groups that represent imported Stormpath Directories, the query would be:

```
GET /api/v1/groups?q=dir
```

More on this can be found in the [Import Naming Conventions](#import-naming-conventions) section below.

<a name="changes-in-structure-and-hierarchy"></a>
#### Changes in Structure and Hierarchy

Groups in Okta do not own Users, and Users in Okta can be associated with multiple Groups. This is very different from Stormpath's data model, where Directories own Accounts. Additionally, in Stormpath Accounts can be indirectly associated with other Account Stores. For example, in Stormpath, an Account "JSmith@ex.com" can be associated with Organization X indirectly, via a Directory that is directly associated with that Organization:

```
[JSmith@ex.com]--[DirectoryA]--[OrganizationX]
```

Because Okta has a relatively flat data model, the import process cannot preserve this structure and behavior. During import, Organization X and Directory A will become two Okta Groups, `org:OrganizationX` and `dir:DirectoryA`. The Account `JSmith@ex.com` will become a User with the same `name`, but that User cannot be indirectly associated with a Group via another Group. Instead, the User will be associated with both Groups:

```
        ┌--[org:OrganizationX]
        |
[JSmith@ex.com]--[dir:DirectoryA]
```

This means that in the future, if you add a new User to the `dir:DirectoryA` Group, they will not be automatically added to the `org:OrganizationX` Group. You will have to explicitly add the new User to both Groups.

<a name="import-naming-conventions"></a>
#### Import Naming Conventions

Each of the new Okta entities is named in a way that ties it to the Stormpath entity that is its source. The naming conventions are also designed for easy querying. More information about each entity's naming convention can be found below.

<a name="the-import-process"></a>
### The Import Process

Stormpath resources are imported in the following order:

1. Accounts (including their Custom Data)
2. Directories (including Password Policy)
3. Groups
4. Organizations
5. Applications

<a name="stormpath-accounts"></a>
### Stormpath Accounts

Stormpath Accounts are imported first. They are identified and merged based on their email address. If multiple Accounts have the same email address and are linked with AccountLinks, then the import tool will merge these Accounts into a single Okta User.

The information from a Stormpath Account is imported into the [Profile object](/docs/api/resources/users#profile-object) found inside an [Okta User](/docs/api/resources/users#user-properties).

Stormpath Account Attribute | Okta Profile Attribute
--- | ---
`username` | `login`
`email` | `email`
`givenName` | `firstName`
`middleName` | `middleName`
`lastName` | `surname`
`fullName` | `displayName`
`emailVerificationStatus` | `emailVerificationStatus` *

**This is a [Custom Schema Attribute](/docs/api/resources/schemas).*

User API Keys (up to 10) and Custom Data are also imported. API Keys are added as Custom Schema Properties to the Profile using this format:

```
"stormpathApiKey_{1-10}": "{apiKeyId}:{apiKeySecret}"
```

More information on custom data can be found [below](#custom-data-objects).

**Imported Passwords**

Your passwords are exported from Stormpath in a hashed form. On first login, Okta will use the imported password hash and then convert the password to Okta's secure password store for future logins.

**Imported User Naming Convention**

Okta Users created from Stormpath Accounts have a `login` inside the User's Profile that exactly matches the `username` found on the old Stormpath Account:

```
"login": "{SP_username}"
```

<a name="stormpath-custom-data"></a>
### Stormpath Custom Data

Only Custom Data associated with Accounts will be imported, although it can be skipped entirely if you wish. For more information on this, see [Running the Import](#running-the-import). If you choose to import Custom Data, the Okta import tool will scan all of the Custom Data on every Stormpath Account and create one Custom Profile Schema for all of the Users it is importing. However, Profile properties will only be returned if they have values. If they are blank, they will not be returned by the API.

What your imported Custom Data looks like depends primarily on whether is a simple `key:value` pair, or a more complex object.

<a name="simple-custom-data"></a>
##### Simple Custom Data

Any Custom Data attributes are imported and added to a user's profile as custom schema properties. For more on the Okta User Profile Schema go here: https://developer.okta.com/docs/api/resources/schemas#schema-properties

This Account Custom Data in Stormpath:

```
"customData": {
    "hello": "world"
}
```

Would be added to the User Profile in Okta:

```
"profile": {
    "login": "rob@example.com",
    "firstName": "Rob",
    "lastName": "Examplehousse",
    "hello": "world"
}
```

<a name="custom-data-objects"></a>
##### Custom Data Objects

Since Okta does not support complex objects in the User Profile, those are imported in one of two ways: either by flattening (default), or stringifying.

Here is an example of a complex object:

```
{
    foo: {
        bar: {
            baz: 'john'
        }
    }
}
```

And here it is after the two different migration strategies have been applied:

- **Flattened:** `"foo_bar_baz": "john"`
- **Stringified:** `"customData": "{"foo":{"bar":{"baz":"john"}}}"`

**Flattened**

In this case, all properties except the last one are concatenated into the attribute name, and the last value is preserved. This strategy is most likely to preserve the data structure, though two important points should be noted:

- Mixed-type arrays will be converted into arrays of strings
- Empty objects will not be imported

Because it will likely preserve the data structure, and also because allows for [search](/docs/api/resources/users#list-users-with-search), this is the default strategy that is used by the import tool.

**Stringified**

Stringifying serializes the entire object into a single string, which is then added as a value to the Profile attribute "customData". If there are multiple complex objects, they are all included in that string. Do not use this strategy if you will need to search your custom schema properties in Okta. If you do not have a consistent schema across all accounts, and one property may have multiple types values, e.g. a number or string, the stringify option may be a better choice (if search is not needed).

<a name="stormpath-directories-cloud"></a>
### Stormpath Directories (Cloud)

[Stormpath Cloud Directories](https://docs.stormpath.com/rest/product-guide/latest/accnt_mgmt.html#types-of-directories) are modeled as [Okta Groups](/docs/api/resources/groups#group-attributes). The Cloud Directories Password Strength object is modeled as an Okta Password Policy, about which you can find more [below](#stormpath-directory-password-strength). All Accounts that were associated with this Cloud Directory are now represented as Users inside Okta, and these Users are added to the new Group.

Stormpath Directory Attribute | Okta Group Profile Attribute
--- | ---
`name` | `name`
`description` | `description`

**Imported (Directory) Group Naming Convention**

Okta Groups made for imported Stormpath Cloud Directories use the `name` property inside the Okta Group's Profile object. The `name` is made up of a `dir:` prefix and the Stormpath Directory's `name`:

`"name": "dir:{SP_directoryName}"`

<a name="stormpath-directory-password-strength"></a>
#### Stormpath Directory Password Strength

The [Stormpath Cloud Directory Password Policy's Strength resource](https://docs.stormpath.com/rest/product-guide/latest/reference.html#password-strength) maps almost entirely to the [Okta Password Policy's Complexity object](/docs/api/resources/policy#PasswordComplexityObject), with the `preventReuse` attribute being mapped to the [Okta Password Policy's Age object](/docs/api/resources/policy#PasswordAgeObject).

There are a few points to note here:

- First of all, the Stormpath Password Policy attributes `maxLength` and `minDiacritic` are not supported in Okta and will not migrate. Also, the Stormpath attributes `minLowerCase`, `minUpperCase`, `minNumber`, and `minSymbol` all have integer values in Stormpath, specifying an occurrence requirement. Whereas in Okta, the equivalent properties take 0 or 1, meaning that the value must occur at least once. For more information see [here](/docs/api/resources/policy#PasswordComplexityObject).

Stormpath Directory Password Strength Attribute | Okta Complexity Attribute
--- | ---
`minLength` | `minLength`
`maxLength` | Not supported
`minLowerCase` | `minLowerCase`
`minUpperCase` | `minUpperCase`
`minNumeric` | `minNumber`
`minSymbol` | `minSymbol`
`minDiacritic` | Not supported
`preventReuse` | `historyCount`

**Imported Group Password Policy Naming Convention**

Okta Group Password Policies made for imported Stormpath Password Strength policies have a `name` property that is composed of the `name` of the Stormpath Directory that owns the source Password Strength, as well as a `-Policy` suffix:

```
"name": "{SP_directoryName}-Policy"
```

<a name="stormpath-directories-social"></a>
### Stormpath Directories (Social)

[Stormpath Social Directories](https://docs.stormpath.com/rest/product-guide/latest/auth_n.html#social-login-providers) (Facebook, Google, LinkedIn) are modeled as [Okta Identity Providers](/docs/api/resources/idps). Twitter and GitHub are not supported, so any Stormpath Social Directories for those providers are not imported.

Your Social providers Client ID and Secret are also imported into the IdP's `credentials` object.

Any Stormpath Accounts that were associated with your Stormpath Social Directory will have their equivalent Okta Users associated with the new Okta Identity Provider. Custom [Attribute Mappings](https://docs.stormpath.com/rest/product-guide/latest/reference.html#attribute-statement-mapping-rules) from your Stormpath Social Directory are added as [Custom Schema Properties](/docs/api/resources/schemas) to the relevant User Profiles. An Okta Group is also created and associated with the relevant Authorization Server. That Group shares the same `name` as the Identity Provider and is assigned Users as they are created during social login.

Stormpath Directory Attribute | Okta Group Profile Attribute
--- | ---
`name` | `name`
`description` | `description`

**Imported (Social) Identity Provider Naming Convention**

Identity Providers created for imported Stormpath Social Directories have a `name` property that is composed of a `dir:` prefix and the `name` of the Stormpath Directory:

```
"name": "dir:{SP_directoryName}"
```

<a name="stormpath-directories-saml"></a>
### Stormpath Directories (SAML)

Just like Stormpath Social Directories, [Stormpath SAML Directories](https://docs.stormpath.com/rest/product-guide/latest/auth_n.html#social-login-providers) are also modeled as [Okta Identity Providers](/docs/api/resources/idps). Your SAML signing certificate is also imported over, as well as the SSO Login URL.

Additionally, any attribute mappings that you defined in Stormpath are  imported as [Custom Schema Properties](/docs/api/resources/schemas).

Users will be associated with this new SAML IdP when they next log in.

**Imported (SAML) Identity Provider Naming Convention**

Identity Providers have a `name` property that is composed of a `dir:` prefix and the `name` of the Stormpath Directory:

```
"name": "dir:{SP_directoryName}"
```

<a name="stormpath-directories-ldap"></a>
### Stormpath Directories (LDAP)

As mentioned in [the Caveats section](#things-that-wont-migrate-and-known-caveats), LDAP Directories (including Active Directory) cannot be imported into Okta. You will need to set them up fresh inside Okta, which will re-import the data from your LDAP directory.

- [Instructions to set up Active Directory](https://help.okta.com/en/prod/Content/Topics/Directory/okta-active-directory-agent.htm)
- [Instructions to set up LDAP](https://help.okta.com/en/prod/Content/Topics/Directory/Okta%20Java%20LDAP%20Agent.htm)

<a name="stormpath-groups"></a>
### Stormpath Groups

The information inside a [Stormpath Group](https://docs.stormpath.com/rest/product-guide/latest/reference.html#group) is imported into the Okta Group's [Profile object](/docs/api/resources/groups#profile-object). The Stormpath Account Store Mappings are used to find all Accounts that were associated with this Group, and these associations are then used to add the appropriate Okta Users to the newly-created Okta Group.

Stormpath Group Attribute | Okta Group Profile Attribute
--- | ---
`name` | `name`
`description` | `description`

**Imported (Group) Group Naming Convention**

Okta Groups that model Stormpath Groups use the `name` property inside the Okta Group's Profile. The Profile `name` is made up of a `group:` prefix, along with the `id` of the Okta Group that models the Stormpath Directory that owned the Stormpath Group, as well as the exact `name` of the Stormpath Group:

```
"name": "group:{OKTA_groupId}:{SP_groupName}"
```

<a name="stormpath-organizations"></a>
### Stormpath Organizations

The [Stormpath Organization](https://docs.stormpath.com/rest/product-guide/latest/reference.html#organization) becomes a Group in Okta, and its information is imported to an [Okta Group Profile](/docs/api/resources/groups#profile-object) (see table below). The Organization Account Store Mappings are used to find all Accounts associated with that Organization, and the imported Users are associated with this new Organization Group.

Stormpath Organization Attribute | Okta Group Profile Attribute
--- | ---
`name` | `name`
`nameKey` | `description`

**Imported (Organization) Group Naming Convention**

Okta Groups that model Stormpath Organizations use the `name` and `description` properties inside the Group's Profile. The Profile `name` is made up of an `org:` prefix and the Stormpath Organization's `name`:

`"name": "org:{SP_organizationName}"`

The Profile `description` is made up of the Stormpath Organization's `nameKey` with no prefix:

```
"description": "{SP_organizationNameKey}"
```

<a name="stormpath-applications"></a>
### Stormpath Applications

Stormpath Applications have OAuth Client Applications created for them in Okta, as well as Authorization Servers.

- An OAuth Client Application is created with `type` set to `web`
- An [Authorization Server](/docs/api/resources/oauth2#authorization-operations) is also created
- The Authorization Server and Client Application are associated with one another
- Any relevant Okta Groups are assigned to the new OAuth Client Application
- Access and Refresh Token TTL values are imported

**Imported (Application) OAuth Client Naming Convention**

Okta OAuth Client Applications that model Stormpath Applications have a ``client_name`` that is made up of a `app:` prefix and the Stormpath Application's `name` attribute:

```
"client_name": "app:{SP_applicationName}"
```
