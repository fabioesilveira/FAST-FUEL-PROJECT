import { Stack, TextField } from "@mui/material";

type Props = {
    orderCodeFilter: string;
    onChange: (value: string) => void;
    tfBlueLabelSx: any;
};

export default function LoggedOrdersFilters({
    orderCodeFilter,
    onChange,
    tfBlueLabelSx,
}: Props) {
    return (
        <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.2}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
        >
            <TextField
                size="small"
                label="Search by Order Number"
                value={orderCodeFilter}
                onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
                inputProps={{ maxLength: 6, inputMode: "numeric" }}
                sx={[
                    tfBlueLabelSx,
                    {
                        width: 320,
                    },
                ]}
            />
        </Stack>
    );
}