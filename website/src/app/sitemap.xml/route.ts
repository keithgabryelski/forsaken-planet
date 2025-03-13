export async function GET() {
  const lastmod = new Date().toISOString();
  const sitemapFiles = [
    "sitemap/sitemap-forsaken-planet.com-NS_0-0.xml.gz",
    "sitemap/sitemap-forsaken-planet.com-NS_2-0.xml.gz",
    "sitemap/sitemap-forsaken-planet.com-NS_4-0.xml.gz",
    "sitemap/sitemap-forsaken-planet.com-NS_6-0.xml.gz",
    "sitemap/sitemap-forsaken-planet.com-NS_8-0.xml.gz",
    "sitemap-app-pages.xml",
  ];
  const sitemapXML = sitemapFiles
    .map(
      (filename) => `
	<sitemap>
		<loc>https://forsaken-planet.com/${filename}</loc>
		<lastmod>${lastmod}</lastmod>
	</sitemap>`,
    )
    .join("");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    sitemapXML,
    "</sitemapindex>",
  ].join("\n");

  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
