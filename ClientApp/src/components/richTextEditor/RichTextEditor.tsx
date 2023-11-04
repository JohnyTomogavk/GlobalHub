import React, { useEffect, useId, useState } from 'react';
import EditorJS, { API, OutputData } from '@editorjs/editorjs';
import { NOTE_DEFAULT_EMPTY_BLOCK } from '../../constants/notesConstants';
import { editorTools } from '../../config/editorJsTools';
import styledEditorJsWrapper from '../../pages/notes/StyledEditorJsWrapper';

interface EditorParameters {
  onChange: (api: API, event: CustomEvent) => void;
  data: OutputData;
}

const ensureBlocksNoteEmpty = (data: OutputData): OutputData => {
  if (data.blocks.length === 0) {
    data.blocks.push(JSON.parse(NOTE_DEFAULT_EMPTY_BLOCK));
  }

  return data;
};

export const RichTextEditor = (props: EditorParameters): JSX.Element => {
  const editorHolderId = useId();
  const [editorInstance, setEditorInstance] = useState<EditorJS | undefined>(undefined);

  useEffect(() => {
    setEditorInstance(() => {
      const editor = new EditorJS({
        holder: editorHolderId,
        autofocus: true,
        placeholder: 'Start typing your note here...',
        tools: editorTools,
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

  return <StyledEditorJsWrapper id={editorHolderId} />;
};
