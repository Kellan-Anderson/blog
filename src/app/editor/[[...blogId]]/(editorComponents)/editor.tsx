'use client'

import { useEffect } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import { setContent, setDescription, setEditorDetails, setTitle } from "~/redux/reducers/editorSlice";
import { editorType } from "~/types";

export default function Editor({ preloadedBlog } : { preloadedBlog: editorType }) {
  const {
    content,
    contentError,
    title,
    titleError,
    description
  } = useAppSelector(state => state.editorReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setEditorDetails(preloadedBlog))
  }, []);

  return (
    <div>
      <Input placeholder="Title" onChange={(e) => dispatch(setTitle(e.target.value))} value={title}/>
      <Textarea placeholder="Description" onChange={(e) => dispatch(setDescription(e.target.value))} value={description}/>
      {contentError && <p className="text-red-700">{contentError}</p>}
      {titleError && <p className="text-red-700">{titleError}</p>}
      <Card>
        <Tabs defaultValue="editor">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="editor">
            <Textarea onChange={(e) => dispatch(setContent(e.target.value))} value={content}/>
          </TabsContent>
          <TabsContent value="preview">
            <ReactMarkdown className="markdown">
              {content === '' ? '# Enter some text to see it appear here' : content}
            </ReactMarkdown>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}