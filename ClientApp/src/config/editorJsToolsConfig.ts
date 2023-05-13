// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import Table from '@editorjs/table';
import Header from '@editorjs/header';
import Checklist from '@editorjs/checklist';
import NestedList from '@editorjs/nested-list';
import Paragraph from 'editorjs-paragraph-with-alignment';
import ColorPlugin from 'editorjs-text-color-plugin';
import Delimiter from 'codex.editor.delimiter';
import InlineCode from 'codex.editor.inline-code';
import CodeTool from 'codex.editor.code';
import Quote from 'codex.editor.quote';
import Alert from 'editorjs-alert';

export const EditorJsToolsConfig = {
  table: {
    class: Table,
    inlineToolbar: true,
    config: {
      withHeadings: 1,
      rows: 2,
      cols: 3,
    },
  },
  Header: {
    class: Header,
    inlineToolbar: true,
  },
  Checklist: {
    class: Checklist,
    inlineToolbar: true,
  },
  list: {
    class: NestedList,
    inlineToolbar: true,
    config: {
      defaultStyle: 'ordered',
    },
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  },
  Color: {
    class: ColorPlugin,
    config: {
      colorCollections: [
        '#EC7878',
        '#9C27B0',
        '#673AB7',
        '#3F51B5',
        '#0070FF',
        '#03A9F4',
        '#00BCD4',
        '#4CAF50',
        '#8BC34A',
        '#CDDC39',
        '#FFF',
      ],
      defaultColor: '#FF1300',
      type: 'text',
      customPicker: true,
    },
  },
  Marker: {
    class: ColorPlugin,
    config: {
      defaultColor: '#FFBF00',
      type: 'marker',
    },
  },
  Delimiter,
  InlineCode,
  CodeTool,
  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: 'Enter a quote',
      captionPlaceholder: 'Quote author',
    },
  },
  alert: {
    class: Alert,
    inlineToolbar: true,
    config: {
      defaultType: 'primary',
      messagePlaceholder: 'Enter something',
    },
  },
};