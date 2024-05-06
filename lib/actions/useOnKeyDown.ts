import { KeyboardEvent } from 'react';
import { useFocusManager } from 'react-aria';

export function useArrowKeyFocus() {
  const focusManager = useFocusManager();

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!focusManager) {
      console.error('FocusManager is not available.');
      return;
    }

    switch (event.key) {
      case 'ArrowRight':
        focusManager.focusNext({ wrap: true });
        break;
      case 'ArrowLeft':
        focusManager.focusPrevious({ wrap: true });
        break;
    }
  };

  return handleKeyDown;
}
