import React, { useState, useEffect, useRef } from 'react';
import { CopyBlock, dracula } from 'react-code-blocks';

function CodeEditor({ file }) {
  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};
  const [value, setValue] = useState('');

  useEffect(() => {
    createTextEditor();
  },[file]);

  const createTextEditor = async () => {
    editorRef.current = {
      CKEditor: require('@ckeditor/ckeditor5-react'),
      ClassicEditor: require('@ckeditor/ckeditor5-build-classic')
    };
    setValue(await file.text());
    setEditorLoaded(await true);
  };

  function handleChange(data) {
    console.log(data);
  }

  return editorLoaded ? (
    <div>
      <CKEditor
        editor={ClassicEditor}
        data={value}
        onChange={(event, editor) => console.log({ event, editor })}
      />

      <CopyBlock
        text={value}
        language="javascript"
        showLineNumbers={true}
        theme={dracula}
      />
    </div>
  ) : (
    <div></div>
  );
}

export default CodeEditor;
