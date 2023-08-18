import axios from "axios";

export function uploadImage({ file, filename, userId, blogId } : {
  file: File | undefined,
  userId: string,
  filename?: string,
  blogId?: string
}) {
  const data = new FormData();

  if(!file) throw new Error('No file provided');

  data.set('file', file);
  data.set('filename', filename ?? file.name);
  data.set('userId', userId)
  if(blogId) data.set('blogId', blogId)

  return fetch('/api/images', {
    method: 'post',
    body: data
  });
}