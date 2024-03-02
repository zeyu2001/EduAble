import { parseLatex } from '../utils/latex';
import { InlineMath } from 'react-katex';

const TextWithLatex = ({ text }) => {
  const parts = parseLatex(text);

  return (
    <p>
      {parts.map((part, index) =>
        part.isLatex ? (
          <InlineMath key={index} math={part.text} />
        ) : (
          <span key={index}>{part.text}</span>
        )
      )}
    </p>
  );
};

export default TextWithLatex;