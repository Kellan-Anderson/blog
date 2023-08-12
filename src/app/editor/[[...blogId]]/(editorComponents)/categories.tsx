'use client'

import { useEffect, useState } from "react"
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useAppDispatch, useAppSelector } from "~/redux/hooks"
import { addCategory, changeCategory, setAllCategories } from '~/redux/reducers/categoriesSlice'
import { categoryType } from "~/types";

export default function Categories({ preloadedCategories } : { preloadedCategories: categoryType[]} ) {
  const categories = useAppSelector(state => state.categoriesReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setAllCategories(preloadedCategories));
  });

  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  type categoryFormType = {
    category: string
  }
  const { register, handleSubmit } = useForm<categoryFormType>();

  const onCategorySubmit: SubmitHandler<categoryFormType> = (values) => {
    dispatch(addCategory({
      name: values.category,
      checked: true
    }));
  }

  const onCategorySubmitError: SubmitErrorHandler<categoryFormType> = (values) => {
    setErrorMessage(values.category?.message);
  }

  const onCategoryChangeHandler = (categoryName: string) => {
    dispatch(changeCategory(categoryName))
  }

  return (
    <div>
      <form className="flex flex-row gap-1 w-full" onSubmit={handleSubmit(onCategorySubmit, onCategorySubmitError)}>
        <Input placeholder="New category" {...register('category')} />
        <Button type="submit">Add</Button>
      </form>
      {errorMessage && <p className="text-red-700 font-semibold">{errorMessage}</p>}
      {categories.map((category, index) => (
        <div key={category.name}>
          <Checkbox
            defaultChecked={category.checked}
            onChange={() => onCategoryChangeHandler(category.name)}
            id={`category${index}`}
          />
          <Label htmlFor={`category${index}`} />
        </div>
      ))}
    </div>
  );
}