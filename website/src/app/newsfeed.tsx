import Parser from "rss-parser";
import NewsfeedRenderer from "./newsfeed-renderer";

export default async function Newsfeed() {
  const fetched = await fetch("https://forsaken-planet.wordpress.com/feed/", {
    method: "GET",
    next: { revalidate: 3600 },
  });
  const xml = await fetched.text();
  const parser: Parser = new Parser();
  const feed = await parser.parseString(xml);
  const items = feed.items.map((item) => {
    return {
      link: item.link,
      title: item.title,
      pubDate: item.pubDate,
      isoDate: item.isoDate,
      categories: item.categories,
      creator: item.creator,
      html: item["content:encoded"],
      snippetHTML: item["content:encodedSnippet"],
    };
  });

  return <NewsfeedRenderer items={items} />;
}
