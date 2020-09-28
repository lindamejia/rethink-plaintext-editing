import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import css from './style.css';

//Using ReactHtmlParser Library to parse html value returned from CKEditor
import ReactHtmlParser from 'react-html-parser';

function PlaintextEditor({ file, write }) {
  // console.log(write(file, value));
  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};
  const [initialValue, setInitValue] = useState(initialValue);
  const [value, setValue] = useState(
    localStorage.getItem(file.name) || initialValue
  );

  useEffect(() => {
    createTextEditor();
    localStorage.setItem(file.name, value);
  });

  //Using CKEditor Library for Text Editor
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
    write(file, value);
  };

  return editorLoaded ? (
    <div className={css.editor}>
      <div>
        <CKEditor
          editor={ClassicEditor}
          data={initialValue}
          onChange={handleOnChange}
        />
      </div>
      {initialValue === value ? (
        <div>{initialValue}</div>
      ) : (
        <div>{ReactHtmlParser(value)}</div>
      )}
    </div>
  ) : (
    <div>Loading Editor</div>
  );
}

PlaintextEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default PlaintextEditor;
