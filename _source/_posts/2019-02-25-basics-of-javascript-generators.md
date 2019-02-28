---
layout: blog_post
title: "The Basics of JavaScript Generators"
author: leebrandt
description: "This post defines and demonstrates JavaScript Generators and their uses."
tags: [ javascript, javascript generators, generators]
tweets:
- "Build your first JavaScript Generator and find out what you can do with them! →"
- "JavaScript Generators! Uh... What are they good for? We've got you covered. (Say it again) <3"
- "Let @leebrandt show you how to build your first JavaScript Generator (and explain why they're cool)! →"
image: blog/featured/okta-node-skew.jpg
---

JavaScript does a pretty good job of iterating over collections. But what if you don't know what the collection is, or how big it will be? What if the thing you want to iterate over doesn't have an iterator to use? JavaScript generators can help!

## What Are JavaScript Generators?
JavaScript generators are just ways to make iterators. They use the `yield` keyword to _yield_ execution control back to the calling function and can then resume execution once the `next()` function is called again. Once the generator runs out of values to return, it returns a value of undefined, and a `done` value of `true`, letting you know that there are no more values. This makes more sense if you can see a simple example.

```js
function* foo() {
  yield 'a';
  yield 'b';
  yield 'c';
}

const foogee = foo();

console.log('getting the first value');
console.log(foogee.next());
console.log('getting the next value');
console.log(foogee.next());
console.log('getting the next value');
console.log(foogee.next());
console.log('getting the next value');
console.log(foogee.next());
```

The function `foo()` is a generator function, indicated by the `*` after the `function` declaration. The constant `foogee` instantiates the `foo` generator function, but simply returns a type of iterator called a Generator. The `next()` function always returns an object with a `value` and a `done` property. The very first time `next()` is called on the Generator, the function executes the first line which yields execution control back to the caller with a return value of:

```sh
{ value: 'a', done: false }
```

The program logs it to the console. The program then calls `next()` again, which resumes execution of the generator, yielding a value of:

```sh
{ value: 'b', done: false }
```

The third time, it yields the return object with a value of:

```sh
{ value: 'c', done: false }
```

Now the generator is out of values to `yield`, so the next time the program calls `next()`, it returns:

```sh
{ value: undefined, done: true }
```

From this point on, no matter how many more times the program calls `next()` it will always return that object.

## What Would I Use JavaScript Generators For?
You might think, "That's cool, but I can already iterate over collections in JavaScript. Why would I need to create a JavaScript Generator?" 

That's a fair question. What about things that don't automatically come in a collection? Like the all-powerful Fibonacci Sequence?

```js
function* fibonacci() {
  let current = 0;
  let next = 1;

  while(true){
    yield current;
    [current, next] = [next, current + next];
  }
}

const gen = fibonacci();
for(let i = 0; i < 10; i++){
  console.log(gen.next().value);
}
```

This `fibonacci` generator simply yields the next value in the Fibonacci sequence. There isn't really a `Fibonacci` array in JavaScript to iterate over so you need to make your own.

## A More Practical Use for JavaScript Generators
While it's totally cool to nerd out on creating `fibonacci` generator functions, it's not super useful for all of you out there writing business software, right? So how about dates? There's no real way to iterate over all the days in a month or the next thirty days. Create a JavaScript Generator for that!

```js
function* dateGenerator(startDate = new Date()) {
  let currentDate = startDate;
  while (true) {
    yield currentDate;
    currentDate.setDate(currentDate.getDate() + 1);
  }
}

console.log('Next 30 Days');
const dates = dateGenerator();
for(let i = 0; i < 30; i++){
  console.log(dates.next().value.toDateString());
}
```

This kind of generator can be _super_ useful in everyday business software. Think about creating calendars in a React, Angular, or Vue app. What about saving a reminder to a todo list every day for the next 30 days?

Normally, you'd have to create an array of these values by looping over the line that sets the date.

```js
currentDate.setDate(currentDate.getDate() + 1);
```

Once you had the size of array you want, it would loop over that array to get the value you want. This is particularly useful for those kinds of things that don't readily have a collection that you can iterate over.

What uses can _you_ think of for generators?

## Learn More JavaScript Goodness!
Want to know more about JavaScript, Node, Angular, and React? Check out this cool content from our developer blog:

* [The History (and Future) of Asynchronous JavaScript](/blog/2019/01/16/history-and-future-of-async-javascript)
* [Angular 7: What's New and Noteworthy](/blog/2018/12/04/angular-7-oidc-oauth2-pkce)
* [Build Your First PWA with Angular](/blog/2019/01/30/first-angular-pwa)
* [Modern Token Authentication in Node](/blog/2019/02/14/modern-token-authentication-in-node-with-express)

If you enjoyed this post, follow us on [Twitter](https://twitter.com/oktadev), and [YouTube](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q) so you're always up on what's new and noteworthy!

