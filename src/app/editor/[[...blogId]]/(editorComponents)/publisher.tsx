import { useEffect, useRef, useState } from "react"
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { useAppSelector } from "~/redux/hooks";

export default function Publisher({ blogId } : { blogId : string }) {
  const hasChanged = useRef<boolean>(false);
  const autosaveInterval = useRef<NodeJS.Timer | undefined>();

  const prefix = blogId.split('_').at(0)

  const [autosave, setAutosave] = useState<boolean>(prefix === 'd' || prefix === 'b');
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);

  const editorValues = useAppSelector(state => state.editorReducer);
  const categoriesValues = useAppSelector(state => state.categoriesReducer);
  const tagsValues = useAppSelector(state => state.tagsReducer);

  useEffect(() => {
    if(autosave) {
      autosaveInterval.current = setInterval(save, 2000);
    } else {
      clearInterval(autosaveInterval.current);
    }
  }, [autosave]);

  
  useEffect(() => {
    hasChanged.current = true
  }, [editorValues, categoriesValues, tagsValues]);
  
  const save = async () => {
    // call api/blog/save
    if(hasChanged.current) {
      hasChanged.current = false
      // Call api
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
      <div className="flex flex-col">
        <Button onClick={handlePublishClick}>Publish</Button>
        <div>
          <Button variant="secondary" onClick={handlePreviewClick}>Preview</Button>
          <Button variant="secondary" onClick={save}>Save</Button>
        </div>
        <Button variant="destructive" onClick={handleDiscardClick}>Discard</Button>
      </div>
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogHeader>Are you sure?</AlertDialogHeader>
        <AlertDialogContent>
          Deleting this blog means that you will loose all your work forever, there is no way to recover it
        </AlertDialogContent>
        <AlertDialogFooter>
          <Button variant='secondary' onClick={() => setAlertDialogOpen(false)}>Cancel</Button>
          <Button variant='destructive' onClick={() => onBlogDelete()}>Delete</Button>
        </AlertDialogFooter>
      </AlertDialog>
    </>
  )
}