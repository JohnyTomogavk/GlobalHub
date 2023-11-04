import styled from 'styled-components';

const styledEditorJsWrapper = styled.div`
  font-size: 1rem;

  .ce-delimiter:before {
    content: '';
    display: block;
    height: 1px;
    background: #2c2c2c;
  }

  .ce-block__content,
  .ce-toolbar__content {
    width: 75%;
  }

  .ce-toolbar__actions {
    right: 100%;
  }
`;

export default styledEditorJsWrapper;
