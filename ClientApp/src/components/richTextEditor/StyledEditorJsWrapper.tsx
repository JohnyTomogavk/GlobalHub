import styled from 'styled-components';

interface StyledEditorJsProps {
  isDarkTheme: boolean;
  textColor: string;
}

const getIconColor = (isDarkTheme: boolean): string => (isDarkTheme ? 'white' : 'black');

export const StyledEditorJsWrapper = styled.div<StyledEditorJsProps>`
  font-size: 1rem;

  .ce-block--selected .ce-block__content,
  .codex-editor ::selection {
    background-color: ${(props): string => (props.isDarkTheme ? '#1a2735' : '#e1f2ff')};
  }

  .ce-delimiter:before {
    content: '';
    display: block;
    height: 1px;
    background: #2c2c2c;
    width: 100%;
  }

  .ce-block__content,
  .ce-toolbar__content {
    width: 75%;
  }

  .ce-toolbar__actions {
    right: 100%;
    background: transparent;
  }

  .ce-toolbar__settings-btn,
  .ce-toolbar__plus {
    color: ${(props): string => props.textColor};
    background: transparent;

    :hover {
      background: rgba(38, 38, 38, ${(props): string => (props.isDarkTheme ? '0.78' : '0.1')});
    }
  }

  .ce-paragraph,
  .ce-header,
  .tc-cell,
  .cdx-nested-list,
  .embed-tool__caption,
  .ce-popover-item__title,
  .tc-popover__item-label {
    color: ${(props): string => props.textColor};
  }

  .toggle-block__selector,
  .toggle-block__icon,
  .cdx-checklist {
    color: ${(props): string => props.textColor} !important;
  }

  .tc-wrap {
    ${(props): string | false =>
      props.isDarkTheme && '--color-border: #2c2c2c; --color-background: rgba(44, 44, 44, 0.3);'}
  }

  .ce-popover,
  .tc-popover {
    ${(props): string | false =>
      props.isDarkTheme &&
      '--color-border: #2c2c2c;' +
        '--color-background: #252525;' +
        '--color-background-hover: rgba(49,49,49,255);' +
        '--color-background-item-hover: rgba(49,49,49,255);'}
  }

  .cdx-search-field,
  .cdx-search-field__input {
    color: ${(props): string => props.textColor};
    ${(props): string | false => props.isDarkTheme && 'background: #313131; border: 1px solid #2c2c2c;'}
  }

  .ce-popover-item__icon,
  .tc-popover__item-icon {
    color: ${(props): string => props.textColor};
    background: transparent;
  }

  .tc-toolbox {
    ${(props): string | false =>
      props.isDarkTheme &&
      `--toggler-dots-color: ${props.textColor}; --toggler-dots-color-hovered: ${props.textColor};`}
  }

  .tc-toolbox__toggler svg rect {
    fill: transparent;
  }

  .cdx-warning::before {
    background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='5' y='5' width='14' height='14' rx='4' stroke='${(
      props
    ): string =>
      getIconColor(props.isDarkTheme)}' stroke-width='2'/%3E%3Cline x1='12' y1='9' x2='12' y2='12' stroke='${(
      props
    ): string =>
      getIconColor(
        props.isDarkTheme
      )}' stroke-width='2' stroke-linecap='round'/%3E%3Cpath d='M12 15.02V15.01' stroke='${(props): string =>
      getIconColor(props.isDarkTheme)}' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
  }

  .cdx-checklist__item:not(.cdx-checklist__item--checked) .cdx-checklist__item-checkbox-check {
    background: transparent;
    border-color: #2c2c2c;
  }

  .cdx-input,
  .rxpm-code__selector {
    border-color: #2c2c2c;
    color: ${(props): string => props.textColor};
    ${(props): string | false => props.isDarkTheme && 'background: #272727'}
  }
`;
