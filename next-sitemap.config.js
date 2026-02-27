/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://streamlab.com.ar',
  generateRobotsTxt: true, 
  changefreq: 'monthly',
  priority: 1.0, 
  sitemapSize: 5000,
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: 'monthly',
      priority: 1.0,
      lastmod: new Date().toISOString(),
    };
  },
};
