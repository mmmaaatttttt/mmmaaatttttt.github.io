import marksy from "marksy/components";
import React, { createElement } from "react";
import * as components from "../story_components";
debugger;
const compile = marksy({
  createElement,
  components,
  elements: {
    a({ href, title, children }) {
      return (
        <a href={href} alt={title} target="_blank">
          {children}
        </a>
      );
    }
  }
});

const stripFrontMatterAndCompile = content => {
  content = content
    .split("---")
    .slice(2)
    .join("---");
  return compile(content).tree;
};

export default stripFrontMatterAndCompile;
