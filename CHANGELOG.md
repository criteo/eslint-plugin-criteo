# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Please see [the README](./README.md) for details of added rules.

## [Unreleased]
### Added
- `no-todo-without-jira-ticket`

## [3.0.0] - 2022-06-01
### Changed
- Upgrade @angular-eslint packages to v12.7.0

## [2.4.3] - 2022-03-28
### Changed
- Update project description in package.json

## [2.4.2] - 2022-03-28
### Added
- Define repository and bug tracking URL in package.json

### Changed
- Update README
- Update license in package.json

## [2.4.1] - 2022-03-18
### Changed
- Disable `rxjs/finnish` on functions and methods

## [2.4.0] - 2022-03-11
### Added
- `@angular-eslint`: recommended rules and various other rules from this plugin
- `@angular-eslint/template`: `no-call-expression` and various accessibility rules
- `cypress`: recommended rules and `no-force`

### Changed
- Update README

## [2.3.0] - 2022-03-11
### Added
- `rxjs` plugin: recommended rules and `finnish`
- Enforce use of `untilDestroyed` when subscribing

## [2.2.0] - 2022-03-10
### Added
- `recommended-template` config
- `@angular-eslint/template`: recommended rules and `use-track-by-function`

## [2.1.0] - 2022-03-10
### Added
- `no-only-tests` rule

## [2.0.0] - 2022-03-10
### Added
- Recommended rules from `eslint` and `typescript-eslint`

### Changed
- Upgrade `@typescript-eslint/parser` to v5.11.0

## [1.0.0] - 2022-03-04
Initial version

### Added
- `recommended-app` and `recommended-lib` templates
- Rules `ngx-component-display` and `ngxs-selector-array-length`
- Rule `rxjs/no-unsafe-takeuntil`
- Rules `simple-import-sort/exports` and `simple-import-sort/imports`
