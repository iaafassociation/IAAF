"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FieldProps } from "formik";

export function DatePicker({ field, form }: FieldProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className="outline-none max-md:h-[16px] max-md:p-1  focus:shadow-none w-[430px] max-md:w-[100px] max-md:text-[6px]/3 text-[#A3AAC2] text-lg border border-[#E0E3EB] bg-white rounded-sm p-1.5"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {field.value ? (
            format(field.value, "dd/MM/yyyy")
          ) : (
            <span>تاريخ الحدث</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={(e) => {
            console.log(e);
            console.log(new Date(String(e)).getTime());
            form.values.date = e;
            form.validateForm();
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
