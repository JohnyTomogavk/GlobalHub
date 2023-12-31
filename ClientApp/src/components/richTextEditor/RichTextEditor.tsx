import React, { useEffect, useId, useRef } from 'react';
import EditorJS, { API, LogLevels, OutputData } from '@editorjs/editorjs';
import { editorTools } from '../../config/editorJsTools';
import { StyledEditorJsWrapper } from './StyledEditorJsWrapper';
import { observer } from 'mobx-react-lite';
import UiConfigStore from '../../store/uiConfigStore';
import { theme } from 'antd';
import { isEqual } from 'lodash';
import { NOTE_DEFAULT_EMPTY_BLOCK } from '../../constants/notesConstants';

interface EditorParameters {
  onChange: (data: OutputData) => Promise<void> | void;
  data: OutputData;
}

export const RichTextEditor = observer((props: EditorParameters): JSX.Element => {
  const { isDarkTheme } = UiConfigStore;
  const editorHolderId = useId();
  const editorRef = useRef<EditorJS | null>(null);

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

  useEffect(() => {
    editorRef.current = new EditorJS({
      holder: editorHolderId,
      tools: editorTools,
      data: props.data,
      logLevel: 'ERROR' as LogLevels,
      onChange: async (api: API): Promise<void> => {
        const data = await api.saver.save();

        await onEditorDataChange(data);
      },
    });

    return () => {
      editorRef.current?.isReady.then(() => {
        editorRef.current?.destroy();
        editorRef.current = null;
      });
    };
  }, []);

  useEffect(() => {
    if (editorRef?.current === null) return;

    editorRef.current.isReady.then(() => {
      editorRef.current?.render(props.data);
    });
  }, [props.data]);

  return (
    <StyledEditorJsWrapper id={editorHolderId} $isDarkTheme={isDarkTheme} $textColor={colorText}>
      <div id={editorHolderId}></div>
    </StyledEditorJsWrapper>
  );
});
