'use client';
import {
  RiBold,
  RiCodeView,
  RiItalic,
  RiSendPlane2Line,
  RiStrikethrough2,
} from '@remixicon/react';
import './styles.css';
import Code from '@tiptap/extension-code';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useRef } from 'react';
import { IconButton, Input } from '@medusajs/ui';

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

  // console.log('dasdsd', textareaRef?.current?.clientHeight);
  const editor = useEditor({
    autofocus: isEditable ? true : false,
    extensions: [StarterKit, Code],
    content:
      content ??
      `
      <p></p>
    `,
  });

  if (editor && !isEditable) {
    editor.setEditable(false);
  }

  const sendMsg = () => {
    console.log('editor', editor);
    if (editor) {
      console.log('editor.getHTML()', editor.getHTML());
      handelsend && handelsend(editor.getHTML());
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
        className=" h-max max-h-80 min-h-14 overflow-auto px-1.5 pb-3 text-base !font-light  leading-snug focus:outline-none "
        ref={textareaRef}
        contentEditable={false}
      />

      {editor && isEditable && (
        <div className=" flex items-center justify-between border-t border-ui-border-strong pt-1.5">
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
