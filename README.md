# Kellan Anderson's Blog Project

Requirements and thought process behind blogging for the first time

## Why make a blog?

I want to make a blog to give myself a platform to share my ideas, what I'm building, and what I'm learning about. Most importantly, I want to use the platform to share my faith and to help others learn about & know Jesus.

I also think a blog would be a fun project 😁

## Blog Requirements

- Needs to be fully tested.
- Should allow me to write blog posts using mdx.
- Should allow users to have the option to comment on my blog posts.
- Users should be able to search, sort, and filter blog posts on the home page.
- There should be scripts to create, delete, and update blog posts.

## How I'm going to build it

For writing the blog posts I want to use a react mdx library to take mdx content that exists on the server and transform that into html. I want to use Next.js for this project so that I can take advantage of the frameworks server components, routing system, and build time caching.

Each blog post is going to have several pieces of metadata which include: title, sub title, author, published date, last updated date, tags, whether the blog is published, and id. I want to put the metadata at the top of each blog post and access it using a package called gray-matter. Gray-matter parses the top-level data in a file and when coupled with a validation library like zod, it provides a type safe way to interact with the file contents.

In addition to placing the metadata for a blog post at the top of a file, I want to sync it to an external database as well. This will allow me to have some extra functionality surrounding searching and filtering blog posts.

Each blog post will have a unique id similar to a sequence number. The numbering system will be zero-indexed, meaning the title of the first blog post will look something like *#0: Hello World*. This will be reflected in the post url as well, so when following the example above the url would look like */posts/#0-hello-world*.

To help me to keep track of all the metadata, sequencing, and published status, I want to use custom scripts. There will be scripts for creating blog posts, syncing any changed metadata, deleting posts, and publishing/unpublishing posts.

Deleting blog posts pose a unique challenge due to blog sequencing. If there are three blog posts having the id sequence of 0-2, and I delete the post having the id of 1, the following blog posts would be out of order. To overcome this, there will be a status for a deleted post that tells the user that the post has been deleted.

Some of the things I want to talk about in my blog posts will include code snippets, so I want to implement some version of syntax highlighting. I am still unfamiliar to how to implement this.

## Testing

I want to use test-driven development (TDD) for this project, following the red-green-refactor method. Testing is something that I do not have a lot of experience with when coding my own applications, so I expect this process to be challenging at first. I know I want to write at least one test for each feature, but I do not know what the given extent is for this.
