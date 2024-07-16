# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Please see [the README](./README.md) for details of added rules.

## [5.2.1]

- Fix the rule `filename-match-export`: some export statements were (wrongly) ignored. Closes #31.

## [5.2.0]

- Reorganize the README file to list rules in alphabetical order
- Revise the documentation for the `no-ngxs-select-decorator` rule
- Include documentation links in error messages

## [5.1.3]

- Mention that `isNil` is also available in `criteo-angular-sdk` (private package)

## [5.1.2]

- Fix the removal of deprecated configurations

## [5.1.1]

### Changed

- Removal of the rules `deny-constructor-di` and `import-inject-object` from `@rdlabo/eslint-plugin-rules` because the auto-fix has too many issues:
  - It applies on irrelevant places cf https://github.com/rdlabo-team/eslint-plugin-rules/issues/1#issuecomment-1980955010
  - It gets lost with access modifiers cf https://github.com/rdlabo-team/eslint-plugin-rules/issues/4
  - It generates broken code cf https://github.com/rdlabo-team/eslint-plugin-rules/issues/5
- Removal of deprecated configurations

## [5.1.0]

### Added

- Enforce the usage of the `inject()` function for Dependency Injection in Angular with the rules `deny-constructor-di` and `import-inject-object` from `@rdlabo/eslint-plugin-rules`.
- Enable the rule `no-empty-function` from `@typescript-eslint`
- Forbid importing `HttpInterceptor` from `@angular/common/http` since functional HTTP interceptors should be preferred instead thanks to the rule `no-restricted-imports` from Typescript
- Enable the rule `deprecation` from `eslint-plugin-deprecation`
- Adapt the rules `filename` and `ngx-no-styles-in-component` to support the `styleUrl` property for Angular components

## [5.0.0]

### Changed

- [BREAKING] Angular 17 compatibility

## [4.13.0]

### Changed

- Rule `no-indexed-access-on-enums` disabled due to the bug https://github.com/criteo/eslint-plugin-criteo/issues/30
- Rule `ngx-component-display` now ignores components matching `^.*(?:Dialog|Modal)Component$` (previously, only `^.*DialogComponent$` were ignored)

## [4.12.0]

### Added

- New rule `no-indexed-access-on-enums`

## [4.11.1]

### Changed

- Fix rule `no-spreading-accumulators` with multiple spreads

## [4.11.0]

### Added

- New rule `no-spreading-accumulators`

## [4.10.0]

### Changed

- Define minimal Angular version (compatible with v13+)

## [4.9.0]

### Changed

- Removed Angular-specific rules from `recommended` to make it generic; `recommended-react` now extends `recommended`

### Added

- `recommended-angular` extends `recommended` and adds Angular-specific rules; this is then extended by `recommended-angular-app` and `recommended-angular-lib`
- New rule `ngx-no-styles-in-component`

### Deprecated

- `recommended-app`: prefer `recommended-angular-app`
- `recommended-lib`: prefer `recommended-angular-lib`
- `recommended-template`: prefer `recommended-angular-template`

## [4.8.0]

### Added

- `criteo/independent-folders`

## [4.7.0]

### Added

- Recommended rules from `eslint-plugin-eslint-comments`
- `eslint-comments/require-description`
- Override of `eslint-comments/disable-enable-pair` to allow whole-file disables

## [4.6.0]

### Added

- `criteo/no-null-undefined-comparison`

## [4.5.0]

### Changed

- `criteo/filename` now also checks the component folder name

## [4.4.0]

### Added

- `criteo/no-ngxs-select-decorator`
- `criteo/prefer-readonly-decorators`

## [4.3.0]

### Added

- `criteo/filename`
- `criteo/filename-match-export`

## [4.2.0]

### Added

- `criteo/until-destroy`
- React Lib rules

### Changed

- Fix typo in `react-hooks` plugin

## [4.1.0]

### Added

- Provide React rules

## [4.0.0]

### Changed

- [BREAKING] Upgrade Angular plugins to version 13 for compatibility with Angular 13
- [BREAKING] Move dependent plugins to peerDependencies so that they appear in the root node_modules (https://github.com/criteo/eslint-plugin-criteo/issues/15)
- [BREAKING] Update `engines` field in package.json to only allow npm versions >= 7

## [3.2.1]

### Changed

- Update `engines` field in package.json to allow node versions > 10

## [3.2.0]

### Added

- `cypress-no-force`

### Changed

- Add FIXMEs to `no-todo-without-jira-ticket`

## [3.1.0] - 2022-07-01

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
