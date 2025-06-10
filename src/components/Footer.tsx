
import { Box, Typography, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',                  // ✅ Full width
        position: 'fixed',              // ✅ Fixed at bottom
        bottom: 0,
        left: 0,
        backgroundColor: '#e65100',     // 🔸 Orange background
        color: '#fff3e0',               // 🔸 Light text
        py: 2,
        textAlign: 'center',
        zIndex: 1300,                   // Make sure it stays above other content if needed
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
