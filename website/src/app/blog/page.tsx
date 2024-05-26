"use client";
import React, { Component } from "react";
import axios from "axios";

import { type Post } from "./blog-helpers";
import ArticlePreview from "./articlePreview";

type Props = NonNullable<unknown>;
type State = {
  posts: Post[];
};

export default class Blog extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      posts: [],
    };
  }

  componentDidMount() {
    axios
      .get(
        "https://public-api.wordpress.com/rest/v1/sites/forsaken-planet.wordpress.com/posts",
      )
      .then((res) => {
        console.log(res.data.posts);
        this.setState({ posts: res.data.posts });
      })
      .catch((error) => console.log(error));
  }

  render() {
    return (
      <div className="blog">
        <div className="anchor" id="blog" />
        {this.state.posts.map((post) => (
          <ArticlePreview key={post.ID} post={post} />
        ))}
      </div>
    );
  }
}
