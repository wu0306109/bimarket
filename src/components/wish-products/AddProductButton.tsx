'use client';

import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';

export function AddProductButton() {
  const router = useRouter();
  
  const handleClick = () => {
    router.push('/wish-product');
  };
  
  return (
    <Button 
      variant="contained" 
      onClick={handleClick}
      startIcon={<AddIcon />}
      size="large"
      sx={{
        borderRadius: 2,
        px: 3,
        py: 1.5,
        boxShadow: 2,
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      新增許願商品
    </Button>
  );
}