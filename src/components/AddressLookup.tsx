import { useEffect, useState } from "react";
import axios from "axios";
import { Autocomplete, TextField } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

type AddressResult = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

type AddressOption = {
  id: string;
  full: string;      // dropdown
  street: string;    // input
  city: string;
  state: string;
  postcode: string;
  country: string;
};

type AddressLookupProps = {
  sx?: SxProps<Theme>;

  inputValue?: string;
  onInputChange?: (value: string) => void;

  onInput?: (value: string) => void;
  onSelect: (addr: AddressResult) => void;

  requireZip5?: boolean;
};

const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_KEY as string;

const isZip5 = (v: string) => /^\d{5}$/.test((v || "").trim());

export default function AddressLookup({
  onSelect,
  onInput,
  sx,
  inputValue: controlledInputValue,
  onInputChange,
  requireZip5 = false,
}: AddressLookupProps) {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<AddressOption[]>([]);
  const [value, setValue] = useState<AddressOption | null>(null);

  const [internalInput, setInternalInput] = useState("");

  const isControlled = controlledInputValue !== undefined;
  const shownInputValue = isControlled ? controlledInputValue : internalInput;

  const setShownInput = (v: string) => {
    if (!isControlled) setInternalInput(v);
    onInputChange?.(v);
  };

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

            const city = String(
              r.city ?? r.town ?? r.village ?? r.hamlet ?? r.suburb ?? ""
            ).trim();

            const postcode = String(r.postcode ?? "").trim();

            const street = String(r.address_line1 ?? "").trim() || full;

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
          .filter((o: AddressOption) => (requireZip5 ? isZip5(o.postcode) : true));

        setOptions(results);
      } catch (err) {
        console.error("Geoapify error:", err);
        setOptions([]);
      }
    }, 350);

    return () => clearTimeout(t);
  }, [query, requireZip5]);

  return (
    <Autocomplete<AddressOption, false, false, false>
      options={options}
      popupIcon={null}
      filterOptions={(x) => x}
      value={value}
      inputValue={shownInputValue}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      getOptionLabel={(opt) => opt.full}
      onInputChange={(_, v, reason) => {
        setShownInput(v);
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
          placeholder="Start typing and select an address"
          sx={sx}
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password",
            autoCorrect: "off",
            autoCapitalize: "off",
            spellCheck: false,
            name: "ff-address-search",
            inputMode: "text",
          }}
          FormHelperTextProps={{ sx: { textAlign: "center" } }}
        />
      )}
    />
  );

}
