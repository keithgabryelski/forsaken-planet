"use client";
import React, { Component } from "react";
import axios from "axios";
import { getFeaturedImage } from "../blog-helpers";
import { type Post } from "../blog-helpers";

type Props = {
  params: {
    id: number;
  };
};

type State = {
  post: Post;
};

export default class Article extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      post: {},
    };
  }

  removeUnicode(string: string): string {
    if (string.indexOf("&#8217;") >= 0) {
      return this.removeUnicode(string.replace("&#8217;", "'"));
    }
    return string;
  }

  componentDidMount() {
    axios
      .get(
        "https://public-api.wordpress.com/rest/v1/sites/forsaken-planet.wordpress.com/posts/" +
          this.props.params.id,
      )
      .then((res) => {
        this.setState({ post: res.data });
        const container = document.querySelector(".content");
        const scr = container?.querySelectorAll("script");
        scr?.forEach((node) => {
          const parent = node.parentElement;
          if (parent == null) {
            return;
          }
          const d = document.createElement("script");
          d.async = node.async;
          d.src = node.src;
          d.type = "text/javascript";
          parent.insertBefore(d, node);
          parent.removeChild(node);
          //d.onload = console.log(d);
        });
      })
      .catch((error) => console.log(error));
  }

  render() {
    const featuredImage = getFeaturedImage(this.state.post);
    return (
      <div className="blog">
        <div className="article">
          {featuredImage}
          <h1 className="text-center">{this.state.post.title}</h1>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: this.state.post.content ?? "" }}
          />
        </div>
      </div>
    );
  }
}
