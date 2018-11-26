---
layout: software
title: SAML-enable your Python application
language: Python
excerpt: Guidance on how to SAML-enable your Python application using open source PySAML2.
chiclet_name: PySAML2 Example
programming_language: Python
framework: Flask
framework_url: http://flask.pocoo.org/
port: 5000
saml_library: PySAML2
saml_library_url: https://github.com/rohe/pysaml2
git_url: git@github.com:jpf/okta-pysaml2-example.git
github_repo_name: okta-pysaml2-example
redirect_from:
  - "/docs/examples/pysaml2.html"
  - "/docs/guides/pysaml2.html"
weight: 2
---

# Overview

This guide describes how to use [{{ page.saml_library }}]({{ page.saml_library_url }}) to add support
for Okta (via SAML) to applications written in {{ page.programming_language }}. Please note that while the example in this guide uses
[{{ page.framework }}]({{ page.framework_url }}), the concepts presented here are general enough to use in other {{ page.programming_language }} frameworks.

This guide describes how to install and configure an example
application that demonstrates how to use {{ page.saml_library }} in a {{ page.framework }} application.
After you have Okta working with the example application,
adapt the example code for your production environment.

>Note: The library is not Okta's and is not supported by Okta.

This guide assumes that you are familiar with the basics of {{ page.programming_language }}
software development: using the command line, editing text files,
using [virtualenv](https://virtualenv.pypa.io/en/latest/), and using
[pip](https://en.wikipedia.org/wiki/Pip_%28package_manager%29).

If you're already familiar with Okta, you can skip to the
section titled "Configuring {{ page.saml_library }} to work with Okta."

* Will be replaced with the ToC
{:toc .list-unstyled .toc}

## Configuring Okta to work with {{ page.saml_library }}

Before you can configure your application and {{ page.saml_library }} set up an
Okta chiclet (application icon) that enables an Okta user to sign in to your to your application with SAML and {{ page.saml_library }}.

To set up Okta to connect to your application, follow the
[setting up a SAML application in Okta](/docs/guides/setting_up_a_saml_application_in_okta)
guide. As noted in the instructions, there are two steps to change:

* *In step \#6*: Use ***{{ page.chiclet_name }}*** instead of ***Example SAML application*** .
* *In step \#7*: When entering the URL

  ~~~ shell
  http://example.com/saml/sso/example-okta-com
  ~~~

  use the following:

  ~~~ shell
  http://localhost:{{ page.port }}/saml/sso/example-okta-com
  ~~~

  **Note:** "{{ page.port }}" is the port that {{ page.framework }} uses by default, if you are using a different port number, change "{{ page.port }}" to the port number you are using.


## Configuring {{ page.saml_library }} to work with Okta

Now that you have configured the {{ page.chiclet_name }} "chiclet" in your Okta organization, you
are ready to configure {{ page.saml_library }} to work with your Okta organization. In this
section we use the "Identity Provider metadata" link from the
section above to configure {{ page.saml_library }}. After completing
the following steps, you will have a working example of connecting Okta to a sample {{ page.programming_language }} application using {{ page.saml_library }}.

0.  Install platform-dependent prerequisites:

    > Note: These instructions assume that you are running on a recent version of your operating system.

    For Mac OS X:

    ~~~ shell
    brew install libffi libxmlsec1
    ~~~

    For RHEL:

    ~~~ shell
    sudo yum install libffi-devel xmlsec1 xmlsec1-openssl
    ~~~

1.  Download the example application for {{ page.programming_language }}:

    ~~~ shell
    $ git clone {{ page.git_url }}
    ~~~

2.  `cd` to the `{{ page.github_repo_name }}` directory.

    ~~~ shell
    $ cd {{ page.github_repo_name }}
    ~~~

3.  Open the `app.py` file in your favorite text editor.

    ~~~ shell
    $ $EDITOR app.py
    ~~~

4.  After opening the `app.py` file, modify the contents of the `metadata_url_for` dictionary as shown below.

    ~~~ python
    metadata_url_for = {
        'example-okta-com': '${metadata_url}'
    }
    ~~~

5.  Be sure to replace the contents of `${metdata_url}` with the link
    that you copied in step \#10 of the
    "[Setting up a SAML application in Okta](/docs/guides/setting_up_a_saml_application_in_okta)"
    instructions that you followed above!

    Note: The contents of `${metadata_url}` should look similar to: `https://{yourOktaDomain}/app/a0b1c2deFGHIJKLMNOPQ/sso/saml/metadata`

6.  Install the dependencies; for example, {{ page.programming_language }} SAML SP:

    ~~~ shell
    $ virtualenv venv
    $ source venv/bin/activate
    $ pip install -r requirements.txt
    ~~~

7.  Start the {{ page.programming_language }} example:

    ~~~ shell
    $ python app.py
    ~~~

## Test the SAML integration

Now that you have set up an application in your Okta organization and have
configured {{ page.saml_library }} to work with your Okta organization, it is ready to test.

There are two ways to test a SAML application:

1. Starting from the example {{ page.programming_language }} application ("SP initiated").
2. Starting from Okta ("IdP initiated").

You will use both methods to test your application. In each case, you will know iff the
test worked when you see a screen that looks like the one below:

{% img pysaml2-authenticated-user.png alt:"Authenticated user" %}


1.  Login from the Okta {{ page.saml_library }} example application (This is
    known as an **SP-initiated login**.)

    -   Start the example application from the command line:

    	~~~ shell
    	$ source venv/bin/activate
	$ python app.py
	~~~

    -   Open the example application in your browser:
        `http://localhost:{{ page.port }}/`

    -   Click on the link for your Okta IdP.


2.  Login from Okta (This is known as an **IdP-initiated" login**.)

    -   Start the example application from the command line:

    	~~~ shell
    	$ source venv/bin/activate
	$ python app.py
	~~~

    -   Sign in to your Okta organization.

    -   Click the button for the application you created earlier
        "Configuring Okta to work with {{ page.saml_library }}" section
        above: {% img pysaml2-example-okta-chiclet.png alt:"{{ page.chiclet_name }}" %}

If you can to get to the "Logged in" page using both of the
methods above, the test are successful.

Congratulations on getting Okta working with {{ page.saml_library }}!

## Next Steps

At this point, you should be familiar with setting up a SAML enabled application
to work with an Okta organization and how to configure {{ page.saml_library }} to work with Okta.

After you have your Okta organization working with the example {{ page.programming_language}}
application, the next step is to take the example code and move
it to your production application. The specifics of how this works is
different depending on how your application is set
up. Pay special attention to the notes in the `app.py` file. For
example, on a production system, the contents of the
`metadata_url_for` dictionary cannot be hard coded, but must come
from a dynamic datastore.

If you want to learn more about SAML and what to consider when writing a SAML implementation, Okta's
in-depth [SAML guidance](/docs/getting_started/saml_guidance)
is a great place to learn more.

Finally, if you got this far in this guide and still have questions,
please reach out to me at: joel.franusic@okta.com.
