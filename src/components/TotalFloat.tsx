import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

type TotalFloatProps = { total: number };

export default function TotalFloat({ total }: TotalFloatProps) {
  const theme = useTheme();

  return (
    <Box sx={{ position: "sticky", top: 16, zIndex: 1200, textAlign: "center", mb: 3 }}>
      <Typography
      className="total-div"
        // sx={{
        //   fontWeight: 350,
        //   fontSize: { xs: "1.6rem", sm: "1.9rem", md: "2.2rem" },
        //   letterSpacing: "0.06em",
        //   color: theme.palette.primary.main,
        //   fontOpticalSizing: "auto",
        //   textShadow: `
        //     0 1px 1px rgba(255,255,255,0.6),
        //     0 4px 10px rgba(180,180,190,0.55),
        //     0 10px 22px rgba(160,160,170,0.35)
        //   `,
        // }}
      >
        TOTAL R$ {total.toFixed(2)}
      </Typography>
    </Box>
  );
}
