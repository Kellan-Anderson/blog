import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import Categories from "./categories";
import { categoryType } from "~/types";

type detailsProps = {
  categories: categoryType[]
}

export default function DetailsAccordion({ categories } : detailsProps) {
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
    </Accordion>
  );
}