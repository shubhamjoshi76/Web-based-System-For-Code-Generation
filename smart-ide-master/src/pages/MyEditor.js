import React, { useEffect, useState, useRef } from "react";
import * as monaco from "monaco-editor";

const files = {
  "index.html": {
    name: "index.html",
    language: "html",
    value: `<h1 align="center">
  Hello World !
<h1>
`,
  },
  "style.css": {
    name: "style.css",
    language: "css",
    value: `h1{
  color: gold;
}
`,
  },
  "script.js": {
    name: "script.js",
    language: "javascript",
    value: `document.body.bgColor="black";`,
  },
};

const Editors = ({ socketRef, roomId, onCodeChange }) => {
  const [fileName, setFileName] = useState("index.html"); // change to "index.html"
  const editorRef = useRef(null);
  const file = files[fileName];
  const [user, setUser] = useState(true);

  function validate(code) {
    const str = code;
    if (code.includes("#")) {
      const lines = str.split("\n");
      let result = null;
      for (let line of lines) {
        if (line.startsWith("#")) {
          result = line.substring(2).trim();
          break;
        }
      }
      code.replace("#" + result, "");
    }
    return code;
  }

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = monaco.editor.create(document.getElementById("editor"), {
        value: file.value,
        language: file.language,
        theme: "myDarculaTheme",
      });
      editorRef.current.onDidChangeModelContent(() => {
        onCodeChange(fileName, editorRef.current.getValue(), user);
      });
    } else {
      const model = monaco.editor.createModel(file.value, file.language);
      editorRef.current.setModel(model);
    }
    // Clean up on unmount
    return () => {
      editorRef.current.dispose();
    };
  }, [fileName]);

  function handleFileClick(name) {
    setFileName(name);
  }
function handleEditorDidMount(editor, monaco) {
    monaco.editor.defineTheme('myDarculaTheme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', foreground: 'f8f8f2', background: '282a36' },
        { token: 'invalid', foreground: 'ff5555' },
        { token: 'emphasis', fontStyle: 'italic' },
        { token: 'strong', fontStyle: 'bold' },
        { token: 'variable', foreground: '50fa7b' },
        { token: 'variable.predefined', foreground: '50fa7b' },
        { token: 'constant', foreground: 'bd93f9' },
        { token: 'comment', foreground: '6272a4' },
        { token: 'number', foreground: 'bd93f9' },
        { token: 'number.hex', foreground: 'bd93f9' },
        { token: 'regexp', foreground: 'f1fa8c' },
        { token: 'annotation', foreground: 'f1fa8c' },
        { token: 'type', foreground: 'bd93f9' },
        { token: 'delimiter', foreground: 'f8f8f2' },
        { token: 'delimiter.html', foreground: 'f8f8f2' },
        { token: 'delimiter.xml', foreground: 'f8f8f2' },
        { token: 'tag', foreground: 'ffb86c' },
        { token: 'tag.id.pug', foreground: 'f1fa8c' },
        { token: 'tag.class.pug', foreground: 'f1fa8c' },
        { token: 'meta.scss', foreground: 'f8f8f2' },
        { token: 'metatag', foreground: 'f8f8f2' },
        { token: 'metatag.content.html', foreground: 'f8f8f2' },
        { token: 'metatag.html', foreground: 'f8f8f2' },
        { token: 'metatag.xml', foreground: 'f8f8f2' },
        { token: 'metatag.php', fontStyle: 'bold' },
        { token: 'key', foreground: 'ff79c6' },
        { token: 'string.key.json', foreground: '50fa7b' },
        { token: 'string.value.json', foreground: 'f8f8f2' },
        { token: 'attribute.name', foreground: '50fa7b' },
        { token: 'attribute.value', foreground: 'f1fa8c' },
        { token: 'attribute.value.number', foreground: 'bd93f9' },
        { token: 'attribute.value.unit', foreground: 'bd93f9' },
        { token: 'attribute.value.html', foreground: 'bd93f9' },
        { token: 'attribute.value.xml', foreground: 'bd93f9' },
        { token: 'string', foreground: 'f1fa8c' },
        { token: 'string.html', foreground: 'f1fa8c' },
        { token: 'string.sql', foreground: 'f8f8f2' },
        { token: 'string.yaml', foreground: 'f8f8f2' },
        { token: 'keyword', foreground: 'ff79c6' },
        { token: 'keyword.json', foreground: 'f8f8f2' },
        { token: 'keyword.flow', foreground: 'BD93F9' },
        { token: 'keyword.flow.scss', foreground: 'BD93F9' },
        { token: 'operator.scss', foreground: 'F8F8F2' },
        { token: 'operator.sql', foreground: 'F8F8F2' },
        { token: 'operator.swift', foreground: 'F8F8F2' },
        { token: 'predefined.sql', foreground: '50FA7B' },
      ],
      colors: {
        'editor.background': '#282A36',
        'editor.foreground': '#F8F8F2',
        'editor.lineHighlightBackground': '#44475A55',
        'editor.selectionBackground': '#44475A55',
        'editor.selectionHighlightBackground': '#44475A55',
        'editorCursor.foreground': '#F8F8F0',
        'editorSuggestWidget.highlightForeground': '#50FA7B'
      }

    });
    editorRef.current = editor;
    monaco.editor.setTheme('myDarculaTheme');

    //onCodeChange(`<style>` + files["style.css"].value + `</style>` + files["index.html"].value + `<scr` + `ipt>` + files["script.js"].value + `</scr` + `ipt>`);
    onCodeChange(validate(editorRef.current.getValue()));
  }
  return (
      <div id="editor" style={{ height: "100%" }}></div>
  );
};

export default Editors;
