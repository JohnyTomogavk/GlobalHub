import React, { useEffect, useId, useRef } from 'react';
import { OutputData } from '@editorjs/editorjs';
import { editorTools } from '../../config/editorJsTools';
import { StyledEditorJsWrapper } from './StyledEditorJsWrapper';
import { observer } from 'mobx-react-lite';
import UiConfigStore from '../../store/uiConfigStore';
import { theme } from 'antd';
import { isEqual } from 'lodash';
import Editor from '@stfy/react-editor.js';

interface EditorParameters {
  onChange: (data: OutputData) => Promise<void>;
  data: OutputData;
  onEditorReadyHandler: () => void;
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

  const onEditorReady = (): void => {
    props.onEditorReadyHandler();
  };

  const {
    token: { colorText },
  } = theme.useToken();

  const onEditorDataChange = async (data: OutputData): Promise<void> => {
    if (isEqual(data.blocks, props.data.blocks)) return;
    await props.onChange(data);
  };

  return (
    <StyledEditorJsWrapper id={editorHolderId} $isDarkTheme={isDarkTheme} $textColor={colorText}>
      <Editor
        ref={editorRef}
        data={props.data}
        reinitOnPropsChange={false}
        tools={editorTools}
        onReady={onEditorReady}
        onData={onEditorDataChange}
      />
    </StyledEditorJsWrapper>
  );
});
