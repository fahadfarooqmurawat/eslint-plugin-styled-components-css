"use strict";

const postcss = require("postcss");

const areSameDeclarations = require("../../utils/are-same-declarations.js");
const {
  sortOrder,
  getCategory,
} = require("../../utils/declaration-categories.js");
const isStyledTagname = require("../../utils/is-styled-tagname.js");
const sortDeclarations = require("../../utils/sort-declarations.js");

function isValidAtomicRule({ rule, src }) {
  const decls = rule.nodes.filter((node) => node.type === "decl");

  if (decls.length < 0) {
    return { isValid: true };
  }

  for (let i = 1; i < decls.length; i++) {
    const current = decls[i].prop;
    const prev = decls[i - 1].prop;

    const indexOfCurrent = sortOrder.indexOf(current);
    const indexOfPrev = sortOrder.indexOf(prev);
    const currentCat = getCategory(current);
    const prevCat = getCategory(prev);

    const isSpaceMissing = (() => {
      if (decls.length > 5 && currentCat && prevCat && currentCat !== prevCat) {
        const { endIdx } = getDeclarationRange({ decl: decls[i - 1], src });
        const { startIdx } = getDeclarationRange({ decl: decls[i], src });
        const charsBetweenDeclarations = src
          .getText()
          .substring(startIdx, endIdx + 1)
          .replace("\n", "");
        const hasLineBreak = /\r|\n/.exec(charsBetweenDeclarations);

        return !hasLineBreak;
      }

      return false;
    })();

    if (indexOfCurrent !== -1) {
      if (
        indexOfCurrent < indexOfPrev ||
        indexOfPrev === -1 ||
        isSpaceMissing
      ) {
        const loc = {
          start: {
            line: decls[i - 1].source.start.line,
            column: decls[i - 1].source.start.column - 1,
          },
          end: {
            line: decls[i].source.end.line,
            column: decls[i].source.end.column - 1,
          },
        };

        return { isValid: false, loc };
      }
    }
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

function getDeclarationRange({ decl, src }) {
  const loc = {
    start: {
      line: decl.source.start.line,
      column: decl.source.start.column - 1,
    },
    end: {
      line: decl.source.end.line,
      column: decl.source.end.column - 1,
    },
  };

  const startIdx = src.getIndexFromLoc(loc.start);
  const endIdx = src.getIndexFromLoc(loc.end);

  return { startIdx, endIdx };
}

function getDeclarationText({ decl, src }) {
  const { startIdx, endIdx } = getDeclarationRange({ decl, src });

  return src.getText().substring(startIdx, endIdx + 1);
}

function fix({ rule, fixer, src }) {
  let fixings = [];

  // concat fixings recursively
  rule.nodes.forEach((node) => {
    if (node.type === "rule") {
      fixings = [...fixings, ...fix({ rule: node, fixer, src })];
    }
  });

  const allRules = rule.nodes;

  const declarations = allRules.filter((node) => node.type === "decl");
  const sortedDeclarations = sortDeclarations(declarations);

  declarations.forEach((decl, idx) => {
    if (!areSameDeclarations(decl, sortedDeclarations[idx])) {
      try {
        const range = getDeclarationRange({ decl, src });

        const sortedDeclText = getDeclarationText({
          decl: sortedDeclarations[idx],
          src,
        });

        const removedRange = fixer.removeRange([
          range.startIdx,
          range.endIdx + 1,
        ]);

        fixings.push(removedRange);

        fixings.push(
          fixer.insertTextAfterRange(
            [range.startIdx, range.startIdx],
            sortedDeclText
          )
        );
      } catch (e) {
        console.error(e);
      }
    }
  });

  if (declarations.length > 5) {
    let prevCat = null,
      currCat = null;

    declarations.forEach((decl, idx) => {
      try {
        const replacedDeclaration = sortedDeclarations[idx];
        const propName = replacedDeclaration.prop;

        let newCat = getCategory(propName);

        if (newCat) {
          currCat = newCat;
        }

        if (prevCat && currCat !== prevCat) {
          const range = getDeclarationRange({
            decl: declarations[idx - 1],
            src,
          });

          fixings.push(
            fixer.insertTextAfterRange(
              [range.endIdx + 1, range.endIdx + 1],
              "\n"
            )
          );
        }

        prevCat = currCat;
      } catch (e) {
        console.error(e);
      }
    });
  }

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
              messageId: "sort",
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
      description: "Styled Component's css declarations should be sorted",
      recommended: true,
      url: "add documentation url",
    },
    messages: {
      sort: "Styled Component's css declarations should be sorted",
    },
    fixable: "code",
  },
  create,
};
