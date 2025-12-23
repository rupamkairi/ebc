"use client";

import { AutocompleteBase } from "./autocomplete-base";
import { useCategoriesQuery } from "@/queries/catalogQueries";
import { CategoryListParams, Category } from "@/types/catalog";

interface CategorySearchAutocompleteProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  additionalParams?: Partial<CategoryListParams>;
}

export function CategorySearchAutocomplete(
  props: CategorySearchAutocompleteProps
) {
  return (
    <AutocompleteBase<Category, CategoryListParams>
      useQueryHook={useCategoriesQuery}
      mapData={(categories) =>
        categories.map((category) => ({
          label: category.name,
          value: category.id,
        }))
      }
      {...props}
    />
  );
}
