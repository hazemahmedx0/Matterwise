import React from 'react';
import { mainSections } from '@/constants/NavBarSections';
import { Text } from '@medusajs/ui';
import { useRouter } from 'next/navigation';

const SideNavMainSections = () => {
  const router = useRouter();

  return (
    <ul className=" mt-3 text-ui-fg-subtle">
      {mainSections.map((section) => (
        <li
          aria-level={2}
          aria-setsize={-1}
          aria-posinset={1}
          tabIndex={0}
          role="treeitem"
          data-qa="virtual-list-item"
          key={section.title}
          className="nav-list-item flex h-7 cursor-pointer items-center px-5 focus-visible:shadow-buttons-neutral-focus"
          onClick={() => router.push(section.href)}
        >
          <section.icon size={16} />
          <Text leading="compact" size="small" className="ml-1.5  truncate">
            {section.title}
          </Text>
        </li>
      ))}
    </ul>
  );
};

export default SideNavMainSections;
