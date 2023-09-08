'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import Categories from "./categories";
import { categoryType, imagesType } from "~/types";
import Tags from "./tags";
import Images from "./images";
import Publisher from "./publisher";
import { useEffect } from "react";
import { useAppDispatch } from "~/redux/hooks";
import { setInitialImages } from "~/redux/reducers/imagesSlice";
import { setAllTags } from "~/redux/reducers/tagsSlice";
import { setAllCategories } from "~/redux/reducers/categoriesSlice";
import { setId } from "~/redux/reducers/publisherSlice";

type detailsProps = {
  categories: categoryType[],
  images: imagesType[],
  tags: string[] | undefined,
  blogId: string
}
 
export default function DetailsAccordion({ categories, tags, images, blogId } : detailsProps) {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(setInitialImages(images));
    dispatch(setAllTags(tags));
    dispatch(setAllCategories(categories));
    dispatch(setId(blogId));
  }, [])

  return (
    <Accordion type="multiple" defaultValue={['publisher']}>
      {/* Publisher */}
      <AccordionItem value="publisher">
        <AccordionTrigger>Publish</AccordionTrigger>
        <AccordionContent>
          <Publisher />
        </AccordionContent>
      </AccordionItem>

      {/* Categories */}
      <AccordionItem value="categories">
        <AccordionTrigger>Categories</AccordionTrigger>
        <AccordionContent>
          <Categories />
        </AccordionContent>
      </AccordionItem>

      {/* Tags */}
      <AccordionItem value="Tags">
        <AccordionTrigger>Tags</AccordionTrigger>
        <AccordionContent>
          <Tags />
        </AccordionContent>
      </AccordionItem>
      
      {/* Images */}
      <AccordionItem value="images">
        <AccordionTrigger>Images</AccordionTrigger>
        <AccordionContent>
          <Images />
        </AccordionContent>
      </AccordionItem>

    </Accordion>
  );
}