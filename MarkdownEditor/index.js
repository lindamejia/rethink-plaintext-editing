import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import ReactHtmlParser from 'react-html-parser';
import marked from 'marked';

const MarkdownPreview = dynamic(() => import('react-markdown'), {
  ssr: false
});

import css from './style.css';

function MarkdownEditor({ file, write }) {
  // console.log(file, write);
  const [initialValue, setInitValue] = useState('');
  const [value, setValue] = useState(initialValue);
  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  useEffect(() => {
    createTextEditor();
  });

  const createTextEditor = async () => {
    editorRef.current = {
      CKEditor: require('@ckeditor/ckeditor5-react'),
      ClassicEditor: require('@ckeditor/ckeditor5-build-classic')
    };
    setInitValue(await file.text());
    setEditorLoaded(await true);
  };

  const handleOnChange = (e, editor) => {
    const data = editor.getData();
    setValue(data);
  };

  function getMarkdownText() {
    var rawMarkup = marked(value.replace(/<[^>]+>/g, ''));
    return { __html: rawMarkup };
  }

  return editorLoaded ? (
    <div className={css.editor}>
      <CKEditor
        editor={ClassicEditor}
        data={initialValue}
        onChange={handleOnChange}
      />

      <MarkdownPreview source={initialValue} escapeHtml={false} />
    </div>
  ) : (
    <div></div>
  );
}

MarkdownEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default MarkdownEditor;
