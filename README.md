@brentlintner/vile-rubocop
------------

[![NPM version](https://badge.fury.io/js/vile-rubocop.svg)](http://badge.fury.io/js/vile-rubocop)

A [vile](http://vile.io) plugin for rubocop.

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
