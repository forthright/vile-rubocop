# vile-rubocop

A [Vile](http://vile.io) plugin for identifying common style and
maintainability issues in your Ruby code (via [Rubocop](https://github.com/bbatsov/rubocop)).

## Requirements

- [Node.js](http://nodejs.org)
- [Ruby](https://www.ruby-lang.org)

## Installation

Currently, you need to have rubocop installed manually.

Example:

    npm i -D vile vile-rubocop
    gem install rubocop

Note: A good strategy is to use [Bundler](http://bundler.io).

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

## Versioning

This project uses [Semver](http://semver.org).

## Licensing

This project is licensed under the [MPL-2.0](LICENSE) license.

Any contributions made to this project are made under the current license.

## Contributions

Current list of [Contributors](https://github.com/forthright/vile-rubocop/graphs/contributors).

Any contributions are welcome and appreciated!

All you need to do is submit a [Pull Request](https://github.com/forthright/vile-rubocop/pulls).

1. Please consider tests and code quality before submitting.
2. Please try to keep commits clean, atomic and well explained (for others).

### Issues

Current issue tracker is on [GitHub](https://github.com/forthright/vile-rubocop/issues).

Even if you are uncomfortable with code, an issue or question is welcome.

### Code Of Conduct

By participating in this project you agree to our [Code of Conduct](CODE_OF_CONDUCT.md).

### Maintainers

- Brent Lintner - [@brentlintner](http://github.com/brentlintner)

## Architecture

This project is currently written in JavaScript. Rubocop provides
a JSON CLI output that is currently used until a more ideal
IPC option is implemented.

- `bin` houses any shell based scripts
- `src` is es6+ syntax compiled with [Babel](https://babeljs.io)
- `lib` generated js library

## Developing

    cd vile-rubocop
    npm install
    gem install rubocop
    npm run dev
    npm test
