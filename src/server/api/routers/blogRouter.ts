import { categoryType, editorType, imagesType } from "~/types";

export function saveFn({
  images,
  tags,
  categories,
  editor,
  blogId
} : {
  images: imagesType[],
  tags: string[],
  categories: categoryType[],
  editor: editorType,
  blogId: string
}) {
  const body = {
    categoryIds: categories.map(cat => cat.id),
    imageIds: images.map(i => i.id),
    tags,
    content: editor.content,
    blogId,
    title: editor.title,
    description: editor.description
  }

  console.log('Sending: ', JSON.stringify(body))

  return fetch('/api/blog', {
    method: 'put',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(body),
  })
}

/*
Option #1 -> Delete and re-write
Pros: 
  - simple
  - Easy to implement
  - Supabase has unlimited api calls on free tier so no charges for a high amount of reads and writes
Cons:
  - slow?
  - Could loose the blog if something goes wrong

Option #2 -> Cache changes using redis and re-write later
Pros:
  - Faster
  - Less re-writes to database
Cons:
  - Extra steps
  - More complicated than option #1
*/