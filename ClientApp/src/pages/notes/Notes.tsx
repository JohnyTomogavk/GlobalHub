import React, { useEffect, useMemo, useRef, useState } from 'react';
import { OutputData } from '@editorjs/editorjs';
import { ItemInfoSubHeader } from '../../components/itemInfoHeader/ItemInfoHeader';
import styles from './notes.module.scss';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { deleteNote, getNoteById, updateNoteContent, updateNoteTitle } from '../../api/noteService';
import { Note } from '../../entities/notes/note';
import { NOTE_DEFAULT_CONTENT, NOTE_EMPTY_TITLE_PLACEHOLDER } from '../../constants/notesConstants';
import Title from 'antd/es/typography/Title';
import { RichTextEditor } from '../../components/richTextEditor/RichTextEditor';
import * as RoutingConstants from '../../constants/routingConstants';
import { observer } from 'mobx-react-lite';
import { Spin, theme } from 'antd';
import SideMenuIndexStore from '../../store/sideMenu/sideMenuIndexStore';
import useBreadcrumbs from '../../hooks/useBreadcrumbs';
import { LoadingOutlined } from '@ant-design/icons';

export const NotesComponent = observer((): JSX.Element => {
  const { notesStore, commonSideMenuStore, sideMenuItems } = SideMenuIndexStore;

  const { id } = useParams();
  const location = useLocation();

  const [isLoading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const breadCrumbsItems = useBreadcrumbs(location.pathname, sideMenuItems);

  const [note, setNote] = useState<Note | undefined>(undefined);
  const [isEditorLoading, setIsEditorLoading] = useState<boolean>(true);
  const noteRef = useRef(note);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onEditorContentChange = async (data: OutputData): Promise<void> => {
    if (!noteRef.current) return;

    setLoading(true);
    const updateNoteResponse = await updateNoteContent(noteRef.current.id, {
      content: JSON.stringify(data),
    });

    setNote(updateNoteResponse.data);

    setLoading(false);
  };

  const onTitleUpdate = async (changedTitle: string): Promise<void> => {
    if (!id) return;

    const newTitle = changedTitle.length !== 0 ? changedTitle : NOTE_EMPTY_TITLE_PLACEHOLDER;

    if (note?.title === newTitle) return;

    setLoading(true);
    const { data } = await updateNoteTitle(id, { newTitle: newTitle });
    setNote(data);
    notesStore.renameNoteInSideMenu(data.id, data.title);
    setLoading(false);
  };

  const onItemDelete = async (): Promise<void> => {
    if (!id) return;

    const deletedNoteIdResponse = await deleteNote(id);
    notesStore.removeNoteFromSideMenu(deletedNoteIdResponse.data);
    commonSideMenuStore.changeSelectedMenuKey([RoutingConstants.NOTE_LIST_ROUTE]);
    navigate(`/${RoutingConstants.NOTE_LIST_ROUTE}`);
  };

  const loadNote = async (): Promise<void> => {
    if (!id) return;

    const noteResponse = await getNoteById(id);
    setNote(noteResponse.data);
    noteRef.current = noteResponse.data;
  };

  useEffect((): void => {
    loadNote();
  }, [id]);

  const onRichTextEditorEditorReadyHandler = (): void => {
    setIsEditorLoading(false);
  };

  return (
    <div
      style={{
        background: colorBgContainer,
      }}
    >
      <ItemInfoSubHeader
        onDeleteCallback={onItemDelete}
        breadCrumbsItems={breadCrumbsItems}
        editedAt={note?.updatedDate}
        createdAt={note?.createdDate ?? new Date()}
        isLoading={isLoading}
      />
      {isEditorLoading ? <Spin className={styles.editorLoader} indicator={<LoadingOutlined spin />} /> : <></>}
      <div
        style={{
          visibility: isEditorLoading ? 'hidden' : 'visible',
        }}
        className={styles.pageContent}
      >
        <div className={styles.noteTitleContainer}>
          <Title
            editable={{
              triggerType: ['text'],
              text: note?.title,
              onChange: (changedTitle: string) => onTitleUpdate(changedTitle),
            }}
            level={2}
            className={styles.noteTitle}
            inputMode={'text'}
          >
            {note?.title}
          </Title>
        </div>
        {useMemo(
          () =>
            note && (
              <RichTextEditor
                data={JSON.parse(note.richTextContent)}
                onChange={onEditorContentChange}
                onEditorReadyHandler={onRichTextEditorEditorReadyHandler}
              />
            ),
          [note?.id]
        )}
      </div>
    </div>
  );
});
