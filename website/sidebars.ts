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
    "whentouse",
    "index",
    // {
    //   type: "category",
    //   label: "Tutorial",
    //   items: [
    //     "tutorial/start-project",
    //     "tutorial/views",
    //     "tutorial/deploying",
    //   ],
    // },
    {
      type: "category",
      label: "Explanations",
      items: [
        "explanations/responses",
        "explanations/routing",
        "explanations/serialisation",
      ],
    },
    // {
    //   type: "category",
    //   label: "How to",
    //   items: [
    //     "how-to/overlays",
    //     "how-to/global-context",
    //     "how-to/forms",
    //     "how-to/storybook",
    //     "how-to/testing",
    //   ],
    // },
    // "reference",
  ],
};

export default sidebars;
