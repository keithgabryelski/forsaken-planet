import React from "react";
import { useParams } from "react-router-dom";
import { HTMLScrubber } from "../HTMLScrubber";

const scrubber = new HTMLScrubber();

function renderHTML(html) {
  return scrubber.scrub(html);
}

export default function SinglePost({
  history,
  posts,
  handleBookmark,
  handleRemoveBookmark,
  handleRemove,
}) {
  const params = useParams();
  const id = params.id;

  let post = posts.filter((post) => post.id === id);
  post = post[0];

  console.info("post.body", post.body);

  return (
    <div className="single-post">
      <h1 className="header">{post.title}</h1>
      {renderHTML(post.body)}
      <ul className="post-foot">
        <li>
          {post.bookmark ? (
            <button
              className="btn btn-remove-bookmarks"
              onClick={() => handleRemoveBookmark(post)}
            >
              Remove from Bookmark
            </button>
          ) : (
            <button
              className="btn btn-bookmarks"
              onClick={() => handleBookmark(post)}
            >
              Add to Bookmark
            </button>
          )}
        </li>
        <li>
          <button
            className="btn btn-remove"
            onClick={() => handleRemove(post, history)}
          >
            Remove
          </button>
        </li>
      </ul>
    </div>
  );
}
