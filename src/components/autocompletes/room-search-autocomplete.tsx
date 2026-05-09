"use client";

import { AutocompleteBase } from "./autocomplete-base";
import { useRoomsQuery } from "@/queries/catalogQueries";
import { Room, RoomListParams } from "@/types/catalog";

interface RoomSearchAutocompleteProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function RoomSearchAutocomplete(
  props: RoomSearchAutocompleteProps
) {
  return (
    <AutocompleteBase<Room, RoomListParams>
      useQueryHook={useRoomsQuery}
      mapData={(rooms) =>
        rooms.map((room) => ({
          label: room.name,
          value: room.id,
        }))
      }
      {...props}
    />
  );
}
