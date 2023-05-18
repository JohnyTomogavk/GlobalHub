import React, { useEffect, useId, useState } from 'react';
import EditorJS, { API, OutputData } from '@editorjs/editorjs';
import { debounce } from 'lodash';
import { ItemInfoSubHeader } from '../../components/itemInfoHeader/ItemInfoHeader';
import styles from './notes.module.scss';
import { EditorJsToolsConfig } from '../../config/editorJsToolsConfig';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const UndoPlugin = require('editorjs-undo');

const editorOnChangeDebounce = 2500;

export const NotesComponent = (): JSX.Element => {
  const id = useId();
  const [isLoading, setLoading] = useState<boolean>(false);

  const editorOnChange = (api: API, event: CustomEvent): void => {
    api.saver.save().then((data: OutputData) => {
      console.log(data);

      // TODO: Just for test
      setLoading(true);
      setTimeout(() => setLoading(false), 500);
    });
  };

  const debouncedOnChange = debounce(editorOnChange, editorOnChangeDebounce);

  useEffect(() => {
    const editor = new EditorJS({
      holder: id,
      placeholder: 'Start typing your note here...',
      tools: EditorJsToolsConfig,
      onReady(): void {
        new UndoPlugin({ editor });
      },
      onChange: debouncedOnChange,
      // data:
    });
  }, []);

  return (
    <>
      <ItemInfoSubHeader isLoading={isLoading} />
      <div className={styles.content} id={id}></div>
    </>
  );
};
