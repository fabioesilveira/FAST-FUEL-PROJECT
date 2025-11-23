import { Box, Typography, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        bottom: 0,
        left: 0,
        backgroundColor: '#e65100',
        color: '#fff3e0',
        py: 2,
        textAlign: 'center',
        zIndex: 1300,

        boxShadow: "0 -3px 10px rgba(0,0,0,0.25)",  // ⭐ Soft neutral shadow above footer
      }}
    >
      <Typography variant="body2">
        {'Copyright © '}
        <Link
          href="https://fastfuel.com/"
          underline="hover"
          sx={{ color: '#fff3e0' }}
        >
          Fast Fuel
        </Link>{' '}
        {new Date().getFullYear()}.
      </Typography>
    </Box>
  );
}
