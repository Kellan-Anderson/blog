'use client'

import { useEffect, useRef, useState } from "react"
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import usePromise from "~/hooks/usePromise";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import { setId } from "~/redux/reducers/publisherSlice";
import { saveFn } from "~/server/api/routers/blogRouter";

export default function Publisher({ blogId } : { blogId : string }) {
  const hasChanged = useRef<boolean>(false);
  const autosaveInterval = useRef<NodeJS.Timer | undefined>();

  const prefix = blogId.split('_').at(0)

  const [autosave, setAutosave] = useState<boolean>(prefix === 'd' || prefix === 'b');
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);

  const editor = useAppSelector(state => state.editorReducer);
  const categories = useAppSelector(state => state.categoriesReducer);
  const tags = useAppSelector(state => state.tagsReducer);
  const images = useAppSelector(state => state.imagesReducer);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setId(blogId))
  }, []);

  useEffect(() => {
    if(autosave) {
      autosaveInterval.current = setInterval(save, 2000);
    } else {
      clearInterval(autosaveInterval.current);
    }
  }, [autosave]);
  
  useEffect(() => {
    console.log('detected change')
    hasChanged.current = true
  }, [editor, categories, tags, images]);

  const { callFn, isLoading: isSaving } = usePromise({
    promiseFn: () => saveFn({ categories, editor, images, tags, blogId }),
    onSuccess: (data) => console.log('Success: ', data),
    onError: (err) => console.log('Error: ', err)
  });
  
  const save = async () => {
    // call api/blog/save
    console.log('Checking for save')
    if(hasChanged.current && !isSaving) {
      console.log('saving')
      hasChanged.current = false
      callFn();
    }
  }

  const handlePublishClick = () => {
    // call api/blog/publish
  }

  const handlePreviewClick = () => {
    // Call save API
    // navigate to blog page with preview
  }
  const handleDiscardClick = () => {
    // 
  }

  const onBlogDelete = () => {
    //
  }

  return (
    <>
      <Button
        onClick={() => save()}
      >
        save
      </Button>
      <Switch checked={autosave} onCheckedChange={setAutosave}/>
    </>
  )
}