import type { Meta, StoryObj } from "@storybook/react";
import MuiThemeProvider from "@/ui/mui-theme-provider";
import { Demo, type DemoProps } from "@/ui/demo";

const meta = {
  title: "UI/Demo",
  component: Demo,
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
    layout: "centered",
  },
  argTypes: {
    onAction: { action: "clicked" },
  },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    title: "Hello Storybook",
    description: "If you can see this card and click the button below, Storybook is working!",
    ctaLabel: "Click me",
  } satisfies DemoProps,
};

export const Disabled: Story = {
  args: {
    title: "Disabled state",
    description: "Demonstrates the disabled button state.",
    ctaLabel: "Can’t click",
    disabled: true,
  } satisfies DemoProps,
};


