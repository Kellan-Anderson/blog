'use client'

import { useEffect } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Card, CardContent, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
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

  useEffect(() => {dispatch(setEditorDetails(preloadedBlog))}, [dispatch, preloadedBlog] );

  return (
    <Card className="p-1 h-full flex flex-col">
      <CardTitle className="p-3">Editor</CardTitle>
      <CardContent className="grow">
        <div className="flex flex-col gap-2 h-full">
          <Label>Title</Label>
          <Input
            placeholder="Title"
            onChange={(e) => dispatch(setTitle(e.target.value))}
            value={title}
          />
          <Label>Description</Label>
          <Textarea 
            placeholder="Description" 
            onChange={(e) => dispatch(setDescription(e.target.value))} 
            value={description}
          />
          {contentError && <p className="text-red-700">{contentError}</p>}
          {titleError && <p className="text-red-700">{titleError}</p>}
          <Tabs defaultValue="editor" className="pt-4 grow flex flex-col">
            <TabsList className="w-fit">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="editor" className="grow">
              <Textarea
                onChange={(e) => dispatch(setContent(e.target.value))}
                value={content}
                className="h-full"
              />
            </TabsContent>
            <TabsContent value="preview" className="h-full">
              <ScrollArea className="m-px">
                <ReactMarkdown className="markdown h-full">
                  {content === '' ? '# Enter some text to see it appear here' : content}
                </ReactMarkdown>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}