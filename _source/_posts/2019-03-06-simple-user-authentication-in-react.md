---
layout: blog_post
title: "Simple User Authentication in React"
author: bkelley
description: "Build a React application with User Authentication and Okta."
tags: [react, authentication, auth, oauth]
tweets:
- "Build a simple @reactjs app with user authentication!"
- "Tutorial - Simple User Authentication in @reactjs"
- "Need to add user authentication to your @reactjs app? We've got you covered!"
image: blog/featured/okta-react-bottle-headphones.jpg
---

In 2019, it's quite easy to find React components for pretty much everything. For example, if you want to add user authentication to your app, you can do so easily with Okta's React component. Here I'll walk you through creating a simple, fun React app that fetches random Chuck Norris jokes. I'll then show you how you can add user authentication and customize your user experience, so the jokes will replace Chuck Norris' name with their own.

## Bootstrap Your React App

To get React up and running quickly without a lot of hassle, you can use React's create-react-app script. React also prefers `yarn` if you have it installed. You can install those both with this command:

```bash
npm install --global create-react-app@2.1.5 yarn@1.12.3
```

Once you have those installed, you can create a new app with the following:

```bash
create-react-app chuck-norris-jokes
```

The script will create a new directory with some starter files, install a slew of dependencies needed to get things up and running and initialize the project with git. You can now change into the directory and start the development server, which will open the app in your web browser. Your browser will automatically update whenever you change any source files.

```bash
cd chuck-norris-jokes
yarn start
```

{% img blog/simple-user-auth-react/react-starting-app.png alt:"React start app" width:"800" %}{: .center-image }

## Add Some Style to Your React App

First things first, you'll need to change out the default logo. Since this will be showing Chuck Norris jokes, find your favorite image of Chuck Norris (or just use the one below).

{% img blog/simple-user-auth-react/chuck-norris-bg.png alt:"Chuck Norris bckground" width:"400" %}{: .center-image }

Save the file to `src/chuck-norris.png`. Then open up `src/App.js` and change the line `import logo from './logo.svg'` to `import logo from './chuck-norris.png'`.

If you used the image above, the default dark background will make it hard to see. You also don't really need his head to be spinning around, so open up `src/App.css` and make a few changes. You can get rid of the `animation` line (and you can get rid of the `@keyframes` block. You'll also want to change the `background-color` to something like `gray`. You'll want to add a button, but you can style it to look just like the `Learn React` link that's already there. In the end, your CSS should look something like this (I also added a little padding to the header for small screens):

```css
.App {
  text-align: center;
}

.App-logo {
  height: 40vmin;
  pointer-events: none;
}

.App-header {
  background-color: gray;
  padding: 10px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.App-link {
  color: #61dafb;
}

button.App-link {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  text-decoration: underline;
  cursor: pointer;
}
```

## Use React Hooks to Fetch Some Jokes

With the release of React 16.8, you can now use hooks to make your code components a little simpler. It's not totally necessary, but, why not? In your `src/App.js`, change the `App` component from a class to a function. The default looks something like this:

```javascript
class App extends Component {
  render() {
    return (
      // ...
    );
  }
}
```

To make it a functional component, change it to look more like this:

```javascript
const App = () => {
  return (
    // ...
  )
}
```

It's not a huge difference, but it'll allow us to add hooks in, which are a bit simpler than using the class lifecycle methods.

To add a piece of state with hooks, you'll need to use the `useState` function exported from React. You'll also be using `useEffect` later on, so you'll need to make sure to import both of those. Change the line importing `React` to look like this:

```javascript
Import React, { useState, useEffect } from 'react';
```

Then to use a piece of state, add the following to the top of your `App` function, before the `return statement`:

```javascript
const [joke, setJoke] = useState('');
```

You now have a way to read a joke and change its value. By default, it will just be an empty string until you fetch it. Speaking of fetching, you can use [The Internet Chuck Norris Database](http://www.icndb.com/api/) to fetch jokes. They come already encoded for HTML, but React expects strings to be decoded (e.g. `"` instead of `&quot;`). You can install the `he` library to handle this for you, then import it using `import { decode } from 'he'`. Install it using:

```bash
yarn add he@1.2.0
```

Now you'll need to write a function to fetch jokes. Since this will need to reference `setJoke`, it should be written inside the `App` component. The `fetch` API supports a `signal` that will allow you to cancel the call. This would be important to make sure calls come back in the right order. If you have two or three calls successively, you don't really care about the first two, but instead, just want the final result.

```javascript
const fetchJoke = async signal => {
  const url = new URL('https://api.icndb.com/jokes/random');
  const response = await fetch(url, { signal });
  const { value } = await response.json();

  setJoke(decode(value.joke));
};
```

You'll also need an "effect" hook to fetch the joke whenever there isn't one. The `useEffect` hook will run any time the component renders. However, you can add an array of values to watch, which will cause it to only run the effect when one of those values changes. In this case, you'll only want to run the effect when the `joke` changes, or fetch one if there is no joke set yet. If the effect has a return value, it will be run when cleaning up the app, or before rendering again. Here is where you can provide a function that will cancel the `fetch` call.

```javascript
useEffect(() => {
  if (!joke) {
    const controller = new AbortController();
    fetchJoke(controller.signal);

    return () => controller.abort();
  }
}, [joke]);
```

Now you just need to display the joke and add a button to fetch a new one. Clicking the button will set the joke back to an empty string, and the effect will take care of fetching a new joke. Replace the contents of the `<p>` tag with the joke (`<p>{joke || '...'}</p>`), and replace the `<a>` tag with a button:

```jsx
<button className="App-link" onClick={() => setJoke('')}>
  Get a new joke
</button>
```

Your final code for `App.js` should look like this:

```jsx
import React, { useState, useEffect } from 'react';
import { decode } from 'he';

import logo from './chuck-norris.png';
import './App.css';

const App = () => {
  const [joke, setJoke] = useState('');

  const fetchJoke = async signal => {
    const url = new URL('https://api.icndb.com/jokes/random');
    const response = await fetch(url, { signal });
    const { value } = await response.json();

    setJoke(decode(value.joke));
  };

  useEffect(() => {
    if (!joke) {
      const controller = new AbortController();
      fetchJoke(controller.signal);

      return () => controller.abort();
    }
  }, [joke]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{joke || '...'}</p>
        <button className="App-link" onClick={() => setJoke('')}>
          Get a new joke
        </button>
      </header>
    </div>
  );
}

export default App;
```

{% img blog/simple-user-auth-react/chuck-norris-jokes.gif alt:"Jokes app running" width:"800" %}{: .center-image }

## Add User Authentication to Your React App

Now that you have a functional web app, you can add some personalization by allowing users to sign in. One simple way to add authentication to your project is with Okta, which is what I'll demonstrate. Our API enables you to:

* [Authenticate](https://developer.okta.com/product/authentication/) and [authorize](https://developer.okta.com/product/authorization/) your users
* Store data about your users
* Perform password-based and [social login](https://developer.okta.com/authentication-guide/social-login/)
* Secure your application with [multi-factor authentication](https://developer.okta.com/use_cases/mfa/)
* And much more! Check out our [product documentation](https://developer.okta.com/documentation/)

If you don't already have one, [sign up for a forever-free developer account](https://developer.okta.com/signup/). Log in to your developer console, navigate to **Applications**, then click **Add Application**. Select **Single-Page App**, then click **Next**.

Since Create React App runs on port 3000 by default, you should add that as a Base URI and Login Redirect URI. Your settings should look like the following:

{% img blog/simple-user-auth-react/okta-app-settings.png alt:"Okta app settings" width:"800" %}{: .center-image }

Click **Done** to save your app, then copy your **Client ID** and paste it as a variable into a file called `.env.local` in the root of your project. This will allow you to access the file in your code without needing to store credentials in source control. You'll also need to add your organization URL (without the `-admin` suffix). Environment variables (other than `NODE_ENV`) need to start with `REACT_APP_` in order for Create React App to read them, so the file should end up looking like this:

```bash
REACT_APP_OKTA_ORG_URL=https://{yourOktaDomain}
REACT_APP_OKTA_CLIENT_ID={yourClientId}
```

You may need to restart your server before it will recognize these changes. You can find the running instance and then hit `ctrl-c` to close it. Then run it again with `yarn start`.

The easiest way to add Authentication with Okta to a React app is to use [Okta's React SDK](https://github.com/okta/okta-oidc-js/tree/master/packages/okta-react). You'll also need to add routes, which can be done using [React Router](https://reacttraining.com/react-router/). Go ahead and add these dependencies:

```bash
yarn add @okta/okta-react@1.2.0 react-router-dom@4.3.1
```

Now in order to use Okta in your React app, you'll need to wrap the app in a provider. In your `src/index.js`, instead of rendering the `<App />` component by itself, you'll need to render a `<Router>` component. This uses React Router to control different URL paths in your app. Next, you'll need to include the `<Security>` component as a child. This allows Okta to add an `auth` object to the context, which can be read from children in the React tree. Then you'll need a couple `Route`s to let the router know what to display for each route. For the default route, you'll display `App`, so everything should look the same as it did before. But you'll also add an `/implicit/callback` route to let Okta handle the OAuth callback. Replace the call to `ReactDOM.render` with the following:

```javascript
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Security, ImplicitCallback } from '@okta/okta-react';

ReactDOM.render(
  <Router>
    <Security
      issuer={`${process.env.REACT_APP_OKTA_ORG_URL}/oauth2/default`}
      client_id={process.env.REACT_APP_OKTA_CLIENT_ID}
      redirect_uri={`${window.location.origin}/implicit/callback`}
    >
      <Route path="/" exact component={App} />
      <Route path="/implicit/callback" component={ImplicitCallback} />
    </Security>
  </Router>,
  document.getElementById('root')
);
```

To tie Okta's auth to a React component, you'll need to wrap it in a `withAuth`, which adds an `auth` prop. Before you do that though, you can simplify things by again making use of hooks. Here I'll have you create a custom hook that accepts the `auth` prop and returns the `authenticated` state as well as the current `user`. Create a new file `src/auth.js` that contains the following:

```javascript
import { useState, useEffect } from 'react';

export const useAuth = auth => {
  const [authenticated, setAuthenticated] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.isAuthenticated().then(isAuthenticated => {
      if (isAuthenticated !== authenticated) {
        setAuthenticated(isAuthenticated);
      }
    });
  });

  useEffect(() => {
    if (authenticated) {
      auth.getUser().then(setUser);
    } else {
      setUser(null);
    }
  }, [authenticated]);

  return [authenticated, user];
};
```

Here you're using two pieces of state: `authenticated` and `user`, which both start out as `null`. Every time the component is rendered, the auth checks to see whether or not a user is authenticated. If authentication has changed, it updates the state. Initially, it will be `null`, but after the first time, it will always be either `true` or `false`. Whenever the `authenticated` state changes, that will trigger a call to get more information about the user. If the user isn't authenticated, you can skip the check and simply set the user to `null`.

Back in `src/App.js`, you'll need to import both the `withAuth` higher order component that Okta provides, and your new `useAuth` hook.

```javascript
import { withAuth } from '@okta/okta-react';
import { useAuth } from './auth';
```

Wrap the `App` with `withAuth` and change the function to accept an `auth` param. Previously we had:

```javascript
const App = () => {
  // ...
}
```

Now you should have:

```javascript
const App = withAuth(({ auth }) => {
});
```

Add the new hook below the `joke` state:

```javascript
const [authenticated, user] = useAuth(auth);
```

You can now add a new button after the "Get a new joke" button. When the `authenticated` variable is `null`, that means Okta hasn't initialized yet so you're not sure if the user is logged in or not. You could show some sort of loading indicator, or you could simply not render the button until you're sure about the state of authentication:

```jsx
{authenticated !== null && (
  <button
    onClick={() => authenticated ? auth.logout() : auth.login()}
    className="App-link"
  >
    Log {authenticated ? 'out' : 'in'}
  </button>
)}
```

Now the user can log in or out, but it doesn't really do anything besides changing the button from "Log in" to "Log out". The ICNDb API supports adding a first and last name to the URL, which replaces Chuck Norris with that name. Before the call to `fetch`, modify the `url` if there is a `user`:

```javascript
if (user) {
  url.searchParams.set('firstName', user.given_name);
  url.searchParams.set('lastName', user.family_name);
}
```

Lastly, add a new effect to reset the joke whenever the `user` state changes. This will cause the app to fetch a new joke with the user's name after they've logged in, or a default Chuck Norris joke when the user logs out.

```javascript
useEffect(() => {
  setJoke('');
}, [user]);
```

Your final code should look like this:

```javascript
import React, { useState, useEffect } from 'react';
import { decode } from 'he';
import { withAuth } from '@okta/okta-react';

import logo from './chuck-norris.png';
import './App.css';
import { useAuth } from './auth';

const App = withAuth(({ auth }) => {
  const [joke, setJoke] = useState('');
  const [authenticated, user] = useAuth(auth);

  const fetchJoke = async signal => {
    const url = new URL('https://api.icndb.com/jokes/random');
    if (user) {
      url.searchParams.set('firstName', user.given_name);
      url.searchParams.set('lastName', user.family_name);
    }
    const response = await fetch(url, { signal });
    const { value } = await response.json();

    setJoke(decode(value.joke));
  };

  useEffect(() => {
    if (!joke) {
      const controller = new AbortController();
      fetchJoke(controller.signal);

      return () => controller.abort();
    }
  }, [joke]);

  useEffect(() => {
    setJoke('');
  }, [user]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{joke || '...'}</p>
        <button className="App-link" onClick={() => setJoke('')}>
          Get a new joke
        </button>
        {authenticated !== null && (
          <button
            onClick={() => authenticated ? auth.logout() : auth.login()}
            className="App-link"
          >
            Log {authenticated ? 'out' : 'in'}
          </button>
        )}
      </header>
    </div>
  );
});

export default App;
```

{% img blog/simple-user-auth-react/jon-snow-joke.png alt:"Jon Snow joke" width:"800" %}{: .center-image }

## Learn More About React and Secure User Authentication

Hopefully, you had some fun with this app and learned a bit about how easy it can be to add authentication to your React app. If you want to see the final code sample for reference, you can find it [on GitHub](https://github.com/oktadeveloper/okta-react-user-auth-example).

For more examples using Okta with React, check out some of these other posts, or browse the [Okta Developer Blog](/blog/).

* [Build User Registration with Node, React, and Okta](/blog/2018/02/06/build-user-registration-with-node-react-and-okta)
* [Build a React Application with User Authentication in 15 Minutes](/blog/2017/03/30/react-okta-sign-in-widget)
* [Build a Basic CRUD App with Laravel and React](/blog/2018/12/06/crud-app-laravel-react)
* [Build a Basic CRUD App with Node and React](/blog/2018/07/10/build-a-basic-crud-app-with-node-and-react)

If you have any questions about this post, please add a comment below. For more awesome content, follow [@oktadev](https://twitter.com/oktadev) on Twitter, like us [on Facebook](https://www.facebook.com/oktadevelopers/), or subscribe to [our YouTube channel](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q).


