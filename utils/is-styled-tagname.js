module.exports = function isStyledTagname(node) {
  return (
    (node.tag.type === "Identifier" && node.tag.name === "css") ||
    (node.tag.type === "MemberExpression" &&
      node.tag.object.name === "styled") ||
    (node.tag.type === "CallExpression" &&
      (node.tag.callee.name === "styled" ||
        (node.tag.callee.object &&
          ((node.tag.callee.object.callee &&
            node.tag.callee.object.callee.name === "styled") ||
            (node.tag.callee.object.object &&
              node.tag.callee.object.object.name === "styled")))))
  );
};
