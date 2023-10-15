// eslint-disable-next-line
// @ts-nocheck
import Table from '@editorjs/table';
import Header from '@editorjs/header';
import Checklist from '@editorjs/checklist';
import NestedList from '@editorjs/nested-list';
import ColorPlugin from 'editorjs-text-color-plugin';
import Delimiter from 'codex.editor.delimiter';
import InlineCode from 'codex.editor.inline-code';
import CodeTool from 'codex.editor.code';
import Alert from 'editorjs-alert';
import AlignmentTuneTool from 'editorjs-text-alignment-blocktune';

export const editorJsTools = {
  table: {
    class: Table,
    inlineToolbar: true,
    config: {
      rows: 2,
      cols: 3,
    },
  },
  Header: {
    class: Header,
    inlineToolbar: true,
    tunes: ['anyTuneAlignment'],
  },
  Checklist: {
    class: Checklist,
    inlineToolbar: true,
    tunes: ['anyTuneAlignment'],
  },
  list: {
    class: NestedList,
    inlineToolbar: true,
    config: {
      defaultStyle: 'ordered',
    },
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
  Delimiter: {
    class: Delimiter,
  },
  InlineCode: {
    class: InlineCode,
  },
  CodeTool: {
    class: CodeTool,
  },
  alert: {
    class: Alert,
    inlineToolbar: true,
    config: {
      defaultType: 'primary',
      messagePlaceholder: 'Enter something',
    },
  },
  anyTuneAlignment: {
    class: AlignmentTuneTool,
    config: {
      default: 'left',
      blocks: {
        header: 'center',
        list: 'right',
      },
    },
  },
};
