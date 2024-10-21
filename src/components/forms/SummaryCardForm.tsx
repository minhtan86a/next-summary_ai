"use client";
import { useFormState } from "react-dom";
import {
  updateSummaryAction,
  deleteSummaryAction,
} from "@/data/actions/summary-actions";
import { StrapiErrors } from "@/components/custom/strapi-errors";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { SubmitButton } from "@/components/custom/submit-button";
import { DeleteButton } from "@/components/custom/DeleteButton";

const INITIAL_STATE = {
  strapiErrors: null,
  data: null,
  message: null,
};

export function SummaryCardForm({
  item,
  className,
}: {
  readonly item: any;
  readonly className?: string;
}) {
  //console.log("item:", item);
  const deleteSummaryById = deleteSummaryAction.bind(
    null,
    item.data.documentId
  );

  const [deleteState, deleteAction] = useFormState(
    deleteSummaryById,
    INITIAL_STATE
  );

  const [updateState, updateAction] = useFormState(
    updateSummaryAction,
    INITIAL_STATE
  );

  return (
    <Card className={cn("mb-8 relative h-auto", className)}>
      <CardHeader>
        <CardTitle>Video Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <form action={updateAction}>
            <Input
              id="title"
              name="title"
              placeholder="Update your title"
              required
              className="mb-4"
              defaultValue={item.data.title}
            />
            <Textarea
              name="summary"
              className="flex w-full rounded-md bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:bg-gray-50 focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 mb-4 h-[calc(100vh-245px)] "
              defaultValue={item.data.summary}
            />
            <input type="hidden" name="id" value={item.data.documentId} />
            <SubmitButton
              text="Update Summary"
              loadingText="Updating Summary"
            />
          </form>
          <form action={deleteAction}>
            <DeleteButton className="absolute right-4 top-4 bg-red-700 hover:bg-red-600" />
          </form>
        </div>
      </CardContent>
      <CardFooter>
        <StrapiErrors
          error={deleteState?.strapiErrors || updateState?.strapiErrors}
        />
      </CardFooter>
    </Card>
  );
}
