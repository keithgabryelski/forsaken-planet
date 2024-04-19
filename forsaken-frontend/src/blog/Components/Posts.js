import React from "react";

import Post from "./Post";

export default function Posts({ posts, onBookmark, onRemoveBookmark }) {
  const showPost = posts.map((post) => (
    <Post
      key={post.id}
      post={post}
      onBookmark={onBookmark}
      onRemoveBookmark={onRemoveBookmark}
    />
  ));

  return <div>{showPost}</div>;
}
