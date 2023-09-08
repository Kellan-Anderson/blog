export type categoryType = {
  name: string,
  checked: boolean,
  id: string
}

export type editorType = {
  content: string,
  contentError?: string,
  title: string,
  titleError?: string,
  description: string,
}

export type imagesType = {
  name: string | null,
  url: string,
  id: string
}

export type publishType = {
  id: string,
  autosave: boolean
}