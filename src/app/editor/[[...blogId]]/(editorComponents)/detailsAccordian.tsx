import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import Categories from "./categories";
import { categoryType } from "~/types";
import Tags from "./tags";

type detailsProps = {
  categories: categoryType[],
  tags: string[]
}

export default function DetailsAccordion({ categories, tags } : detailsProps) {
  return (
    <Accordion type="multiple">
      {/* Publisher */}
      <AccordionItem value="publisher">
        <AccordionTrigger>Publish</AccordionTrigger>
        <AccordionContent>Nothing here yet 🤪</AccordionContent>
      </AccordionItem>

      {/* Categories */}
      <AccordionItem value="categories">
        <AccordionContent>
          <Categories preloadedCategories={categories} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="Tags">
        <AccordionContent>
          <Tags />
        </AccordionContent>
      </AccordionItem>

    </Accordion>
  );
}