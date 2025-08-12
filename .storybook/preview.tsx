import MuiThemeProvider from '@/ui/mui-theme-provider';
import type { Preview } from '@storybook/react';
import React from 'react';

const preview: Preview = {
  decorators: [
    (Story) => (
      <MuiThemeProvider>
        <div style={{ padding: 16 }}>
          <Story />
        </div>
      </MuiThemeProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
  },
};

export default preview;
