import { Box, Typography, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        backgroundColor: '#e65100',
        color: '#fff3e0',
        py: 2,
        textAlign: 'center',
        boxShadow: '0 -3px 10px rgba(0,0,0,0.25)',
        marginTop: -1
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

