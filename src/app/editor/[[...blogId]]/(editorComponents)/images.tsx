'use client'

import { useEffect, useRef, useState } from "react";

import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import { addImage, deleteImage, setInitialImages } from "~/redux/reducers/imagesSlice";
import { imagesType } from "~/types";

import { useAuth } from "@clerk/nextjs";
import validateImage from "~/lib/helpers/validateImageFile";

import { Button } from "~/components/ui/button";
import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { FiUpload } from 'react-icons/fi';
import { LuLoader2 } from 'react-icons/lu'
import Tag from "~/components/ui/tag";
import { z } from "zod";
import { useToast } from "~/components/ui/use-toast";
import usePromise from "~/hooks/usePromise";
import { uploadImage } from "~/server/api/routers/imagesRouter";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog";

export default function Images({ preloadedImages } : { preloadedImages: imagesType[] }) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setInitialImages(preloadedImages))  
  }, []);

  return (
    <>
      <ImageTags /> 
      <AddImageDialog />
    </>
  );
}

function ImageTags() {
  const blogImages = useAppSelector(state => state.imagesReducer);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const [alertOpen, setAlertOpen] = useState(false);
  const imageRef = useRef<string | undefined>();

  const onDelete = (imageId: string) => {
    imageRef.current = imageId;
    setAlertOpen(true);
  }
  
  const onDeleteConfirms = () => {
    const imageId = imageRef.current ?? '';
    dispatch(deleteImage(imageId));
    setAlertOpen(false);
  }

  return (
    <>
      {blogImages.map(image => (
        <Tag
          key={image.id}
          text={image.name ?? image.url}
          onClick={() => {
            navigator.clipboard.writeText(image.url);
            toast({title: 'Copied to clipboard', description: 'Copied image url to clipboard'})
          }}
          onDelete={() => onDelete(image.id)}
        />
      ))}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogTitle>Delete image</AlertDialogTitle>
        <AlertDialogHeader>
          Are you sure you want to delete this image from the blog? It will still be available to you in the images gallery
        </AlertDialogHeader>
        <AlertDialogContent>
          <Button variant='secondary' onClick={() => setAlertOpen(false)}>Cancel</Button>
          <Button 
            variant='destructive'
            onClick={() => onDeleteConfirms()}
          >
            Delete
          </Button>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function AddImageDialog() {
  const dispatch = useAppDispatch();
  const { userId } = useAuth();
  const { toast } = useToast();

  const [file, setFile] = useState<File>();
  const [filename, setFilename] = useState('');
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const imageUploadResponseObject = z.object({
    success: z.boolean(),
    name: z.string(),
    url: z.string(),
    id: z.string()
  });

  const { isLoading, callFn } = usePromise({
    promiseFn: () => uploadImage({ file, userId: userId ?? '', filename }),
    onSuccess: (data) => {
      const imageObj = imageUploadResponseObject.parse(data);
      dispatch(addImage(imageObj));
      setImageDialogOpen(false);
      toast({title: 'Success', description: 'Your image was uploaded'});
    },
    onError: (err) => {
      console.log(err)
      toast({
        title: 'Upload Failed',
        description: 'There as an issue uploading your image, please try again', 
        variant: 'destructive'
      });
    }
  });

  // Runs the image through a verification step. If the image does not meet the specifications in validateImage() then
  // set an error message, otherwise set the file
  const onImageUploaded = (file: File | undefined) => {
    if(!file) return
    const verification = validateImage(file);
    if(!verification.verified) {
      console.log('image not verified: ', verification.messages)
      setErrorMessages(verification.messages);
    } else {
      setErrorMessages([]);
      setFile(file)
    }
  }

  return (
    <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
      <DialogTrigger asChild>
        <Button type="button">Add image</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add an image</DialogTitle>
        </DialogHeader>
        <div className="max-w-xl">
          <Label
            className={`flex justify-center w-full min-h-fit px-4 transition bg-white border-gray-300 border-dashed 
            ${!file ? 'border-2' : 'border-0'} rounded-md appearance-none cursor-pointer hover:border-gray-400 
            focus:outline-none`}
            htmlFor="file-upload"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              onImageUploaded(e.dataTransfer.files?.[0]);
            }}
          >
            {!file ? (
              <span className="flex items-center space-x-2 h-32">
                <FiUpload />
                <span className="font-medium text-gray-600">
                  Drop files to Attach, or {' '}
                  <span className="text-blue-600 underline">browse</span>
                </span>
              </span>
            ) : (
              <img src={URL.createObjectURL(file)} alt="" className="w-full" />
            )}
            <input 
              type="file"
              id="file-upload"
              name="file_upload" 
              className="hidden" 
              onChange={(e) => {
                e.preventDefault();
                onImageUploaded(e.target.files?.[0]);
              }}
            />
          </Label>
          <div className="flex flex-col gap-0.5">
            {errorMessages.map(err => <p key={err} className="text-sm text-red-700">{err}</p>)}
          </div>
          {file && (
            <form className="w-full px-4 pt-3 flex flex-row items-center gap-1" onSubmit={(e) => {
              e.preventDefault();
              callFn();
            }}>
              <div className="w-full flex flex-row items-center gap-2">
                <Label className="text-md">Name: </Label>
                <Input
                  placeholder="Testing"
                  defaultValue={file.name}
                  onChange={(e) => setFilename(e.target.value)}
                  className=""
                />
                <Button type="submit" className="whitespace-nowrap w-40" >
                  {isLoading ? (
                    <LuLoader2 className="animate-spin"/>
                  ) : (
                    'Add image'
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}