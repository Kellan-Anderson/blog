import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import Categories from "./categories";
import { categoryType, imagesType } from "~/types";
import Tags from "./tags";
import Images from "./images";

type detailsProps = {
  categories: categoryType[],
  images: imagesType[],
  tags: string[] | undefined,
}
 
export default function DetailsAccordion({ categories, tags, images } : detailsProps) {
  return (
    <Accordion type="single" defaultValue="publisher" collapsible>
      {/* Publisher */}
      <AccordionItem value="publisher">
        <AccordionTrigger>Publish</AccordionTrigger>
        <AccordionContent>Nothing here yet 🤪</AccordionContent>
      </AccordionItem>

      {/* Categories */}
      <AccordionItem value="categories">
        <AccordionTrigger>Categories</AccordionTrigger>
        <AccordionContent>
          <Categories preloadedCategories={categories} />
        </AccordionContent>
      </AccordionItem>

      {/* Tags */}
      <AccordionItem value="Tags">
        <AccordionTrigger>Tags</AccordionTrigger>
        <AccordionContent>
          <Tags preloadedTags={tags}/>
        </AccordionContent>
      </AccordionItem>
      
      {/* Images */}
      <AccordionItem value="images">
        <AccordionTrigger>Images</AccordionTrigger>
        <AccordionContent>
          <Images preloadedImages={images} />
        </AccordionContent>
      </AccordionItem>

    </Accordion>
  );
}