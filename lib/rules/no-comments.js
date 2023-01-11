"use strict";

const postcss = require("postcss");

const isStyledTagname = require("../../utils/is-styled-tagname.js");

function isValidAtomicRule({ rule }) {
  const commentNode = rule.nodes.find((node) => node.type === "comment");

  if (commentNode) {
    const loc = {
      start: {
        line: commentNode.source.start.line,
        column: commentNode.source.start.column - 1,
      },
      end: {
        line: commentNode.source.end.line,
        column: commentNode.source.end.column - 1,
      },
    };

    return { isValid: false, loc };
  }

  return { isValid: true };
}

function isValidRule({ rule, src }) {
  const { isValid, loc } = rule.nodes.reduce(
    (map, node) => {
      return node.type === "rule" ? isValidRule({ node, src }) : map;
    },
    { isValid: true }
  );

  if (!isValid) {
    return { isValid, loc };
  }

  return isValidAtomicRule({ rule, src });
}

function getNodeStyles(node) {
  const [firstQuasi, ...quasis] = node.quasi.quasis;
  // remove line break added to the first quasi
  const lineBreakCount = node.quasi.loc.start.line - 1;
  let styles = `${"\n".repeat(lineBreakCount)}${" ".repeat(
    node.quasi.loc.start.column + 1
  )}${firstQuasi.value.raw}`;

  // replace expression by spaces and line breaks
  quasis.forEach(({ value, loc }, idx) => {
    const prevLoc = idx === 0 ? firstQuasi.loc : quasis[idx - 1].loc;
    const lineBreaksCount = loc.start.line - prevLoc.end.line;
    const spacesCount =
      loc.start.line === prevLoc.end.line
        ? loc.start.column - prevLoc.end.column + 2
        : loc.start.column + 1;
    styles = `${styles}${" "}${"\n".repeat(lineBreaksCount)}${" ".repeat(
      spacesCount
    )}${value.raw}`;
  });

  return styles;
}

function getCommentRange({ node, src }) {
  const loc = {
    start: {
      line: node.source.start.line,
      column: 0,
    },
    end: {
      line: node.source.end.line,
      column: node.source.end.column,
    },
  };

  const startIdx = src.getIndexFromLoc(loc.start);
  const endIdx = src.getIndexFromLoc(loc.end);

  return { startIdx, endIdx };
}

function fix({ rule, fixer, src }) {
  let fixings = [];

  // concat fixings recursively
  rule.nodes.forEach((node) => {
    if (node.type === "rule") {
      fixings = [...fixings, ...fix({ rule: node, fixer, src })];
    }
  });

  rule.nodes.forEach((node) => {
    if (node.type === "comment") {
      try {
        const range = getCommentRange({ node, src });

        const removedRange = fixer.removeRange([
          range.startIdx,
          range.endIdx + 1,
        ]);

        fixings.push(removedRange);
      } catch (e) {
        console.log(e);
      }
    }
  });

  return fixings;
}

function create(context) {
  return {
    TaggedTemplateExpression(node) {
      if (isStyledTagname(node)) {
        try {
          const root = postcss.parse(getNodeStyles(node));

          const { isValid, loc } = isValidRule({
            rule: root,
            src: context.getSourceCode(),
          });

          if (!isValid) {
            return context.report({
              node,
              messageId: "no-comments",
              loc,
              fix: (fixer) =>
                fix({
                  fixer,
                  rule: root,
                  src: context.getSourceCode(),
                }),
            });
          }
        } catch (e) {
          return true;
        }
      }
    },
  };
}

module.exports = {
  meta: {
    type: "layout",
    schema: [],
    docs: {
      description:
        "Styled Component should not have comments in their css",
      recommended: true,
      url: "add documentation url",
    },
    messages: {
      "no-comments":
        "Styled Component should not have comments in their css",
    },
    fixable: "code",
  },
  create,
};
