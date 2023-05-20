import React, { useEffect, useId, useState } from 'react';
import EditorJS, { API, OutputData } from '@editorjs/editorjs';
import { debounce } from 'lodash';
import { ItemInfoSubHeader } from '../../components/itemInfoHeader/ItemInfoHeader';
import styles from './notes.module.scss';
import { EditorJsToolsConfig } from '../../config/editorJsToolsConfig';
import { useParams } from 'react-router-dom';
import { getNoteById, updateNoteContent, updateNoteTitle } from '../../api/noteService';
import { Note } from '../../models/notes/note';
import { AxiosResponse } from 'axios';
import { NOTE_TITLE_PLACEHOLDER } from '../../constants/notesConstants';
import Title from 'antd/es/typography/Title';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const UndoPlugin = require('editorjs-undo');

const breadCrumbsItems = [
  {
    title: 'Budgets',
  },
  {
    title: <a href="">My Own Budget</a>,
  },
  {
    title: <a href="">Inner budget</a>,
  },
];

const editorOnChangeDebounce = 2500;

export const NotesComponent = (): JSX.Element => {
  const { id } = useParams();
  const editorHolderId = useId();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [editorInstance, setEditorInstance] = useState<EditorJS | undefined>(undefined);

  const [note, setNote] = useState<Note | undefined>(undefined);
  const [noteTitle, setNoteTitle] = useState<string | undefined>(undefined);

  const onEditorContentChange = (api: API, event: CustomEvent): void => {
    api.saver.save().then((data: OutputData) => {
      setLoading(true);

      if (note === undefined) return;

      updateNoteContent(note.id, {
        content: JSON.stringify(data),
      })
        .then((updatedNoteResponse: AxiosResponse<Note>): void => {
          setNote(updatedNoteResponse.data);
        })
        .finally(() => setLoading(false));
    });
  };

  const onNoteTitleUpdate = (newTitle: string): void => {
    if (note === undefined) return;

    const getNewTitle = newTitle.length !== 0 ? newTitle : NOTE_TITLE_PLACEHOLDER;

    setNoteTitle(getNewTitle);

    setLoading(true);
    updateNoteTitle(note.id, {
      newTitle: getNewTitle,
    })
      .then((noteUpdateResponse: AxiosResponse<Note>): void => {
        setNote(noteUpdateResponse.data);
        setNoteTitle(noteUpdateResponse.data.title);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const debouncedOnChange = debounce(onEditorContentChange, editorOnChangeDebounce);

  useEffect((): void => {
    if (id === undefined) return;

    getNoteById(id).then((item: AxiosResponse<Note>): void => {
      setNote(item.data);
      setNoteTitle(item.data.title);
    });
  }, [id]);

  useEffect((): void => {
    if (editorInstance === undefined && note !== undefined) {
      const editor = new EditorJS({
        holder: editorHolderId,
        placeholder: 'Start typing your note here...',
        tools: EditorJsToolsConfig,
        onReady(): void {
          new UndoPlugin({ editor });
        },
        onChange: debouncedOnChange,
        data: JSON.parse(note.richTextContent),
      });

      setEditorInstance(editor);
    }
  }, [note]);

  return (
    <>
      <ItemInfoSubHeader
        breadCrumpsItems={breadCrumbsItems}
        itemTitle={noteTitle}
        setNoteTitle={onNoteTitleUpdate}
        lastEdited={note?.updatedDate ?? note?.createdDate}
        isLoading={isLoading}
      />
      <div className={styles.pageContent}>
        <div className={styles.noteTitleContainer}>
          <Title
            editable={{
              triggerType: ['text'],
              text: noteTitle,
              onChange: (changedTitle: string) => onNoteTitleUpdate(changedTitle),
            }}
            level={2}
            className={styles.noteTitle}
            inputMode={'text'}
          >
            {noteTitle}
          </Title>
        </div>
        <div id={editorHolderId}></div>
      </div>
    </>
  );
};
