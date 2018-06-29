---
layout: blog_post
title: "Three Developer Tools I'm Thankful For"
author: rdegges
description: "What developer tools do you use every day? To celebrate Thanksgiving, here's a list of Randall Degges' favorite developer tools. Learn why he likes them and how they can help you."
tags: [holiday, tools]
tweets:
    - "@rdegges really likes zsh, vim, and tmux. What about you?"
    - "What developer tools are you thankful for?"
redirect_from:
    - "/blog/2017/11/22/three-developer-tools-im-thankful-for"
---

I've been writing code since I was 12 years old. When I first got started, I
was using an old MSDOS computer that was given to my family by a member of our
church. I've always been really thankful that person gave my family a computer,
as without it, I doubt I'd be the person I am today.

Each year around Thanksgiving time I always try to sit back, relax, and think
about how thankful I am for everything I have. I have a cool job (thanks
[@oktadev](https://twitter.com/oktadev)!), an awesome wife
([@samanthadegges](https://twitter.com/samanthadegges)), a great family,
incredible friends, and some particularly awesome co-workers (shout out!):

- [@nbarbettini](https://twitter.com/nbarbettini)
- [@mraible](https://twitter.com/mraible)
- [@leebrandt](https://twitter.com/leebrandt)
- [@SalaTzar](https://twitter.com/SalaTzar)
- [@LindsayB610](https://twitter.com/LindsayB610)
- [@kaifubrent](https://twitter.com/kaifubrent)
- [@omgitstom](https://twitter.com/omgitstom)

I could probably write an entire essay about all the amazing people I know and
friends I have, but I'll save that for another time. Today I wanted to reflect
on something a little more in line with the theme of this website: my favorite
developer tools of all time.

These are the tools I use every single day, and have been using for many years.
A lot of the time I take them for granted since I use them constantly, but
they're all essential tools in my development arsenal, and I want to take a
minute to share just why I'm so thankful for them.


## Vim

{% img blog/thankful/vim.png alt:"Vim" width:"600" %}{: .center-image }

If you've ever met me in person (or seen me online), you probably know that I'm
pretty old school. I learned how to use [Vim](https://vim.sourceforge.io/)
sometime around the year 2000, and it just stuck. Over the years I've tried
using new modern IDEs, but they never stick. Vim has always just clicked with
me. It matches my style: simple and basic, but powerful >:)

I'm a quick typist, and I prefer to keep my hands on the keyboard at all times.
Vim lets me navigate around quickly, performing even complicated tasks without
moving my hands. Once you get used to Vim motion keys, your editing powers
become magical.

In addition to this, Vim has an incredible community of developers who build
insanely useful plugins that add features to the editor. I use quite a few
myself:

- [Vundle](https://github.com/VundleVim/Vundle.vim)
- [vim-fugitive](https://github.com/tpope/vim-fugitive)
- [python.vim](https://github.com/vim-scripts/python.vim--Vasiliev)
- [django.vim](https://github.com/vim-scripts/django.vim)
- [vim-markdown](https://github.com/tpope/vim-markdown)
- [neocomplcache](https://github.com/Shougo/neocomplcache.vim)
- [delimitMate](https://github.com/Raimondi/delimitMate)
- [syntastic](https://github.com/vim-syntastic/syntastic)
- [vimroom](https://github.com/mikewest/vimroom)
- [vim-gitgutter](https://github.com/airblade/vim-gitgutter)
- [matchit.zip](https://github.com/vim-scripts/matchit.zip)
- [vim-go](https://github.com/fatih/vim-go)
- [vim-colors-solarized](https://github.com/altercation/vim-colors-solarized)
- [vim-pug](https://github.com/digitaltoad/vim-pug)
- [vim-stylus](https://github.com/wavded/vim-stylus)
- [emmet.vim](https://github.com/mattn/emmet-vim)
- [vim-node](https://github.com/moll/vim-node)
- [vim-indent-guides](https://github.com/nathanaelkane/vim-indent-guides)
- [html5.vim](https://github.com/othree/html5.vim)
- [ultisnips](https://github.com/SirVer/ultisnips)
- [vim-snippets](https://github.com/honza/vim-snippets)
- [vim-coloresque](https://github.com/gko/vim-coloresque)
- [vim-surround](https://github.com/tpope/vim-surround)

If you want to check out my Vim dotfiles, you can do so
[here](https://github.com/rdegges/dot-vim).

Vim (and its community) are awesome. Thank you
[Bram](http://www.moolenaar.net/) for creating it all those years ago.

Finally: if you want to support Vim and show your thanks as well, please
consider donating to become an [official Vim sponsor](https://vim.sourceforge.io/sponsor/index.php). Vim has been collecting
money for a non-profit that [helps children in Uganda](http://iccf-holland.org/).

Plus, if you donate $100 or more you get your name on the Vim donors
[hall of honour](https://vim.sourceforge.io/sponsor/hall_of_honour.php) forever (where
you can join me!).


## tmux

{% img blog/thankful/tmux.png alt:"tmux" width:"600" %}{: .center-image }

I can't have a conversation about awesome developer tools without mentioning
[tmux](https://github.com/tmux/tmux). Every single time I open a terminal it's
the first command I run.

tmux is my absolute favorite terminal multiplexer. If you aren't familiar with
terminal multiplexers, they're command line interfaces that allow you to manage
multiple terminals in a seamless way.

You can create new terminals, split them in your screen, move them around,
customize your window names, suspend and resume them, and all sorts of other
fancy stuff.

In short: terminal multiplexers make working on the command line not only
pleasant, but pleasurable.

The two most popular multiplexers are [GNU
Screen](https://www.gnu.org/software/screen/) (which I used to use), and tmux
(which is relatively newer). I discovered tmux a handful of years ago or so,
and haven't looked back. It's fast, highly customizable, and intuitive to use.

I've customized my tmux setup quite a bit. The biggest change I've made (other
than stylistic improvements) was to customize the way that splitting windows
works: I'm able to use my tmux binding key (ctrl-a) + | to create a vertical
split (notice how the pipe character looks like a vertical split line), and
(ctrl-a) + - to create a horizontal split (notice how the dash character looks
like a horizontal split line). This makes creating complex window arrangements
easy and intuitive.

Finally, I also customized tmux so that I can use the binding key (ctrl-a) +
any Vim movement key to move seamlessly between windows.

When combined with Vim, tmux is a beast. It makes editing and working on large,
complicated projects extremely painless and quick.

If you'd like to check out my tmux dotfiles, you can do so
[here](https://github.com/rdegges/dot-tmux).

Thank you [Nicholas Marriott](https://github.com/nicm) for developing such a
useful and handy tool.


## zsh

{% img blog/thankful/zsh.png alt:"zsh" width:"600" %}{: .center-image }

Literally everything I do on the command line is powered by the Z shell
([zsh](http://www.zsh.org/)) and the aptly named [oh-my-zsh](http://ohmyz.sh/)
project which bootstraps it.

Most developers are used to using Bash as their standard shell, but zsh
provides some incredibly nice features (especially when paired with oh-my-zsh):

- Easy to install plugins
- A massive community
- Fast, incremental search
- Incredible customization
- SPEED!

I have a ton of customization built into my shell, which allows me to do things
like easily search for previously entered commands, quickly launch programs,
compose chains of programs using simple macros, etc.

Through the course of a day my zsh shortcuts save me many minutes worth of
typing. Since I've been using it for years now, that really adds up!

If I conservatively estimate that zsh has saved me roughly 10 minutes of typing
per day (which I'd say is a fair estimate based on the amount of time I spend
on my computer each day), and assuming I've been using zsh for roughly ~6
years, that adds up to roughly ~15.21 days of saved human time!

That's pretty incredible!

If you'd like to check out my zsh dotfiles, you can do so [here](https://github.com/rdegges/dot-zsh).

Thank you very much Paul for creating zsh, and [Robby](https://twitter.com/robbyrussell)
for creating oh-my-zsh. You guys are amazing.


## Happy Thanksgiving

{% img blog/thankful/turkey.png alt:"turkey" width:"600" %}{: .center-image }

It was fun taking a few minutes to write about my favorite three developer
tools.

If you're wondering why they're all command-line based: it's because that's
where I spend 99% of my time.

Regardless of what sort of developer you are, or what sort of tools you use, I
hope you have an awesome Thanksgiving.

-Randall
