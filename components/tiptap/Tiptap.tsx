'use client';
import {
  RiBold,
  RiCodeView,
  RiItalic,
  RiSendPlane2Line,
  RiStrikethrough2,
} from '@remixicon/react';
import './styles.css';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect, useMemo, useRef } from 'react';
import { IconButton } from '@medusajs/ui';

export default ({
  handelsend,
  isEditable = true,
  content,
}: {
  handelsend?: (content: any) => void;
  isEditable?: boolean;
  content?: string;
}) => {
  const textareaRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    autofocus: 'end',
    extensions: [StarterKit],
    content:
      content ??
      `
      <p></p>
    `,
  });

  // if (editor && !isEditable) {
  //   editor.setEditable(false);
  // }
  useEffect(() => {
    const handleFocus = () => {
      if (editor) {
        editor.commands.focus();
      }
    };
    handleFocus();
    const elements = document.querySelectorAll('.a11y-3-workspace-button');
    elements.forEach((element) => {
      element.addEventListener('focus', () => {
        handleFocus();
        console.log('focus');
      });
    });

    return () => {
      elements.forEach((element) => {
        element.removeEventListener('focus', handleFocus);
      });
    };
  }, [editor]);

  const sendMsg = () => {
    if (editor) {
      handelsend && handelsend(editor.getHTML());
      editor.commands.clearContent();
    }
  };

  return (
    <>
      {editor && isEditable && (
        <div
          className={`bubble-menu ${textareaRef?.current?.scrollTop ?? 0 > 0 ? ' border-b border-ui-border-strong' : ''}`}
        >
          <IconButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'is-active' : ''}
            variant="transparent"
            size="small"
          >
            <RiBold size={18} />
          </IconButton>

          <IconButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'is-active' : ''}
            variant="transparent"
            size="small"
          >
            <RiItalic size={18} />
          </IconButton>

          <IconButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'is-active' : ''}
            variant="transparent"
            size="small"
          >
            <RiStrikethrough2 size={18} />
          </IconButton>

          <IconButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={editor.isActive('code') ? 'is-active' : ''}
            variant="transparent"
            size="small"
          >
            <RiCodeView size={18} />
          </IconButton>
          {/* <IconButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive('codeBlock') ? 'is-active' : ''}
            variant="transparent"
            size="small"
          >
            <RiCodeBlock size={18} />
          </IconButton> */}
        </div>
      )}

      <EditorContent
        editor={editor}
        id="style-1"
        placeholder="Start typing..."
        tabIndex={0}
        className="  a11y-3-workspace-button h-max max-h-80 min-h-14 overflow-auto px-1.5 pb-3 text-base  !font-light leading-snug focus:outline-none"
        ref={textareaRef}
        autoFocus={true}
        contentEditable={false}
      />

      {editor && isEditable && (
        <div className=" flex items-center justify-between border-t border-ui-border-strong pt-1.5 ">
          <div>
            {/* <IconButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive('bold') ? 'is-active' : ''}
              variant="transparent"
              size="small"
            >
              <RiBold size={18} />
            </IconButton> */}
          </div>
          <IconButton
            size="small"
            disabled={!editor.getText()}
            onClick={sendMsg}
          >
            <RiSendPlane2Line size={18} />
          </IconButton>
        </div>
      )}
    </>
  );
};
