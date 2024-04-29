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
  start: [
    "start/index",
    "start/howitworks",
    "start/tutorial",
    "start/template",
    "start/install",
  ],
  guide: [
    "guide/index",
    "guide/messages",
    "guide/forms",
    "guide/global-context",
    "guide/overlays",
    "guide/storybook",
  ],
};

export default sidebars;
