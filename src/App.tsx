import React, { useEffect, useRef, useState } from "react";
import "./App.scss";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-chrome";
import { Ace } from "ace-builds";

const App: React.FC = () => {
  const [value, setValue] = useState<string>("");
  const [editor, setEditor] = useState<Ace.Editor>();
  const [theme, setTheme] = useState<boolean>(true);
  const targetCode = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let val = localStorage.getItem("preferredDark");
    if (val === "true") {
      document.body.classList.add("dark");
      setTheme(false);
    }
  }, []);

  function onLoad(tempEditor: Ace.Editor) {
    setEditor(tempEditor);
  }

  function onChange(tempValue: string, event: any) {
    setValue(tempValue);
  }

  function toggleTheme() {
    document.body.classList.toggle("dark");
    localStorage.setItem("preferredDark", theme.toString());
    setTheme(!theme);
  }

  function runCode() {
    if (editor && targetCode.current) {
      let value = editor.getValue();
      try{
        targetCode.current.srcdoc = value;
      }catch(err){
        window.alert(err);
      }
    }
  }

  function save() {
    if (editor && targetCode.current) {
      let value = editor.getValue();
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/html;charset=utf-8," + encodeURIComponent(value)
      );
      element.setAttribute("download", "download.txt");

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }
  }

  return (
    <>
      <header>
        <button className="icon-button" onClick={save}>
          <i className="fa fa-save"></i>
        </button>
        <button className="icon-button" onClick={toggleTheme}>
          <i className="fa fa-adjust"></i>
        </button>
        <button className="text-button" onClick={runCode}>
          Run
          <i className="fa fa-play"></i>
        </button>
      </header>
      <main>
        <div className="grid">
          <div className="item-wrapper">
            <AceEditor
              placeholder={undefined}
              mode="html"
              theme={theme ? "chrome" : "monokai"}
              name="editor"
              onLoad={onLoad}
              onChange={onChange}
              fontSize={14}
              showPrintMargin={false}
              showGutter={true}
              highlightActiveLine={true}
              value={value}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 2,
              }}
            />
          </div>
          <div className="item-wrapper">
            <iframe
              ref={targetCode}
              name="targetCode"
              frameBorder="0"
              title="Target Code"
            ></iframe>
          </div>
        </div>
      </main>
    </>
  );
};

export default App;
