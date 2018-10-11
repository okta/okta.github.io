---
layout: blog_post
title: "Build a Simple Web App with Express, React and GraphQL"
author: bkelley
description: "In this tutorial you'll use Express.js and React to build a simple web application with GraphQL and secure it using Okta."
tags: [authentication, graphql, web, express, node]
tweets:
- "Curious about @graphql? We just published an interesting post which shows you how to build a simple web app using #expressjs, @reactjs, and #graphql."
- "Check out our kick-ass tutorial! It walks you through building a simple web app with @graphql in Node and @reactjs. Stop scrolling through Twitter and learn something fun!"
- "@graphql + @nodejs + @reactjs = 💥"
image: blog/graphql-express/okta-node-skew.jpg
---

GraphQL and React have both become quite popular in the last few years, and it's safe to say they go together like avocado and toast. A GraphQL server can be written in Node and lets you easily create a flexible API using JavaScript classes and functions. When a frontend developer queries the server, only the information asked for gets processed. This means you can make the backend as robust as you want while keeping the frontend light by only requesting information needed for the page you're viewing.

GraphQL is a relatively new standard for defining types and querying data, and there are quite a few different implementations of it, both server-side and client-side. Today I'll show you how to use Express to create a GraphQL server, as well as how to create a single-page app in React that uses Apollo's client to query the server.

## Create the React App

The quickest way to get started with a React app is to use [Create React App](https://github.com/facebook/create-react-app). If you don't already have Node, Yarn, and Create React App installed, you can run the following commands:

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
npm install --global yarn create-react-app
```

Next, create and start a new app:

```bash
create-react-app graphql-express-react
cd graphql-express-react
yarn start
```

When you run `create-react-app`, you'll get a new folder with everything you need to get started, and all the dependencies you need will be installed locally using `yarn`. When you type `yarn start` from within the folder, you're starting the frontend development server that will automatically update whenever you edit any files.

{% img blog/graphql-express-react/create-react-app.png alt:"create-react-app bootstrapped app" width:"800" %}{: .center-image }

## Create the GraphQL Server

Before we continue writing the frontend, you'll need a server to connect to. Run the following commands to install the dependencies you'll need to get up and running:

```bash
yarn add express@4.16.3 cors@2.8.4 graphql@14.0.2 express-graphql@0.6.12 graphql-tag@2.9.2
```

Create a new directory in your project's `src` folder, named `server`:

```bash
mkdir src/server
```

In there, create a new file named `index.js`, with the following code:

```javascript
const express = require('express');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const gql = require('graphql-tag');
const { buildASTSchema } = require('graphql');

const POSTS = [
  { author: "John Doe", body: "Hello world" },
  { author: "Jane Doe", body: "Hi, planet!" },
];

const schema = buildASTSchema(gql`
  type Query {
    posts: [Post]
    post(id: ID!): Post
  }

  type Post {
    id: ID
    author: String
    body: String
  }
`);

const mapPost = (post, id) => post && ({ id, ...post });

const root = {
  posts: () => POSTS.map(mapPost),
  post: ({ id }) => mapPost(POSTS[id], id),
};

const app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

const port = process.env.PORT || 4000
app.listen(port);
console.log(`Running a GraphQL API server at localhost:${port}/graphql`);
```

Let me explain the different parts of this code.

At the top of the file, you use the `require` tag to import your dependencies. Native Node doesn't support the `import` tag yet, but you can use `require` instead. A future version of Node will likely support `import`. Create React App uses `babel` to transpile the code before running it, which allows you to use the `import` syntax in the React code, so you'll see that when we get to the frontend code.

For now, this is just using some mock data, which is what the `const POSTS` contains. Each item contains an `author` and a `body`.

The `gql` tag allows your favorite code editor to realize that you're writing GraphQL code so that it can stylize it appropriately. It also parses the string and converts it to GraphQL AST [Abstract Syntax Tree](https://blog.buildo.io/a-tour-of-abstract-syntax-trees-906c0574a067). You then need to build a schema using `buildASTSchema`.

The GraphQL schema might be the most interesting part of this code. This is what defines the different types and allows you to say what the client can query. This will also automatically generate some very useful documentation so that you can just focus on coding.

```graphql
type Query {
  posts: [Post]
  post(id: ID!): Post
}

type Post {
  id: ID
  author: String
  body: String
}
```

Here, you've defined a `Post` type, which contains an `id`, and `author`, and a `body`. You need to say what the types are for each element. Here, `author` and `body` both use the primitive `String` type, and `id` is an `ID`.

The `Query` type is a special type that lets you query the data. Here, you're saying that `posts` will give you an array of `Post`s, but if you want a single `Post` you can query it by calling `post` and passing in the ID.

```javascript
const mapPost = (post, id) => post && ({ id, ...post });

const root = {
  posts: () => POSTS.map(mapPost),
  post: ({ id }) => mapPost(POSTS[id], id),
};
```

You need to provide a set of resolvers to tell GraphQL how to handle the queries. When someone queries `posts`, it will run this function, providing an array of all the `POSTS`, using their index as an ID.

When you query `post`, it expects an `id` and will return the post at the given index.

```javascript
const app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

const port = process.env.PORT || 4000
app.listen(port);
console.log(`Running a GraphQL API server at localhost:${port}/graphql`);
```

Now you are able to create the server. The `graphqlHTTP` function creates an Express server running GraphQL, which expects the resolvers as `rootValue`, and the schema. The `graphiql` flag is optional and will run a server for you allowing you to more easily visualize the data and see the auto-generated documentation. When you run `app.listen`, you're starting the GraphQL server.

To make sure we can easily run both the server and client at the same time, add the following dev dependencies:

```bash
yarn add -D nodemon@1.18.4 npm-run-all@4.1.3
```

Next, edit your `package.json` file so that the `scripts` section looks like this:

```json
{
  "start": "npm-run-all --parallel watch:server start:web",
  "start:web": "react-scripts start",
  "start:server": "node src/server",
  "watch:server": "nodemon --watch src/server src/server",
  "build": "react-scripts build",
  "test": "react-scripts test --env=jsdom",
  "eject": "react-scripts eject"
},
```

Close your existing web server, then simply type `yarn start` again to run both the server and client at the same time. Whenever you make changes to the server, just the server will restart. Whenever you make changes to the frontend code, the page should automatically refresh with the latest changes.

Point your browser to `http://localhost:4000/graphql` to get the GraphiQL server. You can always come back here and refresh after changing some code around in the server to see the latest Schema and test your queries.

{% img blog/graphql-express-react/graphiql.png alt:"GraphiQL" width:"800" %}{: .center-image }

## Connect React to GraphQL

Next, you need to connect the frontend to GraphQL. I'll use Bootstrap for some decent styling with minimal effort. [Apollo](https://www.apollographql.com/docs/react/) makes a great React client that can link up to any GraphQL server. To install the dependencies you need for the frontend, run the following:

```bash
yarn add bootstrap@4.1.3 reactstrap@6.4.0 apollo-boost@0.1.16 react-apollo@2.1.11
```

You'll need to configure the Apollo client to know where to connect to the backend. Create a new file `src/apollo.js` with the following code:

```javascript
import ApolloClient from 'apollo-boost';

export default new ApolloClient({
  uri: "http://localhost:4000/graphql",
});
```

In order for Apollo's `Query` React component to be able to connect using the client, the entire app needs to be wrapped in an `ApolloProvider` component. You'll also want to include the styling for Bootstrap, and you can get rid of the `index.css` file that came with Create React App now. Make the following changes to your `src/index.js` file:

```diff
@@ -1,8 +1,17 @@
 import React from 'react';
 import ReactDOM from 'react-dom';
-import './index.css';
+import { ApolloProvider } from 'react-apollo';
+
+import 'bootstrap/dist/css/bootstrap.min.css';
 import App from './App';
 import registerServiceWorker from './registerServiceWorker';
+import client from './apollo';

-ReactDOM.render(<App />, document.getElementById('root'));
+ReactDOM.render(
+  <ApolloProvider client={client}>
+    <App />
+  </ApolloProvider>,
+  document.getElementById('root')
+);
 serviceWorker.unregister();
+if (module.hot) module.hot.accept();
```

The `module.hot.accept()` isn't really necessary, but makes it so that just the components changing within the app will refresh as you update them, rather than refreshing the entire page. Every once in a while you may need to refresh just to reset the state of the app, but generally, this leads to a quicker turnaround time.

Create a new file `src/PostViewer.js` that will fetch the data and render it in a table:

```javascript
import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Table } from 'reactstrap';

export const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      author
      body
    }
  }
`;

export default () => (
  <Query query={GET_POSTS}>
    {({ loading, data }) => !loading && (
      <Table>
        <thead>
          <tr>
            <th>Author</th>
            <th>Body</th>
          </tr>
        </thead>
        <tbody>
          {data.posts.map(post => (
            <tr key={post.id}>
              <td>{post.author}</td>
              <td>{post.body}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    )}
  </Query>
);
```

The `Query` component requires a GraphQL query. In this case, you're just getting all of the posts with their ID and the `author` and `body`. The `Query` component also requires a render function as its only child. It provides a `loading` state, but in our case, we just won't show anything while it's loading, since it will be really quick to fetch the data locally. Once it's done loading, the `data` variable will be an object including the data you requested.

The above code renders a table (`Table` is a component that includes all the Bootstrap classes you need to make it look pretty) with all of the posts.

You should now change your `src/App.js` file to include the `PostViewer` component you just made. It should look like this:

```javascript
import React, { Component } from 'react';

import PostViewer from './PostViewer';

class App extends Component {
  render() {
    return (
      <main>
        <PostViewer />
      </main>
    );
  }
}

export default App;
```

Now if you go to `http://localhost:3000` you should see this:

{% img blog/graphql-express-react/plain-table.png alt:"plain table" width:"800" %}{: .center-image }

## Add the Ability to Edit Posts in GraphQL

In GraphQL, a query is typically read-only. If you want to modify data, you should use what's known as a _mutation_ instead.

Create a new `Mutation` type in your `const schema` in `src/server/index.js` to submit a post. You can create an `input` type to simplify your input variables. The new mutation should return the new `Post` on success:

```graphql
type Mutation {
  submitPost(input: PostInput!): Post
}

input PostInput {
  id: ID
  author: String!
  body: String!
}
```

You'll need to update your `root` variable to create a new resolver for `submitPost` as well. Add the following resolver:

```javascript
submitPost: ({ input: { id, author, body } }) => {
  const post = { author, body };
  let index = POSTS.length;

  if (id != null && id >= 0 && id < POSTS.length) {
    if (POSTS[id].authorId !== authorId) return null;

    POSTS.splice(id, 1, post);
    index = id;
  } else {
    POSTS.push(post);
  }

  return mapPost(post, index);
},
```

If you provide an `id`, it will try to find the post at that index and replace the data with the `author` and `body` that was provided. Otherwise, it will add a new post. Then it returns the post you provided along with the new `id` for it. When you send a mutation request to GraphQL, you can define which pieces you want back:

{% img blog/graphql-express-react/submit-post.png alt:"submit post" width:"800" %}{: .center-image }

For the frontend, you'll need to create a new component for editing posts. Forms in React can be made easier by a library called [Final Form](https://github.com/final-form/react-final-form). Install it with `yarn`:

```bash
yarn add final-form@4.10.0 react-final-form@3.6.5
```

Now, make a new file `src/PostEditor.js` and fill it with the following (I'll explain it in more detail just below):

```jsx
import React from 'react';
import gql from 'graphql-tag';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { Form as FinalForm, Field } from 'react-final-form';

import client from './apollo';
import { GET_POSTS } from './PostViewer';

const SUBMIT_POST = gql`
  mutation SubmitPost($input: PostInput!) {
    submitPost(input: $input) {
      id
    }
  }
`;

const PostEditor = ({ post, onClose }) => (
  <FinalForm
    onSubmit={async ({ id, author, body }) => {
      const input = { id, author, body };

      await client.mutate({
        variables: { input },
        mutation: SUBMIT_POST,
        refetchQueries: () => [{ query: GET_POSTS }],
      });

      onClose();
    }}
    initialValues={post}
    render={({ handleSubmit, pristine, invalid }) => (
      <Modal isOpen toggle={onClose}>
        <Form onSubmit={handleSubmit}>
          <ModalHeader toggle={onClose}>
            {post.id ? 'Edit Post' : 'New Post'}
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label>Author</Label>
              <Field
                required
                name="author"
                className="form-control"
                component="input"
              />
            </FormGroup>
            <FormGroup>
              <Label>Body</Label>
              <Field
                required
                name="body"
                className="form-control"
                component="input"
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" disabled={pristine} color="primary">Save</Button>
            <Button color="secondary" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </Form>
      </Modal>
    )}
  />
);

export default PostEditor;
```

The `submitPost` mutation is the new mutation to connect to the backend. It can use the `PostInput` type defined in the server:

```javascript
const SUBMIT_POST = gql`
  mutation SubmitPost($input: PostInput!) {
    submitPost(input: $input) {
      id
    }
  }
`;
```

Final Form takes an `onSubmit` function that will pass in the data entered by the user. After the post is submitted, you'll want to close the modal, so `PostEditor` takes an `onClose` prop to call when you're done submitting.

Final Form also takes an `initialValues` object to define what values the form should initially have. In this case, the `PostEditor` component will take a `post` prop that has the variables you need in it, so that gets passed along as the initial values.

The other required prop is the `render` function, which will render the form. Final Form gives you a few useful form props so you can know if the form is valid or not, or if it's been modified from the `initialValues`.

```jsx
const PostEditor = ({ post, onClose }) => (
  <FinalForm
    onSubmit={/* ... */}
    initialValues={post}
    render={/* ... */}
  />
);

export default PostEditor;
```

In the `onSubmit` function, you'll call the mutation needed to submit the post. Apollo lets you re-fetch queries. Since you know your list of posts will be out of date once you submit edits, you can re-fetch the `GET_POSTS` query here.

```javascript
onSubmit={async ({ id, author, body }) => {
  const input = { id, author, body };

  await client.mutate({
    variables: { input },
    mutation: SUBMIT_POST,
    refetchQueries: () => [{ query: GET_POSTS }],
  });

  onClose();
}}
```

The `render` function will display a Bootstrap modal. This `PostEditor` component will only be rendered when you want it to be open, so `isOpen` is just set to `true`. Here you also use the `onClose` prop to close the modal when the user clicks outside the modal, hits `Esc`, or clicks the Cancel button.

The form needs to have the `handleSubmit` function passed to it as an `onSubmit` prop. This tells the form to go through Final Form instead of sending a `POST` request to the page.

Final Form also handles all the boilerplate needed to have a controlled `input`. Instead of storing the data in state whenever the user types something, you can just use the `Field` component.

```jsx
render={({ handleSubmit, pristine, invalid }) => (
  <Modal isOpen toggle={onClose}>
    <Form onSubmit={handleSubmit}>
      <ModalHeader toggle={onClose}>
        {post.id ? 'Edit Post' : 'New Post'}
      </ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label>Author</Label>
          <Field
            required
            name="author"
            className="form-control"
            component="input"
          />
        </FormGroup>
        <FormGroup>
          <Label>Body</Label>
          <Field
            required
            name="body"
            className="form-control"
            component="input"
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button type="submit" disabled={pristine} color="primary">Save</Button>
        <Button color="secondary" onClick={onClose}>Cancel</Button>
      </ModalFooter>
    </Form>
  </Modal>
)}
```

Next, you'll have to make a couple small changes to your `PostViewer`. This adds a hook to each row so that you can determine whether the row should be editable or not and if so, changes the styles a bit and lets you click on the row. Clicking on the row calls another callback, which you can use to set which post is being edited.

```diff
diff --git a/src/PostViewer.js b/src/PostViewer.js
index 5c53b5a..84177e0 100644
--- a/src/PostViewer.js
+++ b/src/PostViewer.js
@@ -13,7 +13,11 @@ export const GET_POSTS = gql`
   }
 `;

-export default () => (
+const rowStyles = (post, canEdit) => canEdit(post)
+  ? { cursor: 'pointer', fontWeight: 'bold' }
+  : {};
+
+const PostViewer = ({ canEdit, onEdit }) => (
   <Query query={GET_POSTS}>
     {({ loading, data }) => !loading && (
       <Table>
@@ -25,7 +29,11 @@ export default () => (
         </thead>
         <tbody>
           {data.posts.map(post => (
-            <tr key={post.id}>
+            <tr
+              key={post.id}
+              style={rowStyles(post, canEdit)}
+              onClick={() => canEdit(post) && onEdit(post)}
+            >
               <td>{post.author}</td>
               <td>{post.body}</td>
             </tr>
@@ -35,3 +43,10 @@ export default () => (
     )}
   </Query>
 );
+
+PostViewer.defaultProps = {
+  canEdit: () => false,
+  onEdit: () => null,
+};
+
+export default PostViewer;
```

Now, tie this all together in `src/App.js`. You can create a "New Post" button to create a new post, and make it so that you can edit any other existing post as well:

```jsx
import React, { Component } from 'react';
import { Button, Container } from 'reactstrap';

import PostViewer from './PostViewer';
import PostEditor from './PostEditor';

class App extends Component {
  state = {
    editing: null,
  };

  render() {
    const { editing } = this.state;

    return (
      <Container fluid>
        <Button
          className="my-2"
          color="primary"
          onClick={() => this.setState({ editing: {} })}
        >
          New Post
        </Button>
        <PostViewer
          canEdit={() => true}
          onEdit={(post) => this.setState({ editing: post })}
        />
        {editing && (
          <PostEditor
            post={editing}
            onClose={() => this.setState({ editing: null })}
          />
        )}
      </Container>
    );
  }
}

export default App;
```

<video src="{% asset_path 'blog/graphql-express-react/new-post.mp4' %}" width="800" class="center-image" controls></video>


## Add User Authentication to the React + GraphQL Web App

One simple way to add authentication to your project is with Okta. Okta is a cloud service that allows developers to create, edit, and securely store user accounts and user account data, and connect them with one or multiple applications. If you don't already have one, [sign up for a forever-free developer account](https://developer.okta.com/signup/). Log in to your developer console, navigate to **Applications**, then click **Add Application**. Select **Single-Page App**, then click **Next**.

Since Create React App runs on port 3000 by default, you should add that as a Base URI and Login Redirect URI. Your settings should look like the following:

{% img blog/graphql-express-react/create-new-application-settings.png alt:"create new application settings" width:"800" %}{: .center-image }

Click **Done** to save your app, then copy your **Client ID** and paste it as a variable into a file called `.env.local` in the root of your project. This will allow you to access the file in your code without needing to store credentials in source control. You'll also need to add your organization URL (without the `-admin` suffix). Environment variables (other than `NODE_ENV`) need to start with `REACT_APP_` in order for Create React App to read them, so the file should end up looking like this:

**.env.local**
```bash
REACT_APP_OKTA_CLIENT_ID={yourClientId}
REACT_APP_OKTA_ORG_URL=https://{yourOktaDomain}
```

You're also going to need an API token later for the server, so while you're in there, navigate to **API** -> **Tokens**, then click on **Create Token**. You can have many tokens, so just give this one a name that reminds you what it's for, like "GraphQL Express". You'll be given a token that you can only see right now. If you lose the token, you'll have to create another one. Add this to `.env` also.

```bash
REACT_APP_OKTA_TOKEN={yourOktaAPIToken}
```

The easiest way to add Authentication with Okta to a React app is to use [Okta's React SDK](https://github.com/okta/okta-oidc-js/tree/master/packages/okta-react). You'll also need to add routes, which can be done using [React Router](https://reacttraining.com/react-router/).

```bash
yarn add @okta/okta-react@1.1.1 react-router-dom@4.3.1
```

In order to know if the user is authenticated, Okta requires the app to be wrapped in a `Security` component with some configuration. It also depends on React Router, so you'll end up with a `BrowserRouter` component, wrapping a `Security` component, wrapping an `ApolloProvider` component, which finally wraps your `App` in a `Route`. Your `src/index.js` file should end up looking like this:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Security, ImplicitCallback } from '@okta/okta-react';
import { ApolloProvider } from 'react-apollo';

import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import client from './apollo';

ReactDOM.render(
  <BrowserRouter>
    <Security
      issuer={`${process.env.REACT_APP_OKTA_ORG_URL}/oauth2/default`}
      redirect_uri={`${window.location.origin}/implicit/callback`}
      client_id={process.env.REACT_APP_OKTA_CLIENT_ID}
    >
      <ApolloProvider client={client}>
        <Route path="/implicit/callback" component={ImplicitCallback} />
        <Route path="/" component={App} />
      </ApolloProvider>
    </Security>
  </BrowserRouter>,
  document.getElementById('root')
);
registerServiceWorker();
if (module.hot) module.hot.accept();
```

The Okta SDK comes with a `withAuth` higher order component (HoC) that can be used for a wide variety of auth-related things, but for this example, you'll only need to know whether or not you're authenticated, and some information about the user. To make this a little easier, I wrote a simple HoC to override the one that comes with the Okta SDK. Create a new file `src/withAuth.js` containing the following:

```jsx
import React from 'react';
import { withAuth } from '@okta/okta-react';

export default Component => withAuth(class WithAuth extends React.Component {
  state = {
    ...this.props.auth,
    authenticated: null,
    user: null,
    loading: true,
  };

  componentDidMount() {
    this.updateAuth();
  }

  componentDidUpdate() {
    this.updateAuth();
  }

  async updateAuth() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      const user = await this.props.auth.getUser();
      this.setState({ authenticated, user, loading: false });
    }
  }

  render() {
    const { auth, ...props } = this.props;
    return <Component {...props} auth={this.state} />;
  }
});
```

By wrapping a component with this new function, your app will automatically be re-rendered whenever a user logs in or out, and you'll be able to access information about the user.

Now you can wrap the `App` component with this `withAuth` HoC. For a short time when the app first loads, Okta won't quite be sure whether a user is logged in or not. To keep things simple, just don't render anything in your `App` component during this loading period. You could, however, choose to render the posts and just disable editing until you know more information about the user.

At the very top of your render function in `src/App.js`, add the following:

```javascript
const { auth } = this.props;
if (auth.loading) return null;

const { user, login, logout } = auth;
```

Now you can replace the "New Post" button with the following code, which will render a "Sign In" button if you're not logged in. If you are logged in, you'll instead see both the "New Post" button you had before, as well as a "Sign Out" button. This will make it so that you must be logged in order to create a new post.

```jsx
{user ? (
  <div>
    <Button
      className="my-2"
      color="primary"
      onClick={() => this.setState({ editing: {} })}
    >
      New Post
    </Button>
    <Button
      className="m-2"
      color="secondary"
      onClick={() => logout()}
    >
      Sign Out (signed in as {user.name})
    </Button>
  </div>
) : (
  <Button
    className="my-2"
    color="primary"
    onClick={() => login()}
  >
    Sign In
  </Button>
)}
```

To make sure you also can't edit a post unless you're logged, change the `canEdit` prop to check that you have a user.

```javascript
canEdit={() => Boolean(user)}
```

You also need to export `withAuth(App)` instead of `App`. Your `src/App.js` file should now look like this:

```jsx
import React, { Component } from 'react';
import { Button, Container } from 'reactstrap';

import PostViewer from './PostViewer';
import PostEditor from './PostEditor';
import withAuth from './withAuth';

class App extends Component {
  state = {
    editing: null,
  };

  render() {
    const { auth } = this.props;
    if (auth.loading) return null;

    const { user, login, logout } = auth;
    const { editing } = this.state;

    return (
      <Container fluid>
        {user ? (
          <div>
            <Button
              className="my-2"
              color="primary"
              onClick={() => this.setState({ editing: {} })}
            >
              New Post
            </Button>
            <Button
              className="m-2"
              color="secondary"
              onClick={() => logout()}
            >
              Sign Out (signed in as {user.name})
            </Button>
          </div>
        ) : (
          <Button
            className="my-2"
            color="primary"
            onClick={() => login()}
          >
            Sign In
          </Button>
        )}
        <PostViewer
          canEdit={() => Boolean(user)}
          onEdit={(post) => this.setState({ editing: post })}
        />
        {editing && (
          <PostEditor
            post={editing}
            onClose={() => this.setState({ editing: null })}
          />
        )}
      </Container>
    );
  }
}

export default withAuth(App);
```

<video src="{% asset_path 'blog/graphql-express-react/signing-out.mp4' %}" class="center-image" autoplay width="800" controls></video>


## Add User Authentication to the Server

The web app now requires you to be logged in to create a post, but a savvy user could still modify the data by sending a request directly to your server. To prevent this, add some authentication to the server. You'll need to add Okta's Node SDK and the JWT Verifier as dependencies. You'll also need to use `dotenv` in order to read the variables from `.env.local`.

```bash
yarn add @okta/jwt-verifier@0.0.12 @okta/okta-sdk-nodejs@1.2.0 dotenv@6.0.0
```

At the top of your `src/server/index.js` file, you'll need to tell `dotenv` to read in the environment variables:

```javascript
require('dotenv').config({ path: '.env.local' });
```

You're going to need the frontend to send a JSON Web Token (JWT) so that users can identify themselves. When you get a JWT on the server, you'll need to verify it using Okta's JWT Verifier. To get more information about a user, you'll also need to use Okta's Node SDK. You can set these up near the top of your server, just after all the other `require` statements.


```javascript
const { Client } = require('@okta/okta-sdk-nodejs');
const OktaJwtVerifier = require('@okta/jwt-verifier');

const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
  issuer: `${process.env.REACT_APP_OKTA_ORG_URL}/oauth2/default`,
});

const client = new Client({
  orgUrl: process.env.REACT_APP_OKTA_ORG_URL,
  token: process.env.REACT_APP_OKTA_TOKEN,
});
```

Now that you're going to be using real users, it doesn't make as much sense to just send a string with the username, especially since that could change over time. It would be better if a post is associated with a user. To set this up, create a new `AUTHORS` variable for your users, and change the `POSTS` variable to just have an `authorId` instead of an `author` string:

```javascript
const AUTHORS = {
  1: { id: 1, name: "John Doe" },
  2: { id: 2, name: "Jane Doe" },
};

const POSTS = [
  { authorId: 1, body: "Hello world" },
  { authorId: 2, body: "Hi, planet!" },
];
```

In your schema, you'll no longer need the `author: String` input in `PostInput`, and `author` on `Post` should now be of type `Author` instead of `String`. You'll also need to make this new `Author` type:

```graphql
type Author {
  id: ID
  name: String
}
```

When looking up your user, you'll now want to pull the author from the `AUTHORS` variable:

```javascript
const mapPost = (post, id) => post && ({
  ...post,
  id,
  author: AUTHORS[post.authorId],
});
```

Now, you'll need to create a `getUserId` function that can verify the access token and fetch some information about the user. The token will be sent as an `Authorization` header, and will look something like `Bearer eyJraWQ...7h-zfqg`. The following function will add the author's name to the `AUTHORS` object if it doesn't already exist.

```javascript
const getUserId = async ({ authorization }) => {
  try {
    const accessToken = authorization.trim().split(' ')[1];
    const { claims: { uid } } = await oktaJwtVerifier.verifyAccessToken(accessToken);

    if (!AUTHORS[uid]) {
      const { profile: { firstName, lastName } } = await client.getUser(uid);

      AUTHORS[uid] = {
        id: uid,
        name: [firstName, lastName].filter(Boolean).join(' '),
      };
    }

    return uid;
  } catch (error) {
    return null;
  }
};
```

Now you can change the `submitPost` function to get the user's ID when they post. If the user isn't logged in, you can just return `null`. This will prevent the post from getting created. You can also return `null` if the user is trying to edit a post they didn't create.

```diff
-  submitPost: ({ input: { id, author, body } }) => {
-    const post = { author, body };
+  submitPost: async ({ input: { id, body } }, { headers }) => {
+    const authorId = await getUserId(headers);
+    if (!authorId) return null;
+
+    const post = { authorId, body };
     let index = POSTS.length;

     if (id != null && id >= 0 && id < POSTS.length) {
+      if (POSTS[id].authorId !== authorId) return null;
+
       POSTS.splice(id, 1, post);
       index = id;
     } else {
```

Your final `src/server/index.js` file should now look like this:

```javascript
require('dotenv').config({ path: '.env.local' });

const express = require('express');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const gql = require('graphql-tag');
const { buildASTSchema } = require('graphql');
const { Client } = require('@okta/okta-sdk-nodejs');
const OktaJwtVerifier = require('@okta/jwt-verifier');

const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
  issuer: `${process.env.REACT_APP_OKTA_ORG_URL}/oauth2/default`,
});

const client = new Client({
  orgUrl: process.env.REACT_APP_OKTA_ORG_URL,
  token: process.env.REACT_APP_OKTA_TOKEN,
});

const AUTHORS = {
  1: { id: 1, name: "John Doe" },
  2: { id: 2, name: "Jane Doe" },
};

const POSTS = [
  { authorId: 1, body: "Hello world" },
  { authorId: 2, body: "Hi, planet!" },
];

const schema = buildASTSchema(gql`
  type Query {
    posts: [Post]
    post(id: ID): Post
  }

  type Mutation {
    submitPost(input: PostInput!): Post
  }

  input PostInput {
    id: ID
    body: String
  }

  type Post {
    id: ID
    author: Author
    body: String
  }

  type Author {
    id: ID
    name: String
  }
`);

const mapPost = (post, id) => post && ({
  ...post,
  id,
  author: AUTHORS[post.authorId],
});

const getUserId = async ({ authorization }) => {
  try {
    const accessToken = authorization.trim().split(' ')[1];
    const { claims: { uid } } = await oktaJwtVerifier.verifyAccessToken(accessToken);

    if (!AUTHORS[uid]) {
      const { profile: { firstName, lastName } } = await client.getUser(uid);

      AUTHORS[uid] = {
        id: uid,
        name: [firstName, lastName].filter(Boolean).join(' '),
      };
    }

    return uid;
  } catch (error) {
    return null;
  }
};

const root = {
  posts: () => POSTS.map(mapPost),
  post: ({ id }) => mapPost(POSTS[id], id),
  submitPost: async ({ input: { id, body } }, { headers }) => {
    const authorId = await getUserId(headers);
    if (!authorId) return null;

    const post = { authorId, body };
    let index = POSTS.length;

    if (id != null && id >= 0 && id < POSTS.length) {
      if (POSTS[id].authorId !== authorId) return null;

      POSTS.splice(id, 1, post);
      index = id;
    } else {
      POSTS.push(post);
    }

    return mapPost(post, index);
  },
};

const app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

const port = process.env.PORT || 4000
app.listen(port);
console.log(`Running a GraphQL API server at localhost:${port}/graphql`);
```

You'll now need to make a few more frontend changes to make sure you're requesting an `author` object instead of assuming it's a string, and you'll need to pass in your auth token as a header.

The `PostViewer` component will need a minor update

```diff
diff --git a/src/PostViewer.js b/src/PostViewer.js
index 84177e0..6bfddb9 100644
--- a/src/PostViewer.js
+++ b/src/PostViewer.js
@@ -7,7 +7,10 @@ export const GET_POSTS = gql`
   query GetPosts {
     posts {
       id
-      author
+      author {
+        id
+        name
+      }
       body
     }
   }
@@ -34,7 +37,7 @@ const PostViewer = ({ canEdit, onEdit }) => (
               style={rowStyles(post, canEdit)}
               onClick={() => canEdit(post) && onEdit(post)}
             >
-              <td>{post.author}</td>
+              <td>{post.author.name}</td>
               <td>{post.body}</td>
             </tr>
           ))}
```

In `PostEditor` you'll just need to get rid of the `author` altogether since that won't be editable by the user, and will be determined by the auth token.

```diff
diff --git a/src/PostEditor.js b/src/PostEditor.js
index 182d1cc..6cb075c 100644
--- a/src/PostEditor.js
+++ b/src/PostEditor.js
@@ -25,8 +25,8 @@ const SUBMIT_POST = gql`

 const PostEditor = ({ post, onClose }) => (
   <FinalForm
-    onSubmit={async ({ id, author, body }) => {
-      const input = { id, author, body };
+    onSubmit={async ({ id, body }) => {
+      const input = { id, body };

       await client.mutate({
         variables: { input },
@@ -44,15 +44,6 @@ const PostEditor = ({ post, onClose }) => (
             {post.id ? 'Edit Post' : 'New Post'}
           </ModalHeader>
           <ModalBody>
-            <FormGroup>
-              <Label>Author</Label>
-              <Field
-                required
-                name="author"
-                className="form-control"
-                component="input"
-              />
-            </FormGroup>
             <FormGroup>
               <Label>Body</Label>
               <Field
```

Your Apollo Client is where you'll be sending the auth token. In order to access the auth token, you'll need some sort of closure. On each request, Apollo lets you modify headers. Change `src/apollo.js` to the following:

```javascript
import ApolloClient from 'apollo-boost';

let auth;

export const updateAuth = (newAuth) => {
  auth = newAuth;
};

export default new ApolloClient({
  uri: "http://localhost:4000/graphql",
  request: async (operation) => {
    const token = await auth.getAccessToken();
    operation.setContext({
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  },
});
```

Now you'll need to call the `updateAuth` component whenever `auth` changes in `src/withAuth.js`, to make sure that's always up to date.

```diff
diff --git a/src/withAuth.js b/src/withAuth.js
index cce1b24..6d29dcc 100644
--- a/src/withAuth.js
+++ b/src/withAuth.js
@@ -1,6 +1,8 @@
 import React from 'react';
 import { withAuth } from '@okta/okta-react';

+import { updateAuth } from './apollo';
+
 export default Component => withAuth(class WithAuth extends React.Component {
   state = {
     ...this.props.auth,
@@ -18,6 +20,8 @@ export default Component => withAuth(class WithAuth extends React.Component {
   }

   async updateAuth() {
+    updateAuth(this.props.auth);
+
     const authenticated = await this.props.auth.isAuthenticated();
     if (authenticated !== this.state.authenticated) {
       const user = await this.props.auth.getUser();
```

Now if you change `canEdit` in your `src/App.js` file once again, you can make it so users can only edit their own posts:

```javascript
onChange={(post) => user && user.sub === post.author.id}
```

<video src="{% asset_path 'blog/graphql-express-react/hey-there.mp4' %}" width="800"  class="center-image" autoplay controls></video>


## Learn more about GraphQL, React, Express and Web Security

You've now successfully built a GraphQL server, hooked it up to React, and locked it down with secure user authentication! As an exercise, see if you can switch the server from using simple, in-memory JavaScript objects to using a persistent data storage. For an example of using Sequelize in Node, check out [Randall's blog](/blog/2018/06/28/tutorial-build-a-basic-crud-app-with-node).

If you'd like to see the final sample code, you can find it [on github](https://github.com/oktadeveloper/okta-graphql-react-express-example).

If you'd like to learn more about GraphQL, Express, or React, check out some of these other posts on the Okta developer blog:

* [Build and Understand Express Middleware Through Examples](/blog/2018/09/13/build-and-understand-express-middleware-through-examples)
* [Build a Basic CRUD App with Node and React](/blog/2018/07/10/build-a-basic-crud-app-with-node-and-react)
* [Build and Understand a Simple Node.js Website with User Authentication](/blog/2018/08/17/build-and-understand-user-authentication-in-node)
* [Build a Health Tracking App with React, GraphQL, and User Authentication](/blog/2018/07/11/build-react-graphql-api-user-authentication)

If you have any questions about this post, please add a comment below. For more awesome content, follow [@oktadev](https://twitter.com/oktadev) on Twitter, like us [on Facebook](https://www.facebook.com/oktadevelopers/), or subscribe to [our YouTube channel](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q).