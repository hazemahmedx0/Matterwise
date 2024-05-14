'use client';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useState, useEffect } from 'react';

interface NavigationContextProps {
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  elements: NodeListOf<Element> | null;
}

export const NavigationContext = createContext<
  NavigationContextProps | undefined
>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [elements, setElements] = useState<NodeListOf<Element> | null>(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setElements(
        document.querySelectorAll(
          '.a11y-1-workspace-button, .a11y-2-workspace-button, .a11y-3-workspace-button , .x1 , .x2 ',
        ),
      );
    });
    observer.observe(document, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.ctrlKey && event.key === 'ArrowRight') {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % elements.length;
          (elements[nextIndex] as HTMLElement).focus();
          console.log('nextIndex', nextIndex);
          console.log('prev', prevIndex, 'next', nextIndex);

          return nextIndex;
        });
      } else if (event.metaKey && event.ctrlKey && event.key === 'ArrowLeft') {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex - 1 + elements.length) % elements.length;
          (elements[nextIndex] as HTMLElement).focus();
          console.log('prev', prevIndex, 'next', nextIndex);
          return nextIndex;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [elements]);

  return (
    <NavigationContext.Provider
      value={{ currentIndex, setCurrentIndex, elements }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
