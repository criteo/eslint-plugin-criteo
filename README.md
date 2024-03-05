# eslint-plugin-criteo

This ES lint plugin defines custom rules we use at Criteo and exposes a recommended set of rules.

## Installation

```sh
npm install eslint eslint-plugin-criteo --save-dev
```

Like any library, keep it updated to make sure your project follows the latest coding recommendations.

## Usage

Add `criteo` to the plugins section of your `.eslintrc` configuration file and apply:

- `plugin:criteo/recommended-angular-app` if the project is an Angular application (formerly, now deprecated, `recommended-app`)
- `plugin:criteo/recommended-angular-lib` if the project is an Angular library (formerly, now deprecated, `recommended-lib`)
- `plugin:criteo/recommended-react-app` if the project is a React application
- `plugin:criteo/recommended-react-lib` if the project is a React library
- `plugin:criteo/recommended` for general-purpose rules which are included in all the above recommended configs
- `plugin:criteo/recommended-angular-template` for Angular HTML templates (formerly, now deprecated, `recommended-template`)

```json
{
  "plugins": ["criteo"],
  "overrides": [
    {
      "files": ["*.ts"],
      "extends": ["plugin:criteo/recommended-angular-app"], // or recommended-react-app, recommended-angular-lib...
      [...]
    },
    {
      "files": ["*.html"],
      "extends": ["plugin:criteo/recommended-angular-template"],
      [...]
    }
  ]
}
```

Then configure/disable the rules under the rules section, following your project's context and constraints.

```json
{
  "rules": {
    "criteo/rule-1": ["error", { "custom-config-key": "custom-config-value" }],
    "criteo/rule-2": "off"
  }
}
```

## Pre-commit Git hook

As a developer, it can be very frustrating to get a change rejected by QA bot because the code does not respect an ES lint rule. Even more if the failing rule has an auto-fix! To avoid it, you can configure your project to run ES lint automatically on pre-commit. Because it will target only staged files, it is quite fast!

1. Define the pre-commit hook script `.git-hook-lint-staged` at the root of the first/main UI project of the repository. It will make it available to all developers since Git hooks cannot be pushed directly.

```sh
#!/bin/sh
cd project1 && npx lint-staged \
  && cd ../project2 && npx lint-staged # If the repository hosts several projects, add each of them
```

2. Also define the `postinstall` NPM script in the `scripts` section of `package.json`:

```
"scripts": {
  "postinstall": "npx shx cp .git-hook-lint-staged ../.git/hooks/lint-staged"
}
```

It will enable the hook automatically after `npm install`.

3. Still in the same project, install `shx` to make the copy command work on all environments: `npm install --save-dev shx`

4. Install `lint-staged` in each UI project of the repository: `npm install --save-dev lint-staged`

5. In each project, also define its configuration by declaring in `package.json`:

```
"lint-staged": {
  "**.{ts,component.html}": "eslint --fix"
}
```

You can also declare `"*.{ts,component.html,json,scss}": "prettier --write"` if you use Prettier.

🙌

## Criteo rules

### cypress-no-force

_Cypress: disallow using of 'force: true' option._

Why?

The Cypress ESLint plugin provides this rule, with the following explanation:

> Using `force: true` on inputs appears to be confusing rather than helpful.
> It usually silences the actual problem instead of providing a way to overcome it.
> See [Cypress Core Concepts](https://docs.cypress.io/guides/core-concepts/interacting-with-elements.html#Forcing).

Unfortunately, the Cypress plugin's version only works when calling the function like `cy.get(...).click({ force: true })`,
i.e. with `cy` in the same line. But in our code we often use helper functions, so the rule does not detect our usages.
This new version of the rule leverages TypeScript to work out if the method is called on a `Cypress.Chainable` object.

### filename

_Ensure file names are valid and consistent._

Config:

- `pattern`: allowed name pattern (default: `/^[a-z0-9\.\-]+$/`)

Why?

Improve the file tree readability. For example, a component called `MyButtonComponent` should be defined under the path `*/my-button/my-button.component.{html,ts,css,scss,...}`.

### filename-match-export

_Ensure file names reflect the named exported members._

Config:

- `removeFromFilename`: text removed from file names before check (default: `[]`)

Why?

The name of the file should describe its content for readability.

### independent-folders

_Ensure feature folders are independent by preventing imports between each other. Features folders imports are also forbidden from the shared modules._

Config:

- `basePath`: base path (from the project) applied to all `featureFolders` and `sharedFolders` (default: `./`)
- `featureFolders`: array of the feature folders paths that should remain independent (default: `[]`)
- `sharedFolders`: array of the shared folders paths that cannot use any feature folder (default: `[]`)

Sample :

```
'criteo/independent-folders': [
  'error',
  {
    basePath: './src/app/',
    featureFolders: ['broad-targeting-audience', 'similar-audience'],
    sharedFolders: ['shared'],
  },
],
```

Why?

To avoid messy and circular imports:

- Feature folders should be independent or use each others using the public API.
- Shared folders should not rely on feature folders.

### ngx-component-display

_Ensure Angular components have a display property set._

Config:

- `ignore`: classes whose names match this regular expression (defined as string) will be ignored (default: `'^.*(?:Dialog|Modal)Component$'`)
- `propertyName`: name of the display property (default: `'cdsDisplay'`)

Why?

- By default, custom components are displayed as `inline` by the browser which is rarely what we expect. For example, it makes impossible to define a width or margins on them. E.g. `<my-component class="w-100 cds-mb-3"></my-component>` would have no effect.
- The workaround of wrapping them in `<div></div>` should be avoided to not make the DOM and the bundle file heavier.

### ngx-no-styles-in-component

_Forbid using `styles`, `styleUrl` or `styleUrls` in a component's metadata: favour the Criteo design system instead._

Why?

To maintain a coherent user experience, we aim to use the classes and components from the shared component library as much as possible, as opposed to custom styles.

### no-indexed-access-on-enums

_Forbid accessing an enum thanks to an index: Enum[0]._

Why?

The names of the enum values should not be "data" in the context of the application at runtime. This brings a lack of clarity, a lack of readability, maintenance issues, and can be error-prone.

### no-ngxs-select-decorator

_Forbid using the NGXS `@Select()` decorator: `@ViewSelectSnapshot()` should be preferred._

Why?

`@Select()` exposes an `Observable` that must be subscribed using the `async` pipe in the template. It makes it verbose and creates one subscription per usage. However, the `@ViewSelectSnapshot()` exposes the raw value directly and refreshes the view on every change ; making it more concise and easier to use.

### no-null-undefined-comparison

_Forbid comparisons with `null` and `undefined`._

Why?

The difference between `null` and `undefined` is specific to Javascript and can be tricky for juniors/backend developers. Most of the time, we don't need to distinguish these 2 values, so using `isNil` from _lodash_ is safer.

### ngxs-selector-array-length

_Ensure that when using the @Selector() decorator, the number of selectors passed in matches the number of arguments passed to the selector function._

Why?

It can be tricky to pin down the source of an error when using the @Selector() decorator. While this rule can't make sure you put all the parameters in the right order, it does avoid the most obvious mistakes.

### no-spreading-accumulators

_Ensure that reducers do not mistakenly have O(n^2) complexity._

Why?

When using `.reduce()`, it may be tempting to do something like this for the sake of brevity:

```
const mappedById = myArray.reduce((acc, entity) => ({ ...acc, [entity.id]: entity }), {});
```

However, spreading the accumulator at every iteration results in an operation with O(n^2) time & spatial complexity.

This rule helps ensure that `.reduce()` is an O(n) operation. For example:

```
const mappedById = myArray.reduce((acc, entity) => { acc[entity.id] = entity; return acc; }, {});
```

### no-todo-without-ticket

_Ensure that comments with TODO or FIXME specify a JIRA ticket in which the work will be completed._

Why?

Commits with TODO comments indicating that a portion of functionality has yet to be implemented are easy to overlook later on. This rule encourages all outstanding work to be tracked by an external ticket as well as in code comments.

### prefer-readonly-decorators

_Ensure that appropriate decorated properties are `readonly`._

Config:

- `decorators`: array of decorator names that should always be `readonly` (default: `['Output', 'ViewSelectSnapshot']`)

Why?

Some decorated properties should be `readonly` because their decorator handles the value assignment and should never be assigned by hand (ex: `@ViewSelectSnapshot()`), or their value should never change (ex: `@Output()`) to prevent errors.

### until-destroy

_Ensure @UntilDestroy() decorator is not forgotten, nor applied when it is not necessary._

Why?

`@UntilDestroy()` defines mandatory properties in decorated class to make the `untilDestroyed` operator work.
Nevertheless, the decorator should not be applied when it is not necessary because it would inject useless code.

## External rules

In addition to the rules defined above, we have chosen some rules from external libraries which we activate by default.
Some of these have custom config to better address our specific use cases.

| Library            | Rule name                                                                          | Documentation                                                                                                                               | Applies to Angular applications | Applies to Angular libraries | Applies to React applications | Applies to React library |
| ------------------ | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ---------------------------- | ----------------------------- | ------------------------ |
| @rdlabo            | `@rdlabo/rules/deny-constructor-di`                                                | https://github.com/rdlabo-team/eslint-plugin-rules/blob/main/docs/rules/deny-constructor-di.md                                              | ✅                              | ✅                           |                               |                          |
| @rdlabo            | `@rdlabo/rules/import-inject-object`                                               | https://github.com/rdlabo-team/eslint-plugin-rules/blob/main/docs/rules/import-inject-object.md                                             | ✅                              | ✅                           |                               |                          |
| Angular            | All recommended rules from `@angular-eslint/template`                              | https://github.com/angular-eslint/angular-eslint/tree/master/packages/eslint-plugin-template/docs/rules                                     | ✅                              | ✅                           |                               |                          |
| Angular            | All recommended rules from `@angular-eslint`                                       | https://github.com/angular-eslint/angular-eslint/tree/master/packages/eslint-plugin/docs/rules                                              | ✅                              | ✅                           |                               |                          |
| Angular            | `@angular-eslint/no-lifecycle-call`                                                | https://github.com/angular-eslint/angular-eslint/blob/master/packages/eslint-plugin/docs/rules/no-lifecycle-call.md                         | ✅                              | ✅                           |                               |                          |
| Angular            | `@angular-eslint/no-pipe-impure`                                                   | https://github.com/angular-eslint/angular-eslint/blob/master/packages/eslint-plugin/docs/rules/no-pipe-impure.md                            | ✅                              | ✅                           |                               |                          |
| Angular            | `@angular-eslint/prefer-on-push-component-change-detection`                        | https://github.com/angular-eslint/angular-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-on-push-component-change-detection.md | ✅                              | ✅                           |                               |                          |
| Angular            | `@angular-eslint/relative-url-prefix`                                              | https://github.com/angular-eslint/angular-eslint/blob/master/packages/eslint-plugin/docs/rules/relative-url-prefix.md                       | ✅                              | ✅                           |                               |                          |
| Angular            | `@angular-eslint/template/alt-text`                                                | https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/docs/rules/alt-text.md                           | ✅                              | ✅                           |                               |                          |
| Angular            | `@angular-eslint/template/elements-content`                                        | https://github.com/angular-eslint/angular-eslint/blob/master/packages/eslint-plugin-template/docs/rules/elements-content.md                 | ✅                              | ✅                           |                               |                          |
| Angular            | `@angular-eslint/template/label-has-associated-control`                            | https://github.com/angular-eslint/angular-eslint/blob/master/packages/eslint-plugin-template/docs/rules/label-has-associated-control.md     | ✅                              | ✅                           |                               |                          |
| Angular            | `@angular-eslint/template/no-call-expression`                                      | https://github.com/angular-eslint/angular-eslint/blob/master/packages/eslint-plugin-template/docs/rules/no-call-expression.md               | ✅                              | ✅                           |                               |                          |
| Angular            | `@angular-eslint/template/no-duplicate-attributes`                                 | https://github.com/angular-eslint/angular-eslint/blob/master/packages/eslint-plugin-template/docs/rules/no-duplicate-attributes.md          | ✅                              | ✅                           |                               |                          |
| Angular            | `@angular-eslint/template/no-positive-tabindex`                                    | https://github.com/angular-eslint/angular-eslint/blob/master/packages/eslint-plugin-template/docs/rules/no-positive-tabindex.md             | ✅                              | ✅                           |                               |                          |
| Angular            | `@angular-eslint/template/use-track-by-function`                                   | https://github.com/angular-eslint/angular-eslint/blob/master/packages/eslint-plugin-template/docs/rules/use-track-by-function.md            | ✅                              | ✅                           |                               |                          |
| Angular            | `@angular-eslint/template/valid-aria`                                              | https://github.com/angular-eslint/angular-eslint/blob/master/packages/eslint-plugin-template/docs/rules/valid-aria.md                       | ✅                              | ✅                           |                               |                          |
| Angular            | `@angular-eslint/use-component-view-encapsulation`                                 | https://github.com/angular-eslint/angular-eslint/blob/master/packages/eslint-plugin/docs/rules/use-component-view-encapsulation.md          | ✅                              | ✅                           |                               |                          |
| Cypress            | All recommended rules from `cypress`                                               | https://github.com/cypress-io/eslint-plugin-cypress#rules                                                                                   | ✅                              |                              | ✅                            |                          |
| ESLint             | All recommended ESLint rules                                                       | https://eslint.org/docs/rules/                                                                                                              | ✅                              | ✅                           | ✅                            | ✅                       |
| React              | All recommended rules from `react`                                                 | https://github.com/jsx-eslint/eslint-plugin-react                                                                                           |                                 |                              | ✅                            | ✅                       |
| React              | `react/hook-use-state`                                                             | https://github.com/jsx-eslint/eslint-plugin-react                                                                                           |                                 |                              | ✅                            | ✅                       |
| React              | `react/jsx-boolean-value`                                                          | https://github.com/jsx-eslint/eslint-plugin-react                                                                                           |                                 |                              | ✅                            | ✅                       |
| React              | `react/jsx-closing-bracket-location`                                               | https://github.com/jsx-eslint/eslint-plugin-react                                                                                           |                                 |                              | ✅                            | ✅                       |
| React              | `react/jsx-key.      `                                                             | https://github.com/jsx-eslint/eslint-plugin-react                                                                                           |                                 |                              | ✅                            | ✅                       |
| React              | `react/jsx-no-useless-fragment`                                                    | https://github.com/jsx-eslint/eslint-plugin-react                                                                                           |                                 |                              | ✅                            | ✅                       |
| React              | `react/no-arrow-function-lifecycle`                                                | https://github.com/jsx-eslint/eslint-plugin-react                                                                                           |                                 |                              | ✅                            | ✅                       |
| React              | `react/no-invalid-html-attribute`                                                  | https://github.com/jsx-eslint/eslint-plugin-react                                                                                           |                                 |                              | ✅                            | ✅                       |
| React              | `react/no-unused-state`                                                            | https://github.com/jsx-eslint/eslint-plugin-react                                                                                           |                                 |                              | ✅                            | ✅                       |
| React              | `react/self-closing-comp`                                                          | https://github.com/jsx-eslint/eslint-plugin-react                                                                                           |                                 |                              | ✅                            | ✅                       |
| React Hooks        | All rules                                                                          | https://github.com/lydell/eslint-plugin-simple-import-sort                                                                                  |                                 |                              | ✅                            | ✅                       |
| RxJS               | All recommended rules from `rxjs`                                                  | https://github.com/cartant/eslint-plugin-rxjs#rules                                                                                         | ✅                              | ✅                           |                               |                          |
| RxJS               | `rxjs-angular/prefer-takeuntil` (with custom config)                               | https://github.com/cartant/eslint-plugin-rxjs-angular/blob/main/docs/rules/prefer-takeuntil.md                                              | ✅                              | ✅                           |                               |                          |
| RxJS               | `rxjs/finnish` (with custom config)                                                | https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/finnish.md                                                               | ✅                              | ✅                           |                               |                          |
| RxJS               | `rxjs/no-unsafe-takeuntil` (with custom config)                                    | https://github.com/cartant/eslint-plugin-rxjs/blob/main/docs/rules/no-unsafe-takeuntil.md                                                   | ✅                              | ✅                           |                               |                          |
| TypeScript         | All recommended rules from `@typescript-eslint`                                    | https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin#supported-rules                                     | ✅                              | ✅                           | ✅                            | ✅                       |
| TypeScript         | `no-empty-function`                                                                | https://typescript-eslint.io/rules/no-empty-function/                                                                                       | ✅                              | ✅                           | ✅                            | ✅                       |
| TypeScript         | `no-restricted-imports` (with custom config)                                       | https://typescript-eslint.io/rules/no-restricted-imports/                                                                                   | ✅                              | ✅                           |                               |                          |
| deprecation        | `deprecation`                                                                      | https://github.com/gund/eslint-plugin-deprecation?tab=readme-ov-file#disallow-usage-of-deprecated-apis-deprecationdeprecation               | ✅                              | ✅                           | ✅                            | ✅                       |
| eslint-comments    | All recommended rules from `eslint-comments`                                       | https://mysticatea.github.io/eslint-plugin-eslint-comments/rules/                                                                           | ✅                              | ✅                           | ✅                            | ✅                       |
| eslint-comments    | `eslint-comments/disable-enable-pair` (custom config to allow whole-file disables) | https://mysticatea.github.io/eslint-plugin-eslint-comments/rules/disable-enable-pair.html                                                   | ✅                              | ✅                           | ✅                            | ✅                       |
| eslint-comments    | `eslint-comments/require-description`                                              | https://mysticatea.github.io/eslint-plugin-eslint-comments/rules/require-description.html                                                   | ✅                              | ✅                           | ✅                            | ✅                       |
| no-only-tests      | `no-only-tests/no-only-tests`                                                      | https://github.com/levibuzolic/eslint-plugin-no-only-tests#usage                                                                            | ✅                              | ✅                           | ✅                            | ✅                       |
| simple-import-sort | `simple-import-sort/exports`                                                       | https://github.com/lydell/eslint-plugin-simple-import-sort                                                                                  | ✅                              | ✅                           | ✅                            | ✅                       |
| simple-import-sort | `simple-import-sort/imports` (with custom config)                                  | https://github.com/lydell/eslint-plugin-simple-import-sort                                                                                  | ✅                              | ✅                           | ✅                            | ✅                       |
