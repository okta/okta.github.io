---
layout: blog_post
title: "IInterface Considered Harmful"
author: leebrandt
description: "This post discusses the disadvantages of using the 'I' prefix for interfaces in static-typed languages."
tags: [aspnetcore, netcore, interface, naming conventions]
tweets:
  - "Still using the 'I' to prefix interfaces? Check this out before you do!"
  - "If you still prefix interface types with an 'I', stop and check this out first!"
  - "There's no longer any reason to prefix interfaces with an 'I'. In fact, there is a good reason not to!!"
image: blog/featured/okta-dotnet-skew.jpg
---

Developers have been lauded as being early adopters when it comes to technology products, but they seem to be late bloomers when it comes to dropping old habits. It took years of convincing and some guidance from Microsoft to get .NET developers to stop using Hungarian Notation in their programs, but there's is one last "comfort blanket" it left: developers still use the "I" prefix for interfaces. I want it to stop. Let it go. It's over. Hungarian Notation lost in 2003.

>NOTE: While this post uses .NET and C# as examples, it really applies to all statically-typed languages that were infected with the Hungarian Notation disease.

## What Is Hungarian Notation?

If you're a relatively new .NET developer, you might never have used Hungarian Notation before, so let me explain. Hungarian Notation is a naming convention for variables that helps developers that read your code later (including future you) to discern what the type for that variable was meant to be. As an example:

```cs
public class clsPerson
{
  var strName = txtName.Value;
  
  public fnGetByName()
  {
    var strQuery = "SELECT * FROM tblPeople WHERE Name = " + strName;
  }
}
```

Now, this may be an extreme example. There weren't a lot of developers that went with the `clsClassName` convention, but some _still_ do things like naming class-level variables with a 'm_' prefix like 'm_strName'.

## This is No Longer Necessary

In the early days of programming, IDEs weren't much more than glorified text editors. There wasn't much in the way of syntax highlighting and _nothing_ in the way of contextual help. Using these prefixes helped developers who were writing code in Notepadesque developer tools with a little bit of discovery about a programmer's intentions. If you meant for this variable to be used as a string, prefixing it with `str` actually helped convey your intentions to those who came after you.

With the rich developer tools available today, there is no reason for this. The color of a variable or type tells you most of what you need to know about it. If that's not enough, the contextual help systems in most IDEs will tell you more about that type than any naming convention.

For the most part software development has left those conventions behind, but the "I" before an interface type persists.

You might be thinking, "Well Microsoft still uses the 'I' interface naming convention." That is true, and I would argue that it buys them nothing. Visual Studio already colors the `interface` type differently from a `class` type. If I have any other questions, hovering over the type will tell me what I might need to implement, and `F12` will even take me to the code!

## What's The Harm?

You might now be thinking, "Yeah maybe it doesn't _buy_ me anything, but there's no real harm is there?"

I would argue that there is one big harmful side effect of using the "I" prefix for interfaces: It keeps developers from understanding the use and the power of interfaces. A little story about this.

Many years ago, I was training an experienced mainframe programmer in the ways of C# and .NET. He had many years of experience writing procedural code, but this was his first foray into object-orientation. He picked up most of it very quickly, so I gave him a small programming task in the project we were working on. I walked him through a similar piece of the application and showed him how you coded to abstraction with interfaces. He then went off to code his small piece.

When I began my code review I noticed a class, call it the `PersonRepository` class. He also had an `IPersonRepository` interface. I thought, "Great, he got it!", but when I opened the interface there were no method signatures in it. The class did exactly what it should, but the interface was doing nothing.

This was not an isolated incident with developers over the years. Understanding of interfaces among developers that I have trained and worked with ranges from complete ignorance that interfaces exist to misunderstanding what they are used for. I was there myself for quite a few years when I started. My only exposure to interfaces was `IDisposable`, and I never used them in my own code. When I have forced developers to drop the "I" from interfaces the purpose of interfaces comes quickly and sharply into focus.

## Do You Really Understand Interfaces?

If I had told that developer *NOT* to use the "I" prefix for interfaces, the `IPersonRepository` now becomes `PersonRepository`. The first thought is, "What do I call the `PersonRepository` class now?"

This is your first step to really grokking interfaces. `PersonRepository` is a generic name. Other than the fact that it works with people and probably some sort of storage, there's nothing telling you about the implementation of it, which is what you _want_ in an interface. It should tell you _what_ the things that implement it are meant to do. Which means that the implementation name should tell you a bit about _how_ it will implement it. If you're going to save to a SQL Server database, call it `SqlPersonRepository`. Now you should understand that `PersonRepository` is an _abstraction_ and `SqlPersonRepository` is a concrete implementation of the abstraction. Interfaces level one achievement unlocked.

The next step, is when you see that you can implement that _same_ interface in different ways, and you have a `MySqlPersonRepository`, an `InMemoryPersonRepository`, and a `PostgresPersonRepository`, and you let your dependency injection framework or your service locator find the right implementation while referring only to the interface in your code. Interfaces level two achievement unlocked.

```cs
public interface PersonRepository
{
  IEnumerable<Person> GetAll();
  Person GetById(int id);
}

public class SqlPersonRepository : PersonRepository
{
  //GetAll() and GetById() implementation
}

public class InMemoryPersonRepository : PersonRepository
{
  //GetAll() and GetById() implementation
}

public class PersonController : Controller
{
  public PersonController(PersonRepository personRepository)
  {
    this.personRepository = personRepository;
  }

  public ActionResult Index()
  {
    return View(this.personRepository.GetAll().ToList());
  }

  public ActionResult Person(int id)
  {
    return View(this.personRepository.GetById(id));
  }
}
```

As you can see dropping the "I" from the interface forces more useful names for the implementation classes. These are easily switchable in the dependency injection container. So if you work in a large enterprise where getting a database procured can take a while, you can just use the `InMemoryPersonRepository` implementation until the database is ready. I've done it at clients before and it works seamlessly.

>NOTE: Let's ignore `async` for a minute and focus on the usage here.

You now have two new levels of understanding of interface (and abstractions in general), just because you dropped the "I" and were forced to find a new name for the concrete class.

A bonus third level is that interfaces _should_ be used like classes. They are, after all, abstractions of those classes.

## Overcome One Last Hurdle

If you haven't rage-closed your browser and you're still with me, you might have one last question: "What if I want to provide a 'default' implementation?".

This is especially important for library developers. Microsoft does this with things like the `IClaimsPrincipal` and their default implementation of `ClaimsPrincipal`. I would suggest one of two approaches:

You could provide a "default" implementation by using an abstract class instead of an interface. Just be aware that if you intend your consumers to inherit from this class, you should stick to an interface since you can only inherit from one class but you can implement many interfaces. This leaves some flexibility for developers consuming your code later.

Probably the more desirable is to call the interface `ClaimsPrincipal` and the default implementation `DefaultClaimsPrincipal`. This lets every consumer of that class know that this is the default implementation and also conveys the idea that the consumer of the library _could_ provide their own implementation.

Also by dropping the "I" from the interface in _your_ code, you pass along those same benefits to consumers of your library. Everybody wins!

## Learn More About Secure App Development in .NET

Want to learn more about .NET and software development in general? Check out these killer posts!

* [Five Essential Tips for Building Developer Libraries](https://developer.okta.com/blog/2019/06/10/five-essential-tips-for-building-developer-libraries)
* [Why JWTs Suck as Session Tokens](https://developer.okta.com/blog/2017/08/17/why-jwts-suck-as-session-tokens)
* [Visual Studio 2019 Tips and Tricks](https://developer.okta.com/blog/2019/03/25/visual-studio-2019-tips-and-tricks-aspnet)

As always if you have comments, leave them below. If you don't want to miss out on any of our super cool content, follow us on [Twitter](https://twitter.com/oktadev) and [YouTube](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q).
