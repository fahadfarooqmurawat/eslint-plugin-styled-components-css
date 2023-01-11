# eslint-plugin-styled-components-css

ESlint rules for styled components css formatting

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-styled-components-css`:

```sh
npm install eslint-plugin-styled-components-css --save-dev
```

## Usage

Add `styled-components-css` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "styled-components-css"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "styled-components-css/rule-name": 2
    }
}
```

## Rules

<!-- begin auto-generated rules list -->

🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                     | Description                                                   | 🔧 |
| :--------------------------------------- | :------------------------------------------------------------ | :- |
| [no-comments](docs/rules/no-comments.md) | Styled Component should not have comments in their definition | 🔧 |
| [sort](docs/rules/sort.md)               | Styled Component's css properties should be sorted            | 🔧 |

<!-- end auto-generated rules list -->


