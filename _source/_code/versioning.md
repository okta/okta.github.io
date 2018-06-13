---
layout: software
title: Library Versions
---

# Library Versions

Okta publishes a number of officially-supported libraries and SDKs on [GitHub](https://github.com/okta). These libraries follow a consistent versioning and release pattern, described in this document.

> This is separate from how Okta APIs are [versioned and released](https://developer.okta.com/docs/api/getting_started/releases-at-okta).

## Semantic versioning

All of our libraries and SDKs follow [semantic versioning](https://semver.org/). Library versions will always be `major.minor.patch`. For example, `0.1.2` or `2.1.33`. We will:

* Increase the **patch** version for things like bug fixes, security fixes, and code documentation. Backwards compatible; no breaking changes.
* Increase the **minor** version for new features and additions to the library's interface. Backwards compatible; no breaking changes.
* Increase the **major** version for breaking changes to the library's interface or breaking changes to behavior.

## Versioning lifecycle

Semantic versioning means that within a **major** version, you can safely apply minor and patch updates without your code breaking. The status of each major version series (for example, `1.x` or `2.x`) follows the lifecycle described below.

### Beta

A **beta** label means a version series is currently in development and is not ready for production use. While a library version is in beta, the code interface is not final and breaking changes could occur without warning.

New libraries (or new major versions of existing libraries) typically stay in beta for a period of time while we iterate on the design and get feedback from the community. When the library is ready for production, it will be marked as stable.

### Stable

Stable version series are supported by Okta for use in production code. Semantic versioning means that a stable major version may get new features (minor updates) or bug fixes (patch updates), but no breaking changes.

### Retiring

When a new major version of a library is released, the old major version will be marked as **retiring**. Retiring libraries are supported by Okta for at least nine months. After this period of time, the version series will be officially retired (below).

For example, if version 2.0.0 of `Okta.FoobarSdk` is published in January, the 1.x series of `Okta.FoobarSdk` (any version starting 1) will be officially supported until _at least_ September. The retirement dates will be posted in the library's readme.

### Retired

Retired version series are no longer supported by Okta, and are no longer recommended for production use. Okta will not publish new features or bug fixes for retired versions, except for critical security fixes (at the discretion of Okta).

For example, after `Okta.FoobarSdk` version 1.x has a retiring period (of at least nine months), it is no longer supported. Customers and developers are encouraged to upgrade to 2.0.0 or later.

When in doubt, check GitHub! The library's readme will clearly state any versions that are retiring or have been retired.
