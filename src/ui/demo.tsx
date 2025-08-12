"use client";

import { Button, Card, CardActions, CardContent, Stack, Typography } from "@mui/material";

export interface DemoProps {
  title: string;
  description?: string;
  ctaLabel?: string;
  disabled?: boolean;
  onAction?: () => void;
}

export function Demo({
    title,
    description,
    ctaLabel = "Action",
    disabled = false,
    onAction,
}: Readonly<DemoProps>) {
  return (
    <Card sx={{ maxWidth: 420 }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
          {description ? (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          ) : null}
        </Stack>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button variant="contained" disabled={disabled} onClick={onAction}>
          {ctaLabel}
        </Button>
      </CardActions>
    </Card>
  );
}


