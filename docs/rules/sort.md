# Styled Component's css declarations should be sorted (`styled-components-css/sort`)

Sort declarations inside styled component's css code in a highly opinionated order. If there are more than 5 properties, a blank line is expected between different categories of css properties.

## Rule Details

Examples of **incorrect** code for this rule:

```js
const Comp = styled.div`
  width: 10px;
  height: 20px;
  top: 0;
  display: flex;
  position: absolute;
`;
```

```js
const Comp = styled.div`
  width: 10px;
  height: 20px;
  top: 0;
  display: flex;
  position: absolute;
  bottom: 10px;
`;
```

Examples of **correct** code for this rule:

```js
const Comp = styled.div`
  position: absolute;
  top: 0;
  bottom: 10px;

  display: flex;

  height: 10px;
  width: 10px;
`;
```

## When Not To Use It

When you don't want to sort Styled Component's declarations.
