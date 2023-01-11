module.exports = function areSameDeclarations(a, b) {
  return (
    a.source.start.line === b.source.start.line &&
    a.source.start.column === b.source.start.column
  );
};
