// src/components/AddressLookup.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Autocomplete, TextField } from "@mui/material";

type AddressResult = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

type AddressOption = {
  full: string;      // endereço completo (dropdown)
  street: string;    // o que vai aparecer no input 
  city: string;
  state: string;
  postcode: string;
};

type AddressLookupProps = {
  sx?: any;

  // controlled input 
  inputValue?: string;
  onInputChange?: (value: string) => void;

  // callback 
  onInput?: (value: string) => void;

  // quando seleciona uma opção
  onSelect: (addr: AddressResult) => void;
};

const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_KEY;

export default function AddressLookup({
  onSelect,
  onInput,
  sx,
  inputValue: controlledInputValue,
  onInputChange,
}: AddressLookupProps) {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<AddressOption[]>([]);
  const [value, setValue] = useState<AddressOption | null>(null);

  // suporte a controlled/uncontrolled
  const [internalInput, setInternalInput] = useState("");

  const isControlled = controlledInputValue !== undefined;
  const shownInputValue = isControlled ? controlledInputValue : internalInput;

  const setShownInput = (v: string) => {
    if (!isControlled) setInternalInput(v);
    onInputChange?.(v);
  };

  // se for controlled e o pai setar um valor já com +3 chars, dispara query
  useEffect(() => {
    if (!isControlled) return;
    const v = (controlledInputValue ?? "").trim();
    if (v.length < 3) return;
    setQuery(v);
  }, [isControlled, controlledInputValue]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 3) {
      setOptions([]);
      return;
    }

    const t = setTimeout(async () => {
      try {
        const res = await axios.get(
          "https://api.geoapify.com/v1/geocode/autocomplete",
          {
            params: {
              text: q,
              limit: 8,
              format: "json",
              apiKey: GEOAPIFY_KEY,

              filter: "countrycode:us",
              bias: "countrycode:us",
            },
          }
        );

        const results: AddressOption[] = (res.data?.results ?? []).map((r: any) => {
          const full = String(r.formatted ?? "").trim();

          const city = String(
            r.city ?? r.town ?? r.village ?? r.hamlet ?? r.suburb ?? ""
          ).trim();

          return {
            full,
            street: full, 
            city,
            state: String(r.state ?? "").trim(),
            postcode: String(r.postcode ?? "").trim(),
          };
        });

        setOptions(results);
      } catch (err) {
        console.error("Geoapify error:", err);
        setOptions([]);
      }
    }, 350);

    return () => clearTimeout(t);
  }, [query]);

  return (
    <Autocomplete
      options={options}
      popupIcon={null}
      filterOptions={(x) => x} // API já filtra
      value={value}
      inputValue={shownInputValue}
      isOptionEqualToValue={(a, b) => a.full === b.full}
      getOptionLabel={(opt) => opt.full} // dropdown mostra completo

      onInputChange={(_, v, reason) => {
        setShownInput(v);
        onInput?.(v);

        if (reason === "input") {
          setQuery(v);
          setValue(null); // digitando => nada selecionado
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

        setShownInput(opt.street);

        setQuery(opt.street);

        onInput?.(opt.street);

        onSelect({
          street: opt.street,
          city: opt.city,
          state: opt.state,
          zip: opt.postcode,
        });
      }}

      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          size="small"
          label="Street*"
          placeholder="Start typing to see suggestions"
          sx={sx}
        />
      )}
    />
  );
}
