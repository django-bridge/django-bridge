import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Django Render - Django / React application framework",
  tagline:
    "The simple way to build Django applications with modern React frontends",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://django-render.org",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  trailingSlash: true,

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
          sidebarCollapsible: false,
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
    image: "img/social-card.jpg",
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
          label: "docs",
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
          title: "Documentation",
          items: [
            {
              label: "Introduction",
              to: "/docs/introduction",
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
  plugins: [
    [
      "docusaurus-pushfeedback",
      {
        project: "d2b2opllpj",
      },
    ],
  ],
};

export default config;
