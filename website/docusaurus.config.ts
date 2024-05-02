import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Django Render",
  tagline:
    "Django Render provides a streamlined approach for building Django applications with React Frontends",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://django-render.org",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "kaedroho", // Usually your GitHub org/user name.
  projectName: "django-render", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl:
            "https://github.com/kaedroho/django-render/tree/main/website/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      logo: {
        alt: "Django Render",
        src: "img/django-render-text.svg",
        width: 120,
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "guide",
          position: "right",
          label: "guide",
        },
        {
          href: "/news",
          position: "right",
          label: "news",
        },
        {
          href: "https://github.com/kaedroho/django-render/discussions",
          position: "right",
          label: "discuss",
        },
        {
          "aria-label": "GitHub Repository",
          href: "https://github.com/kaedroho/django-render",
          className: "navbar--github-link",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Overview",
          items: [
            {
              label: "Get started",
              to: "/docs/start/index",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "GitHub Discussions",
              href: "https://github.com/kaedroho/django-render/discussions",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/kaedroho",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/kaedroho/django-render",
            },
            {
              label: "PyPI",
              href: "https://pypi.org/project/djrender/",
            },
            {
              label: "npm",
              href: "https://www.npmjs.com/package/@django-render/core",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Karl Hobley`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
  scripts: [
    {
      src: "https://plausible.io/js/script.js",
      defer: true,
      "data-domain": "django-render.org",
    },
  ],
};

export default config;
