const visitParents = require('unist-util-visit-parents')

const transforms = [
  [/(?<=^|[\s(])'(?=\S|$)/g, '‘'],
  [/(?<=^|\S)'(?=[\w\s,.;:?!)]|$)/g, '’'],
  [/(?<=^|[\s(])"(?=\S|$)/g, '“'],
  [/(?<=^|\S)"(?=[\w\s,.;:?!)]|$)/g, '”'],
]

function isCode (ancestors) {
  for (const ancestor of ancestors) {
    if (ancestor.tagName === 'code') {
      return true
    }
  }
  return false
}

module.exports = (_options = {}) => {
  return (tree) => {
    visitParents(tree, 'text', (node, ancestors) => {
      if (!isCode(ancestors)) {
        for (const [pattern, replacement] of transforms) {
          node.value = node.value.replace(pattern, replacement)
        }
      }
    })
  }
}
