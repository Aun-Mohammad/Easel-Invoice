"use client";

import dynamic from 'next/dynamic';
import { Box, Typography } from '@mui/material';

// Dynamic import keeps jsPDF/DOM-only code out of the server render.
const EaselInvoiceMaker = dynamic(() => import('@/components/EaselInvoiceMaker'), {
  ssr: false,
  loading: () => (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      flexDirection="column"
    >
      <Typography variant="h6" sx={{ mb: 2, color: '#751624' }}>
        Loading Red Knot Invoice Maker...
      </Typography>
    </Box>
  ),
});

export default function HomePage() {
  return <EaselInvoiceMaker />;
}
