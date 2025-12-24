import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  TypographyP,
  TypographyResponsiveSmall,
} from "@/components/ui/typography";

type AccordionItemData = {
  question: string;
  answer: string;
};

interface AccordionBaseProps {
  items: AccordionItemData[];
  className?: string;
}

export function AccordionBase({ items, className }: AccordionBaseProps) {
  return (
    <Accordion
      type="single"
      collapsible
      className={`w-full border rounded-2xl bg-white overflow-hidden ${className}`}
    >
      {items.map((item, index) => (
        <AccordionItem key={index} value={item.question}>
          <AccordionTrigger className="w-full inner-p text-left hover:bg-slate-50 transition-colors group">
            <TypographyResponsiveSmall>
              {item.question}
            </TypographyResponsiveSmall>
          </AccordionTrigger>
          <AccordionContent>
            <div className="inner-p border-t border-slate-50 ">
              <TypographyP className="text-muted-foreground mt-0!">
                {item.answer}
              </TypographyP>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
