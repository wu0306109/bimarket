'use client';

import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';

interface AddProductButtonProps {
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'inherit' | 'primary' | 'secondary';
}

export function AddProductButton({ 
  variant = 'contained', 
  color = 'primary' 
}: AddProductButtonProps) {
  const router = useRouter();
  
  const handleClick = () => {
    router.push('/wish-product');
  };
  
  // 如果是在導覽列中（color='inherit'），使用更簡潔的樣式
  const isInAppBar = color === 'inherit';
  
  return (
    <Button 
      variant={isInAppBar ? 'outlined' : variant}
      color={color}
      onClick={handleClick}
      startIcon={<AddIcon />}
      size={isInAppBar ? 'medium' : 'large'}
      sx={isInAppBar ? {
        borderColor: 'rgba(255, 255, 255, 0.5)',
        color: 'white',
        '&:hover': {
          borderColor: 'white',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
      } : {
        borderRadius: 2,
        px: 3,
        py: 1.5,
        boxShadow: 2,
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      新增許願
    </Button>
  );
}