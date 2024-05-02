import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  guide: [
    "guide/index",
    {
      type: "category",
      label: "Getting Started",
      items: [
        "guide/start/howitworks",
        "guide/start/tutorial",
        "guide/start/template",
        "guide/start/install",
      ],
    },
    "guide/views",
    "guide/overlays",
    "guide/global-context",
    "guide/forms",
    "guide/storybook",
    "guide/testing",
    "guide/reference",
  ],
};

export default sidebars;
