# Styled Component should not have comments in their css (`styled-components-css/no-comments`)

Disallow comments inside styled component's css code.

## Rule Details

Examples of **incorrect** code for this rule:

```js
const Comp = styled.div`
  /* hello world */
  position: absolute;
`;
```

```js
const Comp = styled.div`
  /* background-color: red; */
  position: absolute;
`;
```

Examples of **correct** code for this rule:

```js
const Comp = styled.div`
  position: absolute;
`;
```

```js
const Comp = styled.div`
  background-color: red;
  position: absolute;
`;
```

## When Not To Use It

When you want to allow comments inside the Styled Component's css.
