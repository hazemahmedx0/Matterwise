'use client';
import { RiCloseCircleFill } from '@remixicon/react';
import React, { useEffect, useState } from 'react';

interface Chip {
  key: string;
  email: string;
  valid?: boolean;
}
const Chips = () => {
  const [chips, setChips] = useState<Chip[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmedValue = inputValue.trim();
      if (trimmedValue) {
        const isValidEmail = /\S+@\S+\.\S+/.test(trimmedValue);
        const key = trimmedValue.split('@')[0];
        const isEmailExist = chips.some((chip) => chip.email === trimmedValue);

        if (!isEmailExist) {
          const newChip: Chip = {
            key,
            email: trimmedValue,
            valid: isValidEmail,
          };
          setChips([...chips, newChip]);
        }
        setInputValue('');
      }
    }
  };

  const deleteChip = ({ removedChip }: { removedChip: Chip }) => {
    if (!removedChip) {
      return;
    }
    const chipsx = chips.filter((chip) => chip.key !== removedChip.key);
    setChips(chipsx);
    console.log('inside func', chipsx);
    return true;
  };

  return (
    <div className=" txt-compact-small relative flex w-full appearance-none flex-wrap gap-2 rounded-md bg-ui-bg-field px-2 py-1.5 text-ui-fg-base placeholder-ui-fg-muted caret-ui-fg-base shadow-borders-base outline-none transition-fg invalid:!shadow-borders-error hover:bg-ui-bg-field-hover focus-visible:shadow-borders-interactive-with-active disabled:cursor-not-allowed disabled:!bg-ui-bg-disabled disabled:text-ui-fg-disabled disabled:placeholder-ui-fg-disabled aria-[invalid=true]:!shadow-borders-error [&::--webkit-search-cancel-button]:hidden [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden">
      <ChipsList
        chipsList={chips}
        onChipClick={(event, chip) => {
          event.stopPropagation();
          deleteChip({ removedChip: chip });
        }}
      />
      <input
        type="text"
        placeholder="Enter email"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className=" h-8 border-none bg-transparent text-ui-fg-base placeholder-ui-fg-muted outline-none"
      />
    </div>
  );
};

export default Chips;

interface ChipsListProps {
  chipsList: Chip[];
  onChipClick: (event: React.MouseEvent<HTMLButtonElement>, chip: Chip) => void;
}

export const ChipsList: React.FC<ChipsListProps> = ({
  chipsList,
  onChipClick,
}) => {
  return (
    <>
      {chipsList.map((chip) => (
        <span
          key={chip.key}
          className={`  flex gap-1.5 rounded-md border px-2 py-1 text-ui-fg-on-color ${chip.valid ? 'bg-ui-bg-switch-off' : 'border border-dotted border-ui-border-error bg-ui-tag-red-bg'} `}
        >
          <span className="chip-value">{chip.email}</span>
          <button
            type="button"
            className="chip-delete-button"
            onClick={(e) => onChipClick(e, chip)}
          >
            <RiCloseCircleFill
              size={15}
              className={` text-ui-fg-muted hover:text-ui-fg-base `}
            />
          </button>
        </span>
      ))}
    </>
  );
};
