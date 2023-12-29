import React, { useEffect, useId, useRef } from 'react';
import { OutputData } from '@editorjs/editorjs';
import { editorTools } from '../../config/editorJsTools';
import { StyledEditorJsWrapper } from './StyledEditorJsWrapper';
import { observer } from 'mobx-react-lite';
import UiConfigStore from '../../store/uiConfigStore';
import { theme } from 'antd';
import { isEqual } from 'lodash';
import Editor from '@stfy/react-editor.js';
import { NOTE_DEFAULT_EMPTY_BLOCK } from '../../constants/notesConstants';

interface EditorParameters {
  onChange: (data: OutputData) => Promise<void> | void;
  data: OutputData;
}

export const RichTextEditor = observer((props: EditorParameters): JSX.Element => {
  const { isDarkTheme } = UiConfigStore;
  const editorHolderId = useId();
  const editorRef = useRef<Editor>(null);

  useEffect(() => {
    if (!editorRef.current?.editor) return;

    editorRef.current.editor.isReady.then(() => {
      editorRef.current?.editor.render(props.data);
    });
  }, [props.data]);

  const {
    token: { colorText },
  } = theme.useToken();

  const onEditorDataChange = async (data: OutputData): Promise<void> => {
    if (isEqual(data.blocks, props.data.blocks)) return;

    const dataToUpdate = {
      ...data,
      blocks: data.blocks.length === 0 ? [JSON.parse(NOTE_DEFAULT_EMPTY_BLOCK)] : data.blocks,
    } as OutputData;

    await props.onChange(dataToUpdate);
  };

  return (
    <StyledEditorJsWrapper id={editorHolderId} $isDarkTheme={isDarkTheme} $textColor={colorText}>
      <Editor ref={editorRef} reinitOnPropsChange={false} tools={editorTools} onData={onEditorDataChange} />
    </StyledEditorJsWrapper>
  );
});
