import { DeleteRequest, GetRequest, PostRequest, PutRequest } from './base/apiServiceBase';
import { Note } from '../models/notes/note';
import { AxiosResponse } from 'axios';
import { getResourceUrl } from '../helpers/urlHelper';
import * as apiConstants from '../constants/apiConstants';
import { CreateNoteDto } from '../dto/notes/createNoteDto';
import { UpdateNoteContentDto } from '../dto/notes/updateNoteContentDto';
import { UpdateNoteTitleDto } from '../dto/notes/updateNoteTitleDto';
import { NOTES_API_BASE } from '../constants/apiConstants';
import { NoteMap } from '../dto/sideMenu/noteMap';

export const getNoteById = async (id: string): Promise<AxiosResponse<Note>> => {
  const resourceUrl = getResourceUrl(NOTES_API_BASE, apiConstants.GET_NOTE_BY_ID);

  return GetRequest<Note>(resourceUrl, {
    id: id,
  });
};

export const getNotesMap = async (): Promise<AxiosResponse<NoteMap[]>> => {
  const resourceUrl = getResourceUrl(NOTES_API_BASE, apiConstants.GET_NOTES_MAP);

  return GetRequest<NoteMap[]>(resourceUrl);
};

export const getNotesList = async (): Promise<AxiosResponse<Note[]>> => {
  const resourceUrl = getResourceUrl(NOTES_API_BASE, apiConstants.GET_NOTES_LIST);

  return GetRequest<Note[]>(resourceUrl);
};

export const createNote = async (createDto: CreateNoteDto): Promise<AxiosResponse<Note>> => {
  const resourceUrl = getResourceUrl(NOTES_API_BASE, apiConstants.CREATE_NOTE);

  return PostRequest<CreateNoteDto, Note>(resourceUrl, createDto);
};

export const updateNoteContent = async (id: string, body: UpdateNoteContentDto): Promise<AxiosResponse<Note>> => {
  const resourceUrl = getResourceUrl(NOTES_API_BASE, apiConstants.UPDATE_NOTE_CONTENT, id);

  return PutRequest<UpdateNoteContentDto, Note>(resourceUrl, body);
};

export const updateNoteTitle = async (id: string, noteTitleDto: UpdateNoteTitleDto): Promise<AxiosResponse<Note>> => {
  const resourceUrl = getResourceUrl(NOTES_API_BASE, apiConstants.UPDATE_NOTE_TITLE, id);

  return PutRequest<UpdateNoteTitleDto, Note>(resourceUrl, noteTitleDto);
};

export const deleteNote = async (id: string): Promise<AxiosResponse<string>> => {
  const resourceUrl = getResourceUrl(NOTES_API_BASE, apiConstants.DELETE_NOTE, id);

  return DeleteRequest<string, string>(resourceUrl, id);
};
