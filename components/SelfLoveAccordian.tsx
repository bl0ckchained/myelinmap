import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

type AccordionItemType = {
  title: string;
  description: string;
};

export default function SelfLoveAccordion({
  title,
  content,
}: {
  title: string;
  content: AccordionItemType[];
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-xl font-bold text-pink-400 mb-4">{title}</h3>
      <Accordion type="single" collapsible>
        {content.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-lg font-semibold text-pink-300 hover:text-pink-200">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="text-gray-200 text-md pt-1">
              {item.description}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
