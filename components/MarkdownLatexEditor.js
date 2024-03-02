import React, { useState } from 'react';
import Markdown from 'react-markdown';
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css';

const MarkdownLatexEditor = ({markdown, setLatex}) => {
  return (
    <div className="flex">
      <textarea
        className="border-2 border-gray-200 p-2 w-full h-screen"
        value={markdown}
        onChange={(e) => setLatex(e.target.value)}
      />
      <div className="border-2 border-gray-200 p-2 w-full h-screen overflow-auto">
      <Markdown className="markdown" remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {markdown}
      </Markdown>
      </div>
    </div>
  );
};

export default MarkdownLatexEditor;
