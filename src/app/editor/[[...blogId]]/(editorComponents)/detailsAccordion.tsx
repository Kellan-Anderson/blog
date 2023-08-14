import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import Categories from "./categories";
import { categoryType } from "~/types";
import Tags from "./tags";

type detailsProps = {
  categories: categoryType[],
}
 
export default function DetailsAccordion({ categories } : detailsProps) {
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

      {/*

      <AccordionItem value="Tags">
        <AccordionContent>
          <Tags />
        </AccordionContent>
      </AccordionItem>

    */}

    </Accordion>
  );
}