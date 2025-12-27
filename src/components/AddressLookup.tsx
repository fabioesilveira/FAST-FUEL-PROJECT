// src/components/AddressLookup.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Autocomplete, TextField } from "@mui/material";

type AddressOption = {
  full: string;      // dropdown (endereço completo)
  street: string;    // input (SÓ street)
  city: string;
  state: string;
  postcode: string;
};

type Props = {
  onSelect: (addr: { street: string; city: string; state: string; zip: string }) => void;
  onInput?: (value: string) => void; // dispara quando digita/limpa (pra você limpar os campos no Checkout)
  sx?: any;
};

const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_KEY;

export default function AddressLookup({ onSelect, onInput, sx }: Props) {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<AddressOption[]>([]);
  const [inputValue, setInputValue] = useState(""); // texto dentro do input
  const [value, setValue] = useState<AddressOption | null>(null); // opção selecionada

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
            limit: 5,
            format: "json",
            apiKey: GEOAPIFY_KEY,
          },
        });

        const results: AddressOption[] = (res.data?.results ?? []).map((r: any) => {
          const full = String(r.formatted ?? "").trim();

          // Preferência: address_line1 (geralmente: "1536 S Flower St")
          const apiStreet = String(r.address_line1 ?? "").trim();

          // Fallback: pega só antes da primeira vírgula do formatted
          const streetFromFull = full.split(",")[0]?.trim() ?? "";

          // ✅ GARANTE que street nunca venha com cidade/estado (corta antes da vírgula)
          const street = (apiStreet || streetFromFull).split(",")[0].trim();

          return {
            full,
            street,
            city: String(r.city ?? "").trim(),
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
      popupIcon={null} // ✅ remove setinha
      filterOptions={(x) => x} // ✅ API já filtra
      value={value}
      inputValue={inputValue}
      isOptionEqualToValue={(a, b) => a.full === b.full}
      getOptionLabel={(opt) => opt.full} // dropdown mostra endereço completo

      onInputChange={(_, v, reason) => {
        setInputValue(v);
        onInput?.(v);

        if (reason === "input") {
          setQuery(v);
          setValue(null); // digitando = não tem selecionado
        }

        // quando clica no X (clear) ou apaga tudo
        if (reason === "clear" || v === "") {
          setQuery("");
          setOptions([]);
          setValue(null);
        }
      }}

      onChange={(_, opt) => {
        setValue(opt);

        if (!opt) return;

        // ✅ input mostra só street
        setInputValue(opt.street);
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
