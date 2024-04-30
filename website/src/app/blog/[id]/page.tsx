"use client";
import React, { Component } from "react";
import { Image } from "primereact/image";
import axios from "axios";

export default class Article extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: {},
    };
  }

  removeUnicode(string) {
    if (string.indexOf("&#8217;") >= 0) {
      return this.removeUnicode(string.replace("&#8217;", "'"));
    } else {
      return string;
    }
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
        const scr = container.querySelectorAll("script");
        scr.forEach((node) => {
          const parent = node.parentElement;
          const d = document.createElement("script");
          d.async = node.async;
          d.src = node.src;
          d.type = "text/javascript";
          parent.insertBefore(d, node);
          parent.removeChild(node);
          d.onload = console.log(d);
        });
      })
      .catch((error) => console.log(error));
  }

  parseOutScripts(_content) {}

  render() {
    if (this.state.post) {
      let featuredImage = null;
      let height = 1024;
      let width = 1024;
      if (this.state.post.attachments != null) {
        const attachment = Object.values(this.state.post.attachments)[0];
        if (attachment != null) {
          featuredImage = attachment.URL;
          height = attachment.height;
          width = attachment.width;
        }
      }
      if (!featuredImage) {
        featuredImage = this.state.post.featured_image;
      }

      return (
        <div className="blog">
          <div className="article">
            {featuredImage ? (
              <Image
                className="img-responsive webpic"
                alt="article header"
                src={featuredImage}
                width={width}
                height={height}
              />
            ) : (
              ""
            )}
            <h1 className="text-center">{this.state.post.title}</h1>
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: this.state.post.content }}
            />
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}
