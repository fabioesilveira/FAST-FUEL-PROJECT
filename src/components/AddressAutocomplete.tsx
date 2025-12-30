import { useEffect, useState } from "react";
import axios from "axios";
import { Autocomplete, TextField } from "@mui/material";

type AddressOption = {
  id: string;
  full: string;      // dropdown
  street: string;    // input
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
  sx?: any;
};

const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_KEY;

function streetFromFull(full: string) {
  // pega tudo antes da primeira vírgula
  return (full || "").split(",")[0]?.trim() || "";
}

export default function AddressAutocomplete({ onSelect, onInput, sx }: Props) {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<AddressOption[]>([]);

  // texto que aparece dentro do input
  const [inputValue, setInputValue] = useState("");

  // option selecionada
  const [value, setValue] = useState<AddressOption | null>(null);

  useEffect(() => {
    if (query.trim().length < 3) {
      setOptions([]);
      return;
    }

    const t = setTimeout(async () => {
      try {
        const res = await axios.get(
          "https://api.geoapify.com/v1/geocode/autocomplete",
          {
            params: {
              text: query,
              limit: 5,
              format: "json",
              apiKey: GEOAPIFY_KEY,
            },
          }
        );

        const results: AddressOption[] = (res.data?.results ?? []).map(
          (r: any, idx: number) => {
            const full = r.formatted ?? "";
            const street =
              (r.address_line1 ?? "").trim() || streetFromFull(full);

            return {
              id: String(r.place_id ?? `${full}-${idx}`),
              full,
              street,
              city: r.city ?? "",
              state: r.state ?? "",
              postcode: r.postcode ?? "",
              country: r.country ?? "",
            };
          }
        );

        setOptions(results);
      } catch {
        setOptions([]);
      }
    }, 350);

    return () => clearTimeout(t);
  }, [query]);

  return (
    <Autocomplete
      options={options}
      popupIcon={null}
      filterOptions={(x) => x}
      value={value}
      inputValue={inputValue}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      getOptionLabel={(opt) => opt.full} // dropdown usa full

      // ✅ dropdown bonito, mas sem “forçar” full no input
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

        if (v === "") {
          setQuery("");
          setOptions([]);
          setValue(null);
        }
      }}

      onChange={(_, opt) => {
        setValue(opt);

        if (!opt) return;

        // ✅ input mostra SÓ street
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
          placeholder="Start typing your street"
          helperText="Demo only — any valid address works"
          sx={sx}
        />
      )}
    />
  );
}
