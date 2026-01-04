import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export function AICalculator() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Describe your project requirements here to get an estimated cost.
      </p>
      <div className="flex w-full items-center space-x-2">
        <Input type="text" placeholder="Type your requirements..." />
        <Button type="submit" size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
