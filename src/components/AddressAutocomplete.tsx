import { useEffect, useState } from "react";
import axios from "axios";
import { Autocomplete, TextField } from "@mui/material";

type AddressOption = {
  label: string;
  street?: string;
  city?: string;
  state?: string;
  postcode?: string;
};

type Props = {
  onSelect: (addr: { street: string; city: string; state: string; zip: string }) => void;
  onInput?: (value: string) => void; 
  sx?: any;
};

const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_KEY as string;

export default function AddressAutocomplete({ onSelect, onInput, sx }: Props) {
  const [input, setInput] = useState("");
  const [options, setOptions] = useState<AddressOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // limpa lista quando apagar tudo (X ou backspace até vazio)
    if (input.trim() === "") {
      setOptions([]);
      setLoading(false);
      return;
    }

    // só busca com 2+ chars
    if (input.trim().length < 2) {
      setOptions([]);
      setLoading(false);
      return;
    }

    // debounce nativo
    const id = window.setTimeout(async () => {
      try {
        setLoading(true);

        const res = await axios.get("https://api.geoapify.com/v1/geocode/autocomplete", {
          params: {
            text: input,
            limit: 5,
            format: "json",
            apiKey: GEOAPIFY_KEY,
          },
        });

        if (cancelled) return;

        const results: AddressOption[] = (res.data?.results ?? []).map((r: any) => ({
          label: r.formatted,
          street: r.address_line1 || "",
          city: r.city || "",
          state: r.state || "",
          postcode: r.postcode || "",
        }));

        setOptions(results);
      } catch {
        if (!cancelled) setOptions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 350); 

    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [input]);

  return (
    <Autocomplete
      sx={{ width: "100%" }}
      freeSolo
      loading={loading}
      options={options}
      filterOptions={(x) => x} 
      getOptionLabel={(o) => (typeof o === "string" ? o : o.label)}
      onInputChange={(_, v) => {
        setInput(v);
        onInput?.(v);
      }}
      onChange={(_, value) => {
        if (!value || typeof value === "string") return;

        onSelect({
          street: value.street || "",
          city: value.city || "",
          state: value.state || "",
          zip: value.postcode || "",
        });
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          size="small"
          label="Street"
          placeholder="Start typing an address"
          sx={sx}
        />
      )}
    />
  );
}
