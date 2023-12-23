import useAxios from './useAxios';
import { AxiosResponse } from 'axios';
import { Note } from '../../entities/notes/note';
import { getResourceUrl } from '../../helpers/urlHelper';
import { NOTES_API_SUFFIX } from '../../constants/apiConstants';
import * as apiConstants from '../../constants/apiConstants';
import { NoteMap } from '../../dto/sideMenu/noteMap';
import { CreateNoteDto } from '../../dto/notes/createNoteDto';
import { UpdateNoteContentDto } from '../../dto/notes/updateNoteContentDto';
import { UpdateNoteTitleDto } from '../../dto/notes/updateNoteTitleDto';

interface INotesApi {
  getById: (id: string) => Promise<AxiosResponse<Note>>;
  getNotesList: () => Promise<AxiosResponse<Note[]>>;
  getNotesMap: () => Promise<AxiosResponse<NoteMap[]>>;
  create: (createDto: CreateNoteDto) => Promise<AxiosResponse<Note>>;
  updateContent: (id: string, updateDto: UpdateNoteContentDto) => Promise<AxiosResponse<Note>>;
  updateTitle: (id: string, noteTitleDto: UpdateNoteTitleDto) => Promise<AxiosResponse<Note>>;
  delete: (id: string) => Promise<AxiosResponse<string>>;
}

const useNotesAPI = (): INotesApi => {
  const { httpGet, httpPost, httpPut, httpDelete } = useAxios();

  return {
    getById: (id: string): Promise<AxiosResponse<Note>> => {
      const url = getResourceUrl(NOTES_API_SUFFIX, apiConstants.GET_NOTE_BY_ID);

      return httpGet(url, {
        params: {
          id: id,
        },
      });
    },
    getNotesMap: (): Promise<AxiosResponse<NoteMap[]>> => {
      const url = getResourceUrl(NOTES_API_SUFFIX, apiConstants.GET_NOTES_MAP);

      return httpGet(url);
    },
    getNotesList: (): Promise<AxiosResponse<Note[]>> => {
      const url = getResourceUrl(NOTES_API_SUFFIX, apiConstants.GET_NOTES_LIST);

      return httpGet(url);
    },
    create: (createDto: CreateNoteDto): Promise<AxiosResponse<Note>> => {
      const url = getResourceUrl(NOTES_API_SUFFIX, apiConstants.CREATE_NOTE);

      return httpPost(url, createDto);
    },
    updateContent: (id: string, updateDto: UpdateNoteContentDto): Promise<AxiosResponse<Note>> => {
      const url = getResourceUrl(NOTES_API_SUFFIX, apiConstants.UPDATE_NOTE_CONTENT, id);

      return httpPut(url, updateDto);
    },
    updateTitle: (id: string, noteTitleDto: UpdateNoteTitleDto): Promise<AxiosResponse<Note>> => {
      const url = getResourceUrl(NOTES_API_SUFFIX, apiConstants.UPDATE_NOTE_TITLE, id);

      return httpPut(url, noteTitleDto);
    },
    delete: (id: string): Promise<AxiosResponse<string>> => {
      const url = getResourceUrl(NOTES_API_SUFFIX, apiConstants.DELETE_NOTE);

      return httpDelete(url, {
        params: {
          id: id,
        },
      });
    },
  };
};

export default useNotesAPI;
