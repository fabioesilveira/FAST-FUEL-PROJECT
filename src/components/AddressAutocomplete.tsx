// src/components/AddressAutocomplete.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Autocomplete, TextField } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

type AddressOption = {
  id: string;
  full: string; // dropdown
  street: string; // input
  city: string;
  state: string;
  postcode: string;
  country: string;
};

type Props = {
  onSelect: (addr: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country?: string;
  }) => void;
  onInput?: (value: string) => void;
  sx?: SxProps<Theme>;
  requireZip5?: boolean;
};

const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_KEY as string;

function streetFromFull(full: string) {
  return (full || "").split(",")[0]?.trim() || "";
}

const isZip5 = (v: string) => /^\d{5}$/.test((v || "").trim());

export default function AddressAutocomplete({
  onSelect,
  onInput,
  sx,
  requireZip5 = false,
}: Props) {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<AddressOption[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState<AddressOption | null>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 3) {
      setOptions([]);
      return;
    }

    const t = setTimeout(async () => {
      try {
        const res = await axios.get("https://api.geoapify.com/v1/geocode/autocomplete", {
          params: {
            text: q,
            limit: 8,
            format: "json",
            apiKey: GEOAPIFY_KEY,

            filter: "countrycode:us",
            bias: "countrycode:us",
          },
        });

        const results: AddressOption[] = (res.data?.results ?? [])
          .map((r: any, idx: number): AddressOption => {
            const full = String(r.formatted ?? "").trim();

            const street =
              String(r.address_line1 ?? "").trim() || streetFromFull(full);

            const city = String(
              r.city ?? r.town ?? r.village ?? r.hamlet ?? r.suburb ?? ""
            ).trim();

            const postcode = String(r.postcode ?? "").trim();

            return {
              id: String(r.place_id ?? `${full}-${idx}`),
              full,
              street,
              city,
              state: String(r.state ?? "").trim(),
              postcode,
              country: String(r.country ?? "").trim(),
            };
          })
          .filter((o: AddressOption) =>
            requireZip5 ? isZip5(o.postcode) : true
          );

        setOptions(results);
      } catch (e) {
        console.error("Geoapify error:", e);
        setOptions([]);
      }
    }, 350);

    return () => clearTimeout(t);
  }, [query, requireZip5]);

  return (
    <Autocomplete
      options={options}
      popupIcon={null}
      filterOptions={(x) => x}
      value={value}
      inputValue={inputValue}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      getOptionLabel={(opt) => opt.full}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {option.full}
        </li>
      )}
      onInputChange={(_, v, reason) => {
        setInputValue(v);
        onInput?.(v);

        if (reason === "input") {
          setQuery(v);
          setValue(null);
        }

        if (reason === "clear" || v === "") {
          setQuery("");
          setOptions([]);
          setValue(null);
        }
      }}
      onChange={(_, opt) => {
        setValue(opt);
        if (!opt) return;

        setInputValue(opt.street); 
        setQuery(opt.street);
        onInput?.(opt.street);

        onSelect({
          street: opt.street,
          city: opt.city,
          state: opt.state,
          zip: opt.postcode,
          country: opt.country,
        });
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          size="small"
          label="Street"
          placeholder="Start typing and select an address"
          helperText="Select an address from the list"
          sx={sx}
        />
      )}
    />
  );
}
