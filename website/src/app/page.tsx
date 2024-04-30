import Blog from "./blog/page";
import Welcome from "./welcome";
import "./blog/articles.css";

export default function Home() {
  return (
    <main>
      <Welcome />
      <br />
      <br />
      <br />
      <br />
      <Blog />
    </main>
  );
}
