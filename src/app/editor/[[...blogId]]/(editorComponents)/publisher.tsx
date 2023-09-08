'use client'

import { useEffect, useRef, useState } from "react";
import { Switch } from "~/components/ui/switch";
import { useToast } from "~/components/ui/use-toast";
import usePromise from "~/hooks/usePromise";
import { useAppSelector } from "~/redux/hooks"
import { saveBlog } from "~/server/api/routers/blogRouter";
import { LuLoader } from 'react-icons/lu'

export default function Publisher() {
  const images = useAppSelector(state => state.imagesReducer);
  const categories = useAppSelector(state => state.categoriesReducer);
  const tags = useAppSelector(state => state.tagsReducer);
  const blogId = useAppSelector(state => state.publisherReducer);
  const editor = useAppSelector(state => state.editorReducer);

  const [autosave, setAutosave] = useState(true);
  const [savedAt, setSavedAt] = useState<Date>();
  const hasChanged = useRef(false);
  const intervalRef = useRef<NodeJS.Timer | undefined>();

  // Has to be included to pass to save function; redux values are passed as initial state and not updated state
  const details = useRef({ images, categories, tags, blogId, editor });

  const { toast } = useToast();

  const { callFn: callSave, isLoading: isSaving } = usePromise({
    promiseFn: () => saveBlog(details.current),
    onSuccess: () => setSavedAt(new Date()),
    onError: (err) => {
      toast({
        variant: 'destructive',
        title: 'There was an error saving the blog',
        description: 'There was an error while saving. Check the console for more info'
      });
      console.log(err);
    }
  });

  const save = async () => {
    if(hasChanged.current && !isSaving) {
      hasChanged.current = false;
      callSave();
    }
  }

  useEffect(() => {
    if(autosave) {
      intervalRef.current = setInterval(save, 3000);
    } else {
      clearInterval(intervalRef.current);
    }
  }, [autosave]);

  useEffect(() => {
    console.log({images, categories, tags, editor, blogId, hasChanged: hasChanged.current})
    if(blogId.length) {
      hasChanged.current = true;
      details.current = { images, categories, tags, blogId, editor }
    }
  }, [images, categories, tags, editor]);


  return (
    <>
      <div className="flex flex-row gap-1 items-center">
        <h1 className="text-base font-semibold">Autosave:</h1>
        <Switch checked={autosave} onCheckedChange={setAutosave} />
      </div>
      <div className="flex flex-row gap-1 items-center">
        <p>Saved at: </p>
        {isSaving && <LuLoader className="animate-spin"/>}
        {savedAt && savedAt.toISOString()}
      </div>
    </>
  );

}