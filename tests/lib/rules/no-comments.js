"use strict";

const rule = require("../../../lib/rules/no-comments.js");
const RuleTester = require("eslint").RuleTester;

const parserOptions = { ecmaVersion: 8, sourceType: "module" };

const ruleTester = new RuleTester();

ruleTester.run("no-comments", rule, {
  valid: [
    {
      code: "const button = styled.button`/* position */ position: absolute; /* size */ width: 300px;`",
      parserOptions,
    },
    {
      code: `const button = styled.button\`
        position: absolute;
        width: 300px\`
      `,
      parserOptions,
    },
    {
      code: "const button = styled.button`height: 200px; width: 300px;`",
      parserOptions,
    },
    {
      code: `const button = styled(Button).attrs({ someAttribute: "unknown" })\`height: 200px; width: 300px;\``,
      parserOptions,
    },
    {
      code: `
        import styled from 'styled-components';
        const button = styled.button\`
          height: 100px;
          width: 100px;
          border: 1px solid
            \${({ isBlue }) => (isBlue ? "blue" : "red")};
          \${(props) =>
            props.test &&
            css\`
              height: 200px;
              width: 200px;
              background: green;
            \`}\``,
      parserOptions,
    },
  ],
  invalid: [
    {
      code: `const button = styled.button\`
      /* position */
      position: absolute;
      /* size */
      width: 300px;
      /* second line */
      background: red;\``,
      parserOptions,
      errors: [
        {
          messageId: "no-comments",
        },
      ],
      output: `const button = styled.button\`
      position: absolute;
      width: 300px;
      background: red;\``,
    },
    {
      code: `const button = styled.button\`
      /* unknown */
      position: absolute;
      width: 300px;
      /* test */
      height: 200px;
      left: 0;\``,
      parserOptions,
      errors: [
        {
          messageId: "no-comments",
        },
      ],
      output: `const button = styled.button\`
      position: absolute;
      width: 300px;
      height: 200px;
      left: 0;\``,
    },
  ],
});
