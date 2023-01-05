"use strict";

const rule = require("../../../lib/rules/comment-and-sort.js");
const RuleTester = require("eslint").RuleTester;

const parserOptions = { ecmaVersion: 8, sourceType: "module" };

const ruleTester = new RuleTester();

ruleTester.run("comment-and-sort", rule, {
  valid: [
    // {
    //   code: "const button = styled.button`height: 200px; width: 300px;`",
    //   parserOptions
    // },
    // {
    //   code: "const button = styled(Button)`height: 200px; width: 300px;`",
    //   parserOptions
    // },
    // {
    //   code: "const button = css`height: 200px; width: 300px;`",
    //   parserOptions
    // },
    // {
    //   code: `const button = styled.button\`
    //      height: 200px;
    //      width: 300px;\``,
    //   parserOptions
    // },
    // {
    //   code: `const button = styled.button.attrs({ someAttribute: "unknown" })\`
    //      height: 200px;
    //      width: 300px;\``,
    //   parserOptions,
    // },
    // {
    //   code: `const button = styled(Button).attrs({ someAttribute: "unknown" })\`height: 200px; width: 300px;\``,
    //   parserOptions,
    // },
    // {
    //   code: `const button = styled.button\`
    //      color: \${({ isBlue }) => (isBlue ? "blue" : "red")};
    //      height: 200px;
    //      width: 300px;\``,
    //   parserOptions
    // },
    // {
    //   code: `const button = styled.button\`
    //      height: 200px;
    //      stroke: \${Colors => Colors.selections};
    //      width: 300px;\``,
    //   parserOptions
    // },
    // {
    //   code: `const button = styled.button\`
    //      border: 1px solid
    //        \${({ isBlue }) => (isBlue ? "blue" : "red")};
    //      height: 200px;
    //      width: 300px;\``,
    //   parserOptions
    // },
    // {
    //   code: `
    //    const button = styled.button\`
    //      border: 1px solid
    //        \${({ isBlue }) => (isBlue ? "blue" : "red")};
    //      width: 300px;
    //      height: 200px;
    //      left: 0;\``,
    //   parserOptions
    // }
  ],

  invalid: [
    {
      code: "const button = styled.button`position: absolute; width: 300px; height: 200px; left: 0;`",
      parserOptions,
      errors: [
        {
          messageId: "comment-and-sort"
        }
      ],
      output: "const button = styled.button`position: absolute; left: 0; height: 200px; width: 300px;`"
    },
    {
      code: "const button = styled(Button)`width: 300px; height: 200px;`",
      parserOptions,
      errors: [
        {
          messageId: "comment-and-sort"
        }
      ],
      output: "const button = styled(Button)`height: 200px; width: 300px;`"
    },
    {
      code: `const button = styled.button\`
        width: 300px;
        background: yellow;
        position: absolute;
        height: 200px;
        right: 0;
        top: 0;
        background-color: red;
        left: 0;\``,
      parserOptions,
      errors: [
        {
          messageId: "comment-and-sort",
        },
      ],
      output: `const button = styled.button\`
        /* position */
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        
        /* size */
        height: 200px;
        width: 300px;
        
        /* misc */
        background: yellow;
        background-color: red;\``,
    },
    {
      code: `const button = styled.button\`
         height: 200px;
         color: \${({ isBlue }) => (isBlue ? "blue" : "red")};
         width: 300px;\``,
      parserOptions,
      errors: [
        {
          messageId: "comment-and-sort"
        }
      ],
      output: `const button = styled.button\`
         height: 200px;
         width: 300px;
         color: \${({ isBlue }) => (isBlue ? "blue" : "red")};\``
    },
    // {
    //   code: `const foo = styled.div\`
    //      stroke: \${Colors => Colors.selections};
    //      color: blue;
    //    \`;`,
    //   parserOptions,
    //   errors: [
    //     {
    //       messageId: "comment-and-sort"
    //     }
    //   ],
    //   output: `const foo = styled.div\`
    //      color: blue;
    //      stroke: \${Colors => Colors.selections};
    //    \`;`
    // },
    // {
    //   code: `const button = styled.button\`
    //      width: 300px;
    //      height: 200px;
    //      border: 1px solid
    //        \${({ isBlue }) => (isBlue ? "blue" : "red")};\``,
    //   parserOptions,
    //   errors: [
    //     {
    //       messageId: "comment-and-sort"
    //     }
    //   ],
    //   output: `const button = styled.button\`
    //      border: 1px solid
    //        \${({ isBlue }) => (isBlue ? "blue" : "red")};
    //      height: 200px;
    //      width: 300px;\``
    // },
    // {
    //   code: `
    //    import styled from 'styled-components';

    //    const button = styled.button\`
    //      height: 200px;
    //      border: 1px solid
    //        \${({ isBlue }) => (isBlue ? "blue" : "red")};
    //      width: 300px;\``,
    //   parserOptions,
    //   errors: [
    //     {
    //       messageId: "comment-and-sort"
    //     }
    //   ],
    //   output: `
    //    import styled from 'styled-components';

    //    const button = styled.button\`
    //      border: 1px solid
    //        \${({ isBlue }) => (isBlue ? "blue" : "red")};
    //      height: 200px;
    //      width: 300px;\``
    // },
    // {
    //   code: `
    //      export const foo = styled.div\`
    //        height: 100%;
    //        top: 0;
    //        position: absolute;
    //        width: 100%;

    //        .op-selectable:hover {
    //          cursor: pointer;
    //        }
    //      \`;`,
    //   parserOptions,
    //   errors: [
    //     {
    //       messageId: "comment-and-sort"
    //     }
    //   ],
    //   output: `
    //      export const foo = styled.div\`
    //        height: 100%;
    //        position: absolute;
    //        top: 0;
    //        width: 100%;

    //        .op-selectable:hover {
    //          cursor: pointer;
    //        }
    //      \`;`
    // },
    // {
    //   code: `
    //      export const foo = styled.div\`
    //        flex-grow: 1;
    //        .op-selected .djs-outline {
    //          stroke-width: 3px;
    //          fill: \${themeStyle({
    //            dark: "rgba(58, 82, 125, 0.5)",
    //            light: "rgba(189, 212, 253, 0.5)"
    //          })} !important;
    //        }\`;`,
    //   parserOptions,
    //   errors: [
    //     {
    //       messageId: "comment-and-sort"
    //     }
    //   ],
    //   output: `
    //      export const foo = styled.div\`
    //        flex-grow: 1;
    //        .op-selected .djs-outline {
    //          fill: \${themeStyle({
    //            dark: "rgba(58, 82, 125, 0.5)",
    //            light: "rgba(189, 212, 253, 0.5)"
    //          })} !important;
    //          stroke-width: 3px;
    //        }\`;`
    // }
  ],
});
