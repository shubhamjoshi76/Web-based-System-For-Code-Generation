import React, { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import ACTIONS from "../Actions";
import axios from "axios";
import { useSpeechSynthesis, useSpeechRecognition } from 'react-speech-kit';

const files = {
  "index.html": {
    name: "index.html",
    language: "html",
    value: `<h1 align="center">
  Hello World !
</h1>
`,
  },
  "style.css": {
    name: "style.css",
    language: "html",
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
  const [line, setLine] = useState(0); // change to "index.html"
  const [word, setWord] = useState(0); // change to "index.html"
  const editorRef = useRef(null);
  const file = files[fileName];
  const [user, setUser] = useState(true);
  const [input, setInput] = useState("");
  const [isInput, setIsInput] = useState("");
  const [response, setResponse] = useState("s");
  const [isLoading, setIsLoading] = useState(false);
  const { speak, voices } = useSpeechSynthesis();
  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
      setInput(result);
    },
  });

  function validate(code) {
    if (code.includes("#")) {
      const lines = code.split("\n");
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

  function handleEditorDidMount(editor, monaco) {
    monaco.editor.defineTheme("myDraculaTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "", foreground: "f8f8f2", background: "282a36" },
        { token: "invalid", foreground: "ff5555" },
        { token: "emphasis", fontStyle: "italic" },
        { token: "strong", fontStyle: "bold" },
        { token: "variable", foreground: "50fa7b" },
        { token: "variable.predefined", foreground: "50fa7b" },
        { token: "constant", foreground: "bd93f9" },
        { token: "comment", foreground: "6272a4" },
        { token: "number", foreground: "bd93f9" },
        { token: "number.hex", foreground: "bd93f9" },
        { token: "regexp", foreground: "f1fa8c" },
        { token: "annotation", foreground: "f1fa8c" },
        { token: "type", foreground: "bd93f9" },
        { token: "delimiter", foreground: "f8f8f2" },
        { token: "delimiter.html", foreground: "f8f8f2" },
        { token: "delimiter.xml", foreground: "f8f8f2" },
        { token: "tag", foreground: "ffb86c" },
        { token: "tag.id.pug", foreground: "f1fa8c" },
        { token: "tag.class.pug", foreground: "f1fa8c" },
        { token: "meta.scss", foreground: "f8f8f2" },
        { token: "metatag", foreground: "f8f8f2" },
        { token: "metatag.content.html", foreground: "f8f8f2" },
        { token: "metatag.html", foreground: "f8f8f2" },
        { token: "metatag.xml", foreground: "f8f8f2" },
        { token: "metatag.php", fontStyle: "bold" },
        { token: "key", foreground: "ff79c6" },
        { token: "string.key.json", foreground: "50fa7b" },
        { token: "string.value.json", foreground: "f8f8f2" },
        { token: "attribute.name", foreground: "50fa7b" },
        { token: "attribute.value", foreground: "f1fa8c" },
        { token: "attribute.value.number", foreground: "bd93f9" },
        { token: "attribute.value.unit", foreground: "bd93f9" },
        { token: "attribute.value.html", foreground: "bd93f9" },
        { token: "attribute.value.xml", foreground: "bd93f9" },
        { token: "string", foreground: "f1fa8c" },
        { token: "string.html", foreground: "f1fa8c" },
        { token: "string.sql", foreground: "f8f8f2" },
        { token: "string.yaml", foreground: "f8f8f2" },
        { token: "keyword", foreground: "ff79c6" },
        { token: "keyword.json", foreground: "f8f8f2" },
        { token: "keyword.flow", foreground: "BD93F9" },
        { token: "keyword.flow.scss", foreground: "BD93F9" },
        { token: "operator.scss", foreground: "F8F8F2" },
        { token: "operator.sql", foreground: "F8F8F2" },
        { token: "operator.swift", foreground: "F8F8F2" },
        { token: "predefined.sql", foreground: "50FA7B" },
      ],
      colors: {
        "editor.background": "#282A36",
        "editor.foreground": "#F8F8F2",
        "editor.lineHighlightBackground": "#44475A55",
        "editor.selectionBackground": "#44475A55",
        "editor.selectionHighlightBackground": "#44475A55",
        "editorCursor.foreground": "#F8F8F0",
        "editorSuggestWidget.highlightForeground": "#50FA7B",
      },
    });
    editorRef.current = editor;
    monaco.editor.setTheme("myDraculaTheme");

    //onCodeChange(`<style>` + files["style.css"].value + `</style>` + files["index.html"].value + `<scr` + `ipt>` + files["script.js"].value + `</scr` + `ipt>`);
    onCodeChange(editorRef.current.getValue());
    listen();
  }

  function handleEditorChange(value, event) {
    //onCodeChange(`<style>` + files["style.css"].value + `</style>` + files["index.html"].value + `<scr` + `ipt>` + files["script.js"].value + `</scr` + `ipt>`);
    /*if (editorRef.current.getValue().includes("#")) {
      editorRef.current.setValue(validate(editorRef.current.getValue()));
    }*/
    onCodeChange(editorRef.current.getValue());

    if (user) {
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {
        roomId,
        code: value,
        pos: editorRef.current.getPosition(),
      });
    }
    if (!user) setUser(true);

    const editor = editorRef.current;

    if (editor) {
      const model = editor.getModel();
      setLine(model.getLineCount());
      setWord(model.getLineMaxColumn(line));

      const { endLineNumber } = event.changes[0].range;
      const { endColumn } = event.changes[0].range;
      /*
      {
       "changes": [
        {
         "range": {
          "startLineNumber": 2,
          "startColumn": 3,
          "endLineNumber": 2,
          "endColumn": 3
         },
         "rangeLength": 0,
         "text": " ",
         "rangeOffset": 4,
         "forceMoveMarkers": false
        }
       ],
       "eol": "\n",
       "versionId": 13,
       "isUndoing": false,
       "isRedoing": false,
       "isFlush": false
      }
      */
      //editorRef.current.setPosition({ lineNumber: endLineNumber, column: endColumn});

      // editorRef.current.setPosition(editorRef.current.getPosition());

      //alert(JSON.stringify(editorRef.current.getPosition(),undefined,1));
      //onCodeChange(line+" "+ word + ' '+ endLineNumber + " "+endColumn);
    }
  }
  useEffect(() => {
    if (editorRef.current) {
      //onCodeChange(`<style>` + files["style.css"].value + `</style>` + files["index.html"].value + `<scr` + `ipt>` + files["script.js"].value + `</scr` + `ipt>`);
      onCodeChange(editorRef.current.getValue());
    }
  }, [file.value]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code, pos }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
          editorRef.current.setPosition(pos);
          setUser(false);
        }
      });
    }

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);
  useEffect(() => {
    if (input.includes("over")) {
      apiCall();
    }
  }, [input]);

  const handleInput = (event) => {
    setInput(event.target.value);
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const apiCall = async () => {
    if (input && input !== isInput) {
      setIsInput(input);
      setIsLoading(true);
      const url = "https://api.openai.com/v1/chat/completions";
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_KEYOPENAI}`,
      };
      const data = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content:
              input.replace("over", "") +
              " in html. give code only. without backticks. without using code block. if code block having language then also only code",
          },
        ],
        temperature: 0.7,
      };

      try {
        const response = await axios.post(url, data, { headers });
        setResponse(response.data.choices[0].message.content);
        editorRef.current.setValue(response.data.choices[0].message.content);
      } catch (error) {
        // alert(JSON.stringify(error));
        console.error(error);
      }

      setIsLoading(false);
      setInput("");
      setIsInput("");
      document.querySelector("#apiForm").style = "display:none";
      await delay(2000);
      document.querySelector("#apiForm").style = "display:flex";
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    apiCall();
  };
  return (
    <editor>
      <loading id="inin" style={{
        display: isLoading ? 'flex' : 'none'
      }}></loading>
      <form id="apiForm" onSubmit={handleSubmit}>
        {/*  <div>
          <button style={{
            margin: "0 1dvmin",
            background: "gray",
            padding: "0 1dvmin"
          }} onClick={() => setFileName("index.html")}>
            Editor
          </button>
           <button style={{
            margin: "0 1dvmin",
            background: "gray",
            padding: "0 1dvmin"
          }} onClick={() => setFileName("style.css")}>
            Generated Code
          </button> */}
        {/* <button style={{
            margin: "0 1dvmin",
            background: "gray",
            padding: "0 1dvmin"
          }} onClick={() => setFileName("script.js")}>
            JS
          </button>
        </div> */}
        <input
          type="text"
          id="input"
          placeholder="Command here"
          value={input}
          onChange={handleInput}
        />
        <input type="button" className="vin"
          onClick={() => {
            speak({ text: editorRef.current.getValue(), voice: voices[12] });
          }}
          value="🔊">
        </input>
      </form>
      <Editor
        id="editor"
        onMount={handleEditorDidMount}
        path={file.name}
        onChange={handleEditorChange}
        defaultLanguage={file.language}
        defaultValue={file.value}
        roundedSelection={true}
        scrollBeyondLastLine={false}
      />
    </editor>
  );
};

export default Editors;
