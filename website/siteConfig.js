/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* List of projects/orgs using your project for the users page */
const users = [
  {
    caption: 'User1',
    image: '/test-site/img/Naviga_Logo_Dark_Icon.png',
    infoLink: 'https://www.navigaglobal.com',
    pinned: true,
  },
];

const siteConfig = {
  title: 'Analytix and BI Populator Docs' /* title for your website */,
  tagline: '',
  url: './' /* your website url */,
  baseUrl: '/' /* base url for your project */,
  projectName: 'analytix-docs',
  onPageNav: 'separate',
  headerLinks: [
    {doc: 'analytix/analytix-bi-overview', label: 'Analytix'},
    {doc: 'bi/bi-resources', label: 'BI'},
    //{doc: 'support/analytix-support', label: 'Support'},
    //{doc: 'doc4', label: 'API'},
    //{page: 'help', label: 'Help'},
  ],
  users,
  /* path to images for header/footer */
  headerIcon: 'img/Naviga_Logo_Dark_Icon.png',
  footerIcon: 'img/Naviga_Logo_Dark_Icon.png',
  favicon: 'img/favicon.png',
  /* colors for website */
  colors: {
    primaryColor: '#1f0744',
    secondaryColor: '#6950F6',
  },
  /* custom fonts for website */
  /*fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },*/
  algolia: {
    apiKey: 'ccd2672198948e3c79646332385b98fb',
    indexName: 'analytix',
    algoliaOptions: {} // Optional, if provided by Algolia
  },
  // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
  copyright:
    'Copyright © ' +
    new Date().getFullYear() +
    'Naviga',
  // organizationName: 'deltice', // or set an env variable ORGANIZATION_NAME
  // projectName: 'test-site', // or set an env variable PROJECT_NAME
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: 'default',
  },
  scripts: ['https://buttons.github.io/buttons.js'],
  // You may provide arbitrary config keys to be used as needed by your template.
  repoUrl: 'https://github.com/facebook/test-site',
};

module.exports = siteConfig;
