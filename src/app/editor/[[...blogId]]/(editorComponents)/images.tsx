'use client'

import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import { addImage, setInitialImages } from "~/redux/reducers/imagesSlice";
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

export default function Images({ preloadedImages } : { preloadedImages: imagesType[] }) {
  const blogImages = useAppSelector(state => state.imagesReducer);
  const dispatch = useAppDispatch();
  const { userId } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    dispatch(setInitialImages(preloadedImages))  
  }, []);

  const [file, setFile] = useState<File>();
  const [filename, setFilename] = useState('');
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const imageUploadResponseObject = z.object({
    success: z.boolean(),
    name: z.string(),
    url: z.string(),
    id: z.string()
  });

  const uploadImage = async () => {
    setUploadLoading(true)
    const data = new FormData();

    if(!file) throw new Error('No file attached');
    if(!userId) throw new Error('User not signed in, please try again');

    data.set('file', file);
    data.set('filename', filename);
    data.set('uid', userId);
    data.set('blogId', 'd_blog1') // todo change to state that you get from redux publisher slice

    const result = await fetch('/api/images', {
      method: "post",
      body: data
    });

    try {
      if(result.ok) {
        const resultObj = await result.json();
        const {id, name, url} = imageUploadResponseObject.parse(resultObj);
        dispatch(addImage({id, name, url}));
        toast({title: 'Success', description: 'Your image was uploaded'})
      } else throw Error('Upload failed');
      setImageDialogOpen(false);
    } catch(e) {
      console.log(e);
      toast({
        title: 'Upload Failed',
        description: 'There as an issue uploading your image, please try again', 
        variant: 'destructive'
      });
    }
    setUploadLoading(false);
  }

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
    <>
      {blogImages.map(image => (
        <Tag
          key={image.id}
          text={image.name ?? image.url}
          onClick={() => {
            navigator.clipboard.writeText(image.url);
            toast({title: 'Copied to clipboard', description: 'Copied image url to clipboard'})
          }}
        />
      ))}
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
                uploadImage();
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
                    {uploadLoading ? (
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
    </>
  );
}