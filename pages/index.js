import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import path from 'path';
import classNames from 'classnames';
import { listFiles } from '../files';

// Used below, these need to be registered
import MarkdownEditor from '../MarkdownEditor';
import PlaintextEditor from '../components/PlaintextEditor';
import CodeEditor from '../CodePreview';

import IconPlaintextSVG from '../public/icon-plaintext.svg';
import IconMarkdownSVG from '../public/icon-markdown.svg';
import IconJavaScriptSVG from '../public/icon-javascript.svg';
import IconJSONSVG from '../public/icon-json.svg';

import css from './style.module.css';

import { Form } from 'react-bootstrap';

const TYPE_TO_ICON = {
  'text/plain': IconPlaintextSVG,
  'text/markdown': IconMarkdownSVG,
  'text/javascript': IconJavaScriptSVG,
  'application/json': IconJSONSVG
};

function FilesTable({ files, activeFile, setActiveFile }) {
  return (
    <div className={css.files}>
      <table>
        <thead>
          <tr>
            <th>File</th>
            <th>Modified</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => (
            <tr
              key={file.name}
              className={classNames(
                css.row,
                activeFile && activeFile.name === file.name ? css.active : ''
              )}
              onClick={() => setActiveFile(file)}
            >
              <td className={css.file}>
                <div
                  className={css.icon}
                  dangerouslySetInnerHTML={{
                    __html: TYPE_TO_ICON[file.type]
                  }}
                ></div>
                {path.basename(file.name)}
              </td>

              <td>
                {new Date(file.lastModified).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

FilesTable.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object),
  activeFile: PropTypes.object,
  setActiveFile: PropTypes.func
};

function Previewer({ file }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    (async () => {
      setValue(await file.text());
    })();
  }, [file]);

  return (
    <div className={css.preview}>
      <div className={css.title}>{path.basename(file.name)}</div>
      <div className={css.content}>{value}</div>
    </div>
  );
}

Previewer.propTypes = {
  file: PropTypes.object
};

// Uncomment keys to register editors for media types
const REGISTERED_EDITORS = {
  'text/plain': PlaintextEditor,
  'text/markdown': MarkdownEditor,
  'text/javascript': CodeEditor,
  'application/json': CodeEditor
};

function PlaintextFilesChallenge() {
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);

  useEffect(() => {
    const files = listFiles();
    setFiles(files);
  }, []);

  const write = (file, value) => {
    console.log(files);
    console.log('Writing soon... ', file.name);
    // TODO: Write the file to the `files` array
    for (var i in files) {
      if (files[i].name == file.name) {
        files[i]['newText'] = value;
        console.log(files);
        break;
      }
    }
    window.localStorage.setItem(file.name, value);
  };

  const Editor = activeFile ? REGISTERED_EDITORS[activeFile.type] : null;

  //2. You have over a million rows of data. You need to display this data on a web page along with a search field. Update search results with each character entered by the user. Make sure to call out any assumptions and / or limitations in your solution.
  //Limitations:
  //Ideally you would do this by sending a backend request passing query params.
  //You would want to add pagination when displaying.
  //For this specific function, I am not validating how the user is entering the information, such as, whether its lowercase or not.
  //IE does not support .includes()
  //.filter() is also iterating over each element of the array which could take a very long time if there a million rows of data and it returns another array which takes up storage
  //.includes() happens to work for this specific exmaple but in other scenerios .some() should be used based on types
  function handleSearch(value) {
    console.log(files);
    const filtered = files.filter(file => {
      return file.name.includes(value);
    });
    console.log(filtered);
  }  

  return (
    <div className={css.page}>
      <Head>
        <title>Rethink Engineering Challenge</title>
      </Head>
      <aside>
        <header>
          <div className={css.tagline}>Rethink Engineering Challenge</div>
          <h1>Seasoning Plaintext</h1>
          <div className={css.description}>
            Let{"'"}s have fun with files and JavaScript. What could be more fun
            than rendering and editing plaintext? Not much, as it turns out.
          </div>
        </header>

        <input
          type="text"
          placeholder="Search by Keyword- Search Results in Console"
          onChange={event => handleSearch(event.target.value)}
        />

        <FilesTable
          files={files}
          activeFile={activeFile}
          setActiveFile={setActiveFile}
        />

        <div style={{ flex: 1 }}></div>

        <footer>
          <div className={css.link}>
            <a href="https://v3.rethink.software/jobs">Rethink Software</a>
            &nbsp;—&nbsp;Frontend Engineering Challenge
          </div>
          <div className={css.link}>
            Questions? Feedback? Email us at jobs@rethink.software
          </div>
        </footer>
      </aside>

      <main className={css.editorWindow}>
        {activeFile && (
          <>
            {Editor && (
              <>
                {/* <Previewer file={activeFile} /> */}
                <Editor file={activeFile} write={write} />
              </>
            )}
            {!Editor && <Previewer file={activeFile} />}
          </>
        )}

        {!activeFile && (
          <div className={css.empty}>Select a file to view or edit</div>
        )}
      </main>
    </div>
  );
}

export default PlaintextFilesChallenge;
