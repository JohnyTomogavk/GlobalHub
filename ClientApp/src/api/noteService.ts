import { DeleteRequest, GetRequest, PostRequest, PutRequest } from './base/apiServiceBase';
import { Note } from '../models/notes/note';
import { AxiosResponse } from 'axios';
import { getResourceUrl } from '../helpers/urlHelper';
import * as apiConstants from '../constants/apiConstants';
import { CreateNoteDto } from '../dto/notes/createNoteDto';
import { UpdateNoteContentDto } from '../dto/notes/updateNoteContentDto';
import { UpdateNoteTitleDto } from '../dto/notes/updateNoteTitleDto';
import { AvailableNotesDto } from '../dto/notes/sideMenu/availableNotesDto';

export const getNotesMap = async (): Promise<AxiosResponse<AvailableNotesDto>> => {
  const resourceUrl = getResourceUrl(apiConstants.GET_NOTES_MAP);

  return GetRequest<AvailableNotesDto, undefined>(resourceUrl);
};

export const getNoteById = async (id: string): Promise<AxiosResponse<Note>> => {
  const resourceUrl = getResourceUrl(apiConstants.GET_NOTE_BY_ID, id);

  return GetRequest<Note, string>(resourceUrl);
};

export const createNote = async (createDto: CreateNoteDto): Promise<AxiosResponse<Note>> => {
  const resourceUrl = getResourceUrl(apiConstants.CREATE_NOTE);

  return PostRequest<Note, CreateNoteDto>(resourceUrl, createDto);
};

export const updateNoteContent = async (id: string, body: UpdateNoteContentDto): Promise<AxiosResponse<Note>> => {
  const resourceUrl = getResourceUrl(apiConstants.UPDATE_NOTE_CONTENT, id);

  return PutRequest<Note, UpdateNoteContentDto>(resourceUrl, body);
};

export const updateNoteTitle = async (id: string, noteTitleDto: UpdateNoteTitleDto): Promise<AxiosResponse<Note>> => {
  const resourceUrl = getResourceUrl(apiConstants.UPDATE_NOTE_TITLE, id);

  return PutRequest<Note, UpdateNoteTitleDto>(resourceUrl, noteTitleDto);
};

export const deleteNote = async (id: string): Promise<AxiosResponse<string>> => {
  const resourceUrl = getResourceUrl(apiConstants.DELETE_NOTE, id);

  return DeleteRequest<string, string>(resourceUrl, id);
};
