import { Editor } from '@monaco-editor/react';
import type { WebContainer } from '@webcontainer/api';
import React from 'react';
import { VITE_REACT_TEMPLATE } from '../templates/react-vite';
import { getLanguageFromFileName } from '../utils/get-language-from-file-name';
import FileTabs from './file-tabs';

export default function CodeEditor({
  webContainer,
}: {
  webContainer: WebContainer | null;
}) {
  const [activeFile, setActiveFile] = React.useState(
    () => VITE_REACT_TEMPLATE.entry,
  );

  const currentFile = VITE_REACT_TEMPLATE.files[activeFile];
  const language = getLanguageFromFileName(activeFile);

  const handleCodeChange = async (content: string) => {
    if (!webContainer) return;

    await webContainer.fs.writeFile(activeFile, content);
  };

  return (
    <div className="h-full">
      <FileTabs
        files={VITE_REACT_TEMPLATE.visibleFiles}
        activeFile={activeFile}
        onFileChange={setActiveFile}
      />
      <Editor
        theme="vs-dark"
        path={activeFile}
        onChange={(value) => handleCodeChange(value || '')}
        defaultValue={currentFile.file.contents as string} // Ideally, worry about the encoding in production, for our example, this is fine.
        defaultLanguage={language}
        options={{
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          rulers: [],
        }}
      />
    </div>
  );
}
