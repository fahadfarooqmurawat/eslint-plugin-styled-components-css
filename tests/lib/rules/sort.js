"use strict";

const rule = require("../../../lib/rules/sort.js");
const RuleTester = require("eslint").RuleTester;

const parserOptions = { ecmaVersion: 8, sourceType: "module" };

const ruleTester = new RuleTester();

ruleTester.run("sort", rule, {
  valid: [
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
          /* position */
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
        position: absolute;
        width: 300px;
        height: 200px;
        left: 0;\`
      `,
      parserOptions,
      errors: [
        {
          messageId: "sort",
        },
      ],
      output: `const button = styled.button\`
        position: absolute;
        left: 0;
        height: 200px;
        width: 300px;\`
      `,
    },
    {
      code: "const button = styled.button`position: absolute; width: 300px; height: 200px; left: 0;`",
      parserOptions,
      errors: [
        {
          messageId: "sort",
        },
      ],
      output:
        "const button = styled.button`position: absolute; left: 0; height: 200px; width: 300px;`",
    },
    {
      code: `const button = styled.button\`
        position: absolute;
        width: 300px;
        height: 200px;
        bottom: 10px;
        background-color: red;
        color: orange;
        border-radius: 1px;
        left: 0;\`
      `,
      parserOptions,
      errors: [
        {
          messageId: "sort",
        },
      ],
      output: `const button = styled.button\`
        position: absolute;
        bottom: 10px;
        left: 0;

        height: 200px;
        width: 300px;

        background-color: red;
        color: orange;
        border-radius: 1px;\`
      `,
    },
    {
      code: `const button = styled.button\`
        position: absolute;
        bottom: 10px;
        left: 0;
        height: 200px;
        width: 300px;
        background-color: red;
        color: orange;
        border-radius: 1px;\`
      `,
      parserOptions,
      errors: [
        {
          messageId: "sort",
        },
      ],
      output: `const button = styled.button\`
        position: absolute;
        bottom: 10px;
        left: 0;

        height: 200px;
        width: 300px;

        background-color: red;
        color: orange;
        border-radius: 1px;\`
      `,
    },
  ],
});
