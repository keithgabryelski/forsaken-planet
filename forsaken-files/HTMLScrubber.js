import * as React from "react";
import he from "he";

/**
 */
export class HTMLScrubber {
  constructor(elementScrubbers = HTMLScrubber.DefaultElementScrubbers) {
    this.elementScrubbers = elementScrubbers;
    this.key = 0;
  }

  convertToFragment(node) {
    let children = [];
    let fragment = null;

    const firstChildNode = node.firstChild;
    if (firstChildNode != null) {
      const fragments = this.convertToFragments(firstChildNode);
      children = fragments;
    } else {
      if (node.nodeType === Node.TEXT_NODE) {
        fragment = he.decode(node.nodeValue);
      }
    }

    if (fragment == null) {
      if (!(node instanceof Element)) {
        // skip non element nodes
        return null;
      }
      const { nodeName, attributes } = node;

      if (!this.elementScrubbers.has(nodeName)) {
        // skip nodes we don't know about
        console.warn("HTMLScrubber: unknown node named:", nodeName);
        return null;
      }

      const scrubber = this.elementScrubbers.get(nodeName);
      let elementName = nodeName.toLowerCase();
      let props = [...attributes].reduce((bag, snack) => {
        switch (snack.name) {
          case "style":
            if (snack.value) {
              // XXX this is probably broken for edge cases
              const value = snack.value.split(";");
              bag[snack.name] = value;
            }
            break;
          case "srcset":
            bag.srcSet = snack.value;
            break;
          case "class":
            bag.className = snack.value;
            break;
          default:
            bag[snack.name] = snack.value;
            break;
        }
        return bag;
      }, {});

      if (typeof scrubber === "function") {
        const results = scrubber(elementName, node, props, children);
        if (results == null) {
          // scrubber said no way
          return null;
        }
        elementName = results.elementName;
        props = results.props;
        children = results.children;

        if (elementName == null) {
          return null;
        }
      }

      fragment = React.createElement(
        React.Fragment,
        { key: this.key++ },
        React.createElement(
          elementName,
          props,
          children.length === 0 ? undefined : children,
        ),
      );
    }

    return fragment;
  }

  convertToFragments(firstNode) {
    const fragments = [];

    for (let node = firstNode; node != null; node = node.nextSibling) {
      const fragment = this.convertToFragment(node);
      if (fragment) {
        fragments.push(fragment);
      }
    }

    return fragments;
  }

  /**
   * Main entry point to convert from a backend snippet
   * to a react-fragments representing the node-tree with
   * highlighting information.
   * @param {Element} textHTML a snippet from the backend
   * @returns {Fragments} the parsed html
   */
  scrub(textHTML) {
    const { fragments } = this.detailedScrub(textHTML);
    return fragments;
  }

  /**
   * Main entry point to convert from a backend snippet
   * to a react-fragments representing the node-tree with
   * highlighting information.
   * @param {string} textHTML a snippet from the backend
   * @returns {Fragments} the parsed html
   */
  detailedScrub(textHTML) {
    this.key = 0;

    try {
      const document = new DOMParser().parseFromString(textHTML, "text/html");
      const snippet = document.body;
      if (snippet != null) {
        const firstChild = snippet.firstChild;
        if (firstChild != null) {
          const fragments = this.convertToFragments(firstChild);
          return { fragments, snippet };
        }
        return { fragments: [], snippet };
      }
    } catch (e) {
      this.logger.exception("could not convert text to components", e, {
        textHTML,
      });
    }
    return { fragments: [], snippet: document.createElement("body") };
  }

  static NOOPElementScrubber(elementName, _node, props, children) {
    return { elementName, props, children };
  }

  static DefaultElementScrubbers = new Map([
    ["A", null],
    ["ABBR", null],
    ["ADDRESS", null],
    ["AREA", null],
    ["ARTICLE", null],
    ["B", null],
    ["BDI", null],
    ["BDO", null],
    ["BLOCKQUOTE", null],
    ["BR", null],
    ["CAPTION", null],
    ["CITE", null],
    ["CODE", null],
    ["COL", null],
    ["COLGROUP", null],
    ["DD", null],
    ["DEL", null],
    ["DETAILS", null],
    ["DFN", null],
    ["DIV", null],
    ["DL", null],
    ["DT", null],
    ["EM", null],
    ["FIGURE", null],
    ["FOOTER", null],
    ["H1", null],
    ["H2", null],
    ["H3", null],
    ["H4", null],
    ["H5", null],
    ["H6", null],
    ["HEADER", null],
    ["HGROUP", null],
    ["HR", null],
    ["I", null],
    ["IMG", null],
    ["INS", null],
    ["LABEL", null],
    ["LEGEND", null],
    ["LI", null],
    ["LINK", null],
    ["MAIN", null],
    ["MAP", null],
    ["MARK", null],
    ["METER", null],
    ["NAV", null],
    ["OL", null],
    ["OUTPUT", null],
    ["P", null],
    ["PRE", null],
    ["PROGRESS", null],
    ["Q", null],
    ["S", null],
    ["SAMP", null],
    ["SECTION", null],
    ["SMALL", null],
    ["SPAN", null],
    ["STRONG", null],
    ["SUB", null],
    ["SUMMARY", null],
    ["SUP", null],
    ["TABLE", null],
    ["TBODY", null],
    ["TD", null],
    ["TFOOT", null],
    ["TH", null],
    ["THEAD", null],
    ["TIME", null],
    ["TITLE", null],
    ["TR", null],
    ["U", null],
    ["UL", null],
    ["VAR", null],
    ["WBR", null],
    ["IFRAME", null],
    ["SCRIPT", null],
  ]);
}
