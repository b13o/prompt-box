"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

export default function Home() {
  return (
    <main className="p-6 max-w-2xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>shadcn/ui 動作確認</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button>Button</Button>
            <Badge>Badge</Badge>
          </div>

          <div>
            <Label>Input</Label>
            <Input placeholder="テスト入力" />
          </div>

          <Textarea placeholder="Textarea" rows={2} />

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>テストダイアログ</DialogTitle>
              </DialogHeader>
              <p>Dialog内容</p>
            </DialogContent>
          </Dialog>

          <Button onClick={() => toast("Sonner動作確認")} variant="outline">
            Toast
          </Button>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Accordion</AccordionTrigger>
              <AccordionContent>Accordion内容</AccordionContent>
            </AccordionItem>
          </Accordion>

          <ScrollArea className="h-20 border rounded p-2">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i}>ScrollArea項目 {i + 1}</div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </main>
  );
}
