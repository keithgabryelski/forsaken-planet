"use client";
import React, { Component } from "react";
import Link from "next/link";
import { getFeaturedImage } from "./blog-helpers";
import { type Post } from "./blog-helpers";

type Props = {
  post: Post;
};

export default class ArticlePreview extends Component<Props> {
  removeUnicode(string: string): string {
    if (string.indexOf("&#8217;") >= 0) {
      return this.removeUnicode(string.replace("&#8217;", "'"));
    }

    return string.replace("<p>", "").replace("[&hellip;]</p>", "...");
  }

  render() {
    const excerpt = this.removeUnicode(this.props.post.excerpt ?? "");
    const featuredImage = getFeaturedImage(this.props.post);

    return (
      <div className="article">
        <h1 className="text-center">{this.props.post.title}</h1>
        <a href={"/blog/" + this.props.post.ID} className="blackLink">
          {featuredImage}
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: excerpt }}
          />
        </a>
        <Link href={"/blog/" + this.props.post.ID}>
          <button className="btn">Read More</button>
        </Link>
      </div>
    );
  }
}
