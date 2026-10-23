import { Plugin } from "unified"
import type { Root } from "hast"
import { visit } from "unist-util-visit"

export const rehypeTable: Plugin<[], Root> = () => (tree: Root) => {
  visit(tree, { tagName: "table" }, (node, i, parent) => {
    if (parent) {
      parent.children[i!] = {
        type: "element",
        tagName: "div",
        properties: { className: "table-wrapper" },
        children: [node],
      }
    }
  })
}
