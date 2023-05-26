import React, { useEffect, useId, useState } from 'react';
import EditorJS, { API, OutputData } from '@editorjs/editorjs';
import { EditorJsToolsConfig } from '../../config/editorJsToolsConfig';
import { NOTE_DEFAULKT_EMPTY_BLOCK } from '../../constants/notesConstants';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const UndoPlugin = require('editorjs-undo');

interface EditorParameteres {
  onChange: (api: API, event: CustomEvent) => void;
  data: OutputData;
}

const ensureBlocksNoteEmpty = (data: OutputData): OutputData => {
  if (data.blocks.length === 0) {
    data.blocks.push(JSON.parse(NOTE_DEFAULKT_EMPTY_BLOCK));
  }

  return data;
};

export const RichTextEditor = (props: EditorParameteres): JSX.Element => {
  const editorHolderId = useId();
  const [editorInstance, setEditorInstance] = useState<EditorJS | undefined>(undefined);

  useEffect(() => {
    setEditorInstance(() => {
      const editor = new EditorJS({
        holder: editorHolderId,
        placeholder: 'Start typing your note here...',
        tools: EditorJsToolsConfig,
        onReady(): void {
          new UndoPlugin({ editor });
        },
        onChange: props.onChange,
      });

      return editor;
    });

    return () => {
      if (editorInstance !== undefined) {
        editorInstance.destroy();
      }
    };
  }, []);

  useEffect(() => {
    editorInstance?.isReady.then(() => {
      ensureBlocksNoteEmpty(props.data);
      editorInstance?.render(props.data).then();
    });
  }, [props.data]);

  return <div id={editorHolderId}></div>;
};
