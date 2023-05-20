import { GetRequest, PostRequest, PutRequest } from './base/apiServiceBase';
import { Note } from '../models/notes/note';
import { AxiosResponse } from 'axios';
import { getResourceUrl } from '../helpers/urlHelper';
import * as api_constants from '../constants/apiConstants';
import { CreateNoteDto } from '../dto/notes/createNoteDto';
import { UpdateNoteContentDto } from '../dto/notes/updateNoteContentDto';
import { UpdateNoteTitleDto } from '../dto/notes/updateNoteTitleDto';

export const getAvailableNotesMap = (): Promise<AxiosResponse<Note[]>> => {
  const resourceUrl = getResourceUrl(api_constants.CREATE_NOTE);

  return GetRequest<Note[], undefined>(resourceUrl);
};

export const getNoteById = (id: string): Promise<AxiosResponse<Note>> => {
  const resourceUrl = getResourceUrl(api_constants.GET_NOTE_BY_ID, id);

  return GetRequest<Note, number>(resourceUrl);
};

export const createNote = (createDto: CreateNoteDto): Promise<AxiosResponse<string>> => {
  const resourceUrl = getResourceUrl(api_constants.CREATE_NOTE);

  return PostRequest<string, CreateNoteDto>(resourceUrl, createDto);
};

export const updateNoteContent = (id: string, body: UpdateNoteContentDto): Promise<AxiosResponse<Note>> => {
  const resourceUrl = getResourceUrl(api_constants.UPDATE_NOTE_CONTENT, id);

  return PutRequest<Note, UpdateNoteContentDto>(resourceUrl, body);
};

export const updateNoteTitle = (id: string, noteTitleDto: UpdateNoteTitleDto): Promise<AxiosResponse<Note>> => {
  const resourceUrl = getResourceUrl(api_constants.UPDATE_NOTE_TITLE, id);

  return PutRequest<Note, UpdateNoteTitleDto>(resourceUrl, noteTitleDto);
};
