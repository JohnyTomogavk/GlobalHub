import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { OutputData } from '@editorjs/editorjs';
import { ItemInfoSubHeader } from '../../components/itemInfoHeader/ItemInfoHeader';
import styles from './notes.module.scss';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Note } from '../../entities/notes/note';
import { NOTE_EMPTY_TITLE_PLACEHOLDER, NOTE_UPDATE_DEBOUNCE } from '../../constants/notesConstants';
import { RichTextEditor } from '../../components/richTextEditor/RichTextEditor';
import * as RoutingConstants from '../../constants/routingConstants';
import { observer } from 'mobx-react-lite';
import { Input, theme } from 'antd';
import SideMenuIndexStore from '../../store/sideMenu/sideMenuIndexStore';
import useBreadcrumbs from '../../hooks/useBreadcrumbs';
import useNotesAPI from '../../hooks/api/useNotesApi';
import { Loader } from '../../components/loader/Loader';
import debounce from 'lodash/debounce';
import edjsHTML from 'editorjs-html';

export const NotesComponent = observer((): JSX.Element => {
  const { notesStore, commonSideMenuStore, sideMenuItems } = SideMenuIndexStore;

  const { id } = useParams();
  const location = useLocation();

  const [isFetching, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const breadCrumbsItems = useBreadcrumbs(location.pathname, sideMenuItems);

  const [note, setNote] = useState<Note | undefined>(undefined);
  const [isEditorLoading, setIsEditorLoading] = useState<boolean>(true);
  const noteRef = useRef(note);
  const notesApi = useNotesAPI();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const getHtmlContentFromEditorJsOutput = (data: OutputData): string => {
    const edjsParser = edjsHTML();
    let htmlContent = edjsParser.parse(data);
    const content = htmlContent.filter(t => !t.toString().startsWith("Error"))

    return content.toString();
  }

  const onNoteContentChange = async (data: OutputData): Promise<void> => {
    if (!note) return;

    setLoading(true);

    const { data: updatedNote } = await notesApi.updateContent(note.id, {
      content: JSON.stringify(data),
      htmlContent: getHtmlContentFromEditorJsOutput(data)
    });

    if (noteRef.current?.id === note.id) {
      setNote(
        (prevState) =>
          prevState && {
            ...prevState,
            updatedDate: updatedNote.updatedDate,
          }
      );
    }

    setLoading(false);
  };

  const updateTitleDebounced = useCallback(
    debounce(async (noteId: string, changedTitle: string): Promise<void> => {
      if (!note) return;

      setLoading(true);

      const { data: updatedNote } = await notesApi.updateTitle(noteId, { newTitle: changedTitle });

      if (noteRef && noteRef.current?.id === note.id) {
        setNote(
          (prevState) =>
            prevState && {
              ...prevState,
              updatedDate: updatedNote.updatedDate,
            }
        );
      }

      notesStore.renameNoteInSideMenu(noteId, changedTitle);
      setLoading(false);
    }, NOTE_UPDATE_DEBOUNCE),
    [note?.id]
  );

  const onTitleUpdate = async (changedTitle: string): Promise<void> => {
    if (!id) return;

    setNote(
      (prevState) =>
        prevState && {
          ...prevState,
          title: changedTitle,
        }
    );

    if (note?.title === changedTitle) return;

    await updateTitleDebounced(id, changedTitle);
  };

  const onItemDelete = async (): Promise<void> => {
    if (!id) return;

    const deletedNoteIdResponse = await notesApi.delete(id);
    notesStore.removeNoteFromSideMenu(deletedNoteIdResponse.data);
    commonSideMenuStore.changeSelectedMenuKey([RoutingConstants.NOTE_LIST_ROUTE]);
    navigate(`/${RoutingConstants.NOTE_LIST_ROUTE}`);
  };

  const loadNote = async (): Promise<void> => {
    if (!id) return;

    const { data: noteData } = await notesApi.getById(id);
    noteRef.current = noteData;
    setNote(noteData);
  };

  useEffect(() => {
    loadNote().then(() => {
      setIsEditorLoading(false);
    });

    return () => {
      updateTitleDebounced.flush();
      setIsEditorLoading(true);
    };
  }, [id]);

  return (
    <div
      style={{
        background: colorBgContainer,
      }}
    >
      {isEditorLoading || !note ? (
        <div className={styles.editorLoader}>
          <Loader />
        </div>
      ) : (
        <ItemInfoSubHeader
          onDeleteCallback={onItemDelete}
          breadCrumbsItems={breadCrumbsItems}
          editedAt={new Date(note?.updatedDate ?? note.createdDate)}
          createdAt={new Date(note.createdDate)}
          isLoading={isFetching}
        />
      )}
      <div
        style={{
          display: isEditorLoading ? 'none' : 'block',
        }}
        className={styles.pageContent}
      >
        <div className={styles.noteTitleContainer}>
          <Input
            value={note?.title}
            placeholder={NOTE_EMPTY_TITLE_PLACEHOLDER}
            className={styles.noteTitle}
            onChange={(e) => onTitleUpdate(e.target.value)}
            variant={'borderless'}
          />
        </div>
        {useMemo(
          () =>
            note && (
              <RichTextEditor key={note.id} data={JSON.parse(note.richTextContent)} onChange={onNoteContentChange} />
            ),
          [note?.id]
        )}
      </div>
    </div>
  );
});
