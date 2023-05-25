import type { Meta, StoryObj } from '@storybook/react';

import { GameOverScreen } from '@/components/GameOverScreen';

const meta: Meta<typeof GameOverScreen> = {
  component: GameOverScreen,
};

export default meta;
type Story = StoryObj<typeof GameOverScreen>;

export const HighScore: Story = {
  args: {
    finalScore: 23,
    newHighScore: true,
    onPlayAgain: () => {
      console.log('onPlayAgain');
    },
  },
};