export interface Note {
  id: string;
  createdDate: Date;
  updatedDate?: Date;
  title: string;
  richTextContent: string;
}
