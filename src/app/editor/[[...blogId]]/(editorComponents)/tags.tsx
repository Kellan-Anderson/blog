'use client'

import { useEffect, useState } from "react";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import Tag from "~/components/ui/tag";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import { addTag, setAllTags } from "~/redux/reducers/tagsSlice";

export default function Tags({ preloadedTags } : { preloadedTags: string[] | undefined }) {
  const dispatch = useAppDispatch();
  const tags = useAppSelector(state => state.tagsReducer);
  
  useEffect(() => {
    dispatch(setAllTags(preloadedTags));
  }, []);

  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  type tagsFormType = {
    tag: string
  }
  const { handleSubmit, register } = useForm<tagsFormType>();
  const onTagSubmit: SubmitHandler<tagsFormType> = (values) => {
    setErrorMessage(undefined);
    dispatch(addTag(values.tag));
  }
  const onTagSubmitError: SubmitErrorHandler<tagsFormType> = (values) => {
    setErrorMessage(values.tag?.message);
  }

  return (
    <>
      <form className="pb-2 flex flex-row gap-1" onSubmit={handleSubmit(onTagSubmit, onTagSubmitError)}>
        <Input 
          placeholder="Tag" 
          {...register('tag', {
            required: 'Please enter a tag'
          })}
        />
        <Button type="submit">Add</Button>
      </form>
      <div className="flex flex-row flex-wrap">
        {tags.map((tag) => <Tag key={tag} text={tag} onClick={(text) => console.log('I got: ', text)} onDelete={(text) => console.log('deleting: ', text)}/>)}
      </div>
    </>
  );
}