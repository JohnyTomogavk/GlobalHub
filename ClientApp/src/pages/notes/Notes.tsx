import React from 'react';
import EditorJS from '@editorjs/editorjs';
import { EditorJsToolsConfig } from '../../config/editorJsToolsConfig';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Undo = require('editorjs-undo');

export const NotesComponent = (): JSX.Element => {
  const editor = new EditorJS({
    holder: 'editorHolder',
    placeholder: 'Start typing your note here...',
    tools: EditorJsToolsConfig,
    defaultBlock: 'Header',
    onReady(): void {
      new Undo({ editor });
    },
  });

  return <div id="editorHolder"></div>;
};
