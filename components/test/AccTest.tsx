'use client';
import { Fragment } from 'react';
import { useFocusManager } from 'react-aria';
import { FocusScope } from 'react-aria';

export default function AccessibleGroup({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  return (
    <div role="main">
      <FocusScope contain restoreFocus>
        {children}
      </FocusScope>
    </div>
  );
}

import { KeyboardEvent } from 'react';
import { useArrowKeyFocus } from '@/lib/actions/useOnKeyDown';

// export function useArrowKeyFocus() {
//   const focusManager = useFocusManager();

//   const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
//     switch (event.key) {
//       case 'ArrowRight':
//         focusManager.focusNext({ wrap: true });
//         console.log('focusManager', focusManager);
//         break;
//       case 'ArrowLeft':
//         focusManager.focusPrevious({ wrap: true });
//         console.log('focusManager', focusManager);
//         break;
//     }
//   };

//   return handleKeyDown;
// }

export function Div(props: { children: React.ReactNode; [key: string]: any }) {
  let { children, ...otherProps } = props;
  const onKeyDown = useArrowKeyFocus();

  return (
    <div
      className="focus-visible:shadow-buttons-neutral-focus"
      onKeyDown={onKeyDown}
      {...otherProps}
    >
      {children}
    </div>
  );
}
