# vile-rubocop

A [vile](http://vile.io) plugin for [rubocop](https://github.com/bbatsov/rubocop).

## Requirements

- [nodejs](http://nodejs.org)
- [npm](http://npmjs.org)
- [ruby](http://nodejs.org)
- [rubygems](http://rubygems.org)
- [rubocop](http://github.com/bbatsov/rubocop)

## Installation

Currently, you need to have rubocop installed manually.

Example:

    npm i vile-rubocop
    gem install rubocop

Note: A good strategy is to use [bundler](http://bundler.io).

## Config

You can pass a custom config vile path `-c ...` as so:

```yaml
rubocop:
  config: "another.rubocop.yml"
```

## Ignoring Files

For now, ignoring is only supported via `rubocop.yml`

## Allowing Files

You can set `vile.allow` or `rubocop.allow` and this plugin will honour it.

Example:

```yaml
rubocop:
  allow:
    - app
    - spec
```

You can still specify included paths the normal Rubocop way, via `.rubocop.yml`.

## Architecture

This project is currently written in JavaScript. Rubocop provides
a JSON CLI output that is currently used until a more ideal
IPC option is implemented.

- `bin` houses any shell based scripts
- `src` is es6+ syntax compiled with [babel](https://babeljs.io)
- `lib` generated js library

## Hacking

    cd vile-rubocop
    npm install
    gem install rubocop
    npm run dev
    npm test
