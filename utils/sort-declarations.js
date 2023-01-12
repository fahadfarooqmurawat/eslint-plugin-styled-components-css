const { sortOrder } = require("../utils/declaration-categories.js");

module.exports = function sortDeclarations(declarations) {
  const order = declarations.slice().sort((a, b) => {
    const indexOfA = sortOrder.indexOf(a.prop);
    const indexOfB = sortOrder.indexOf(b.prop);

    if (indexOfA === -1) return 1;
    if (indexOfB === -1) return -1;

    return indexOfA - indexOfB;
  });

  return order;
};
