import { Button, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import * as ResourceConstants from '../../constants/resourceConstants';
import ReactTimeAgo from 'react-time-ago';
import { Key } from 'antd/lib/table/interface';
import { getClientItemUrl } from '../../helpers/urlHelper';
import { deleteNote, getNotesList } from '../../api/noteService';
import { Link } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import { Note } from '../../models/notes/note';
import SideMenuStore from '../../store/sideMenu/sideMenuNoteStore';

interface NoteTableItem {
  id: string;
  title: JSX.Element;
  updatedDate: Date;
  createdDate: Date;
}

export const NoteList = (): JSX.Element => {
  const [notes, setNotes] = useState<NoteTableItem[]>([]);
  const { removeNoteFromSideMenu } = SideMenuStore;

  const columns: ColumnsType<NoteTableItem> = [
    {
      title: 'Note title',
      dataIndex: 'title',
      align: 'left',
      ellipsis: true,
    },
    {
      title: 'Updated date',
      dataIndex: 'updatedDate',
      align: 'center',
      width: '10%',
      render: (updatedAt: Date) => <ReactTimeAgo date={new Date(updatedAt)} timeStyle={'round-minute'} locale={'en'} />,
    },
    {
      title: 'Created date',
      align: 'center',
      dataIndex: 'createdDate',
      width: '15%',
      render: (item: Date) => item.toLocaleString(),
    },
    {
      title: '',
      align: 'center',
      width: '5%',
      render: (_, item: NoteTableItem) => (
        <Button
          onClick={async (): Promise<void> => {
            const deletedIdResponse = await deleteNote(item.id);
            setNotes((prev) => {
              prev = prev.filter((note) => note.id !== item.id);

              return prev;
            });
            removeNoteFromSideMenu(deletedIdResponse.data);
          }}
          danger
          icon={<DeleteOutlined />}
        />
      ),
    },
  ];

  const fetchNoteList = async (): Promise<void> => {
    const notesResponse = await getNotesList();

    const noteTableItems = notesResponse.data.map(
      (item: Note) =>
        ({
          id: item.id,
          title: <Link to={`/${getClientItemUrl(ResourceConstants.NOTE_RESOURCE_NAME, item.id)}`}>{item.title}</Link>,
          updatedDate: new Date(item.updatedDate ?? item.createdDate),
          createdDate: new Date(item.createdDate),
        } as NoteTableItem)
    );

    setNotes(noteTableItems);
  };

  useEffect(() => {
    fetchNoteList();
  }, []);

  return (
    <Table
      size={'small'}
      columns={columns}
      dataSource={notes}
      rowKey={(item: NoteTableItem): Key => item.id}
      pagination={false}
      bordered
    />
  );
};
