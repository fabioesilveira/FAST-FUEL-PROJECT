import { Box, Typography, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#e65100',
        color: '#fff3e0',
        py: 2,
        textAlign: 'center',
        boxShadow: '0 -3px 10px rgba(0,0,0,0.25)',
        zIndex: 1300, // garante que fique acima do conteúdo
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
