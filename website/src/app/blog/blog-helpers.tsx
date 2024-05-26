import * as React from "react";
import Image from "next/image";

export type Post = {
  attachments?: {
    URL: string;
    width: number;
    height: number;
  }[];
  featured_image?: string;
  title?: string;
  content?: string | TrustedHTML;
  excerpt?: string;
  ID?: number;
};

export function getFeaturedImage(post: Post) {
  let featuredImage = null;
  let height = 1024;
  let width = 1024;
  if (post.attachments != null) {
    const attachment = Object.values(post.attachments)[0];
    if (attachment != null) {
      featuredImage = attachment.URL;
      if (attachment.width < width) {
        width = attachment.width;
        height = attachment.height;
      } else {
        height = attachment.height / (attachment.width / width);
      }
    }
  }
  if (!featuredImage) {
    featuredImage = post.featured_image;
  }
  if (featuredImage) {
    return (
      <Image
        className="img-responsive webpic"
        alt="featured image"
        src={featuredImage}
        width={width}
        height={height}
      />
    );
  }
  return null;
}
