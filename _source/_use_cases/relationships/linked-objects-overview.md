---
layout: docs_page
title: Relationships with Linked Objects
excerpt: Create or import users with relationships.
---

Users have relationships to each other, like manager and direct report or customer and sales representative. You can create or import users with relationships by using the Linked Objects API.

## Linked Objects and Users

Okta allows you to create up to 200 link types. These link types are one-to-many:

One manager: many direct reports
One sales rep: many customers
One case worker: many clients

To represent a relationship, you create a link type, and then assign one side of that link type to a user. 
