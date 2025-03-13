export async function GET() {
  const lastmod = new Date().toISOString();
  const sitemapFiles = [
    "https://forsaken-planet.com",
    "https://forsaken-planet.com/icon.ico",
    "https://forsaken-planet.com/blog",
    "https://forsaken-planet.com/gallery",
    "https://forsaken-planet.com/meanderings",
    "https://forsaken-planet.com/drop-rate-calculator",
    "https://forsaken-planet.com/simulator",
    "https://forsaken-planet.com/drop-rate-sunburst",
    "https://forsaken-planet.com/perk-drop-rate-radar",
    "https://forsaken-planet.com/drops-interrogator",
    "https://forsaken-planet.com/damage-min-max",
    "https://forsaken-planet.com/damage-min-max-grouped",
    "https://forsaken-planet.com/damage-scatter-plot",
    "https://forsaken-planet.com/damage-histogram",
    "https://forsaken-planet.com/element-pie-chart",
  ];
  const sitemapXML = sitemapFiles
    .map(
      (filename) => `
	<url>
		<loc>https://forsaken-planet.com/sitemap/${filename}</loc>
		<lastmod>${lastmod}</lastmod>
		<changefreq>weekly</changefreq>
		<priority>1.0</priority>
	</url>`,
    )
    .join("");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">',
    sitemapXML,
    "</urlset>",
  ].join("\n");

  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
