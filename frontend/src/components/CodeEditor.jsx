import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';

export default function CodeEditor({ value, onChange }) {
  return (
    <CodeMirror
      value={value}
      height="100%"
      theme="dark"
      extensions={[cpp()]}
      onChange={onChange}
      basicSetup={{
        lineNumbers: true,
        highlightActiveLine: true,
        tabSize: 4,
      }}
    />
  );
}
