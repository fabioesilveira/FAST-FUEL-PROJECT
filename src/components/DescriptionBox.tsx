import * as React from "react";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import { Box, Typography } from "@mui/material";


type DescriptionBoxProps = {
    text: string;
    // controla linhas do preview no modo fechado
    previewLines?: number;
    // largura de leitura 
    maxWidth?: number;
};

export function DescriptionBox({
    text,
    previewLines = 2,
    maxWidth = 230,
}: DescriptionBoxProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Box
            sx={{
                width: "100%",
                backgroundColor: "#ffe0c7",
                borderRadius: "10px",
                border: "1px solid rgba(230,81,0,0.18)",
                boxShadow: 2,

                px: 2,
                py: 1.6,

                minHeight: open ? "auto" : 132,

                display: "flex",
                flexDirection: "column",
                gap: 1.2,
            }}
        >
            {/* TOGGLE */}
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Typography
                    onClick={() => setOpen((v) => !v)}
                    sx={{
                        fontSize: "0.78rem",
                        fontWeight: 900,
                        letterSpacing: "0.05em",

                        cursor: "pointer",
                        userSelect: "none",
                    }}
                >
                    DETAILS
                </Typography>

                <IconButton
                    onClick={() => setOpen((v) => !v)}
                    size="small"
                    sx={{
                        width: { xs: 27.5, sm: 30 },
                        height: { xs: 27.5, sm: 30 },
                        borderRadius: 2,
                        border: "1px solid rgba(230,81,0,0.18)",
                        bgcolor: "rgba(255,255,255,0.55)",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.7)" },
                    }}
                >
                    {open ? (
                        <KeyboardArrowUpRoundedIcon sx={{ color: "#e65100" }} />
                    ) : (
                        <KeyboardArrowDownRoundedIcon sx={{ color: "#e65100" }} />
                    )}
                </IconButton>
            </Box>

            {/* TEXT */}
            <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <Typography
                    sx={{
                        width: "100%",
                        maxWidth,
                        mx: "auto",
                        textAlign: "left",

                        fontSize: "0.92rem",
                        fontWeight: 400,
                        lineHeight: 1.55,
                        letterSpacing: "0.01em",
                        color: "rgba(20,20,20,0.88)",

                        hyphens: "none",
                        wordBreak: "normal",
                        overflowWrap: "break-word",
                    }}
                >
                    {/* fechado */}
                    {!open ? (
                        <Box
                            component="span"
                            sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: previewLines,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            }}
                        >
                            {text}
                        </Box>
                    ) : null}

                    {/* aberto */}
                    <Collapse in={open} timeout={220}>
                        <Box component="span">{text}</Box>
                    </Collapse>
                </Typography>
            </Box>
        </Box>
    );
}


