import React, { useEffect, useMemo, useRef, useState } from 'react';
import { API, OutputData } from '@editorjs/editorjs';
import { debounce } from 'lodash';
import { ItemInfoSubHeader } from '../../components/itemInfoHeader/ItemInfoHeader';
import styles from './notes.module.scss';
import { useParams } from 'react-router-dom';
import { getNoteById, updateNoteContent, updateNoteTitle } from '../../api/noteService';
import { Note } from '../../models/notes/note';
import { AxiosResponse } from 'axios';
import { NOTE_DEFAULT_CONTENT, NOTE_TITLE_PLACEHOLDER } from '../../constants/notesConstants';
import Title from 'antd/es/typography/Title';
import { RichTextEditor } from '../../components/richTextEditor/RichTextEditor';

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
  const [isLoading, setLoading] = useState<boolean>(false);

  const [note, setNote] = useState<Note | undefined>(undefined);
  const noteRef = useRef(note);

  const onEditorContentChange = (api: API): void => {
    api.saver.save().then((data: OutputData) => {
      if (noteRef.current === undefined) return;
      setLoading(true);
      updateNoteContent(noteRef.current.id, {
        content: JSON.stringify(data),
      })
        .then((updatedNoteResponse: AxiosResponse<Note>): void => {
          setNote(updatedNoteResponse.data);
        })
        .finally(() => setLoading(false));
    });
  };

  const onNoteTitleUpdate = (changedTitle: string): void => {
    if (note === undefined) return;

    const newTitle = changedTitle.length !== 0 ? changedTitle : NOTE_TITLE_PLACEHOLDER;

    setNote({
      ...note,
      title: newTitle,
    });

    setLoading(true);
    updateNoteTitle(note.id, {
      newTitle: newTitle,
    })
      .then((noteUpdateResponse: AxiosResponse<Note>): void => {
        setNote(noteUpdateResponse.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const debouncedOnChange = debounce(onEditorContentChange, editorOnChangeDebounce);

  useEffect((): void => {
    if (id === undefined) return;

    getNoteById(id).then(({ data }) => {
      setNote(data);
      noteRef.current = data;
    });
  }, [id]);

  return (
    <>
      <ItemInfoSubHeader
        breadCrumpsItems={breadCrumbsItems}
        itemTitle={note?.title}
        setNoteTitle={onNoteTitleUpdate}
        lastEdited={note?.updatedDate ?? note?.createdDate}
        isLoading={isLoading}
      />
      <div className={styles.pageContent}>
        <div className={styles.noteTitleContainer}>
          <Title
            editable={{
              triggerType: ['text'],
              text: note?.title,
              onChange: (changedTitle: string) => onNoteTitleUpdate(changedTitle),
            }}
            level={2}
            className={styles.noteTitle}
            inputMode={'text'}
          >
            {note?.title}
          </Title>
        </div>
        {useMemo(
          () => (
            <RichTextEditor
              data={JSON.parse(note?.richTextContent ?? NOTE_DEFAULT_CONTENT)}
              onChange={debouncedOnChange}
            />
          ),
          [note?.id]
        )}
      </div>
    </>
  );
};
