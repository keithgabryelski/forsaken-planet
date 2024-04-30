"use client";
import React, { Component } from "react";
import Link from "next/link";
import { Image } from "primereact/image";

export default class ArticlePreview extends Component {
  removeUnicode(string) {
    if (string.indexOf("&#8217;") >= 0) {
      return this.removeUnicode(string.replace("&#8217;", "'"));
    } else {
      return string.replace("<p>", "").replace("[&hellip;]</p>", "...");
    }
  }

  render() {
    const excerpt = this.removeUnicode(this.props.post.excerpt);

    if (this.props.post) {
      let featuredImage = null;
      let height = 1024;
      let width = 1024;
      if (this.props.post.attachments != null) {
        const attachment = Object.values(this.props.post.attachments)[0];
        if (attachment != null) {
          featuredImage = attachment.URL;
          height = attachment.height;
          width = attachment.width;
        }
      }
      if (!featuredImage) {
        featuredImage = this.props.post.featured_image;
      }

      return (
        <div className="article">
          <h1 className="text-center">{this.props.post.title}</h1>
          <a href={"/blog/" + this.props.post.ID} className="blackLink">
            {featuredImage ? (
              <Image
                className="img-responsive webpic"
                alt="article header"
                src={featuredImage}
                height={height}
                width={width}
              />
            ) : (
              ""
            )}
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
    } else {
      return null;
    }
  }
}
