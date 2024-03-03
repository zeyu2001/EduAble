import React, { useState, useEffect } from 'react';
import { TailSpin } from 'react-loader-spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons'

import 'katex/dist/katex.min.css';
import Markdown from 'react-markdown';
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css';

import { getSummaryByNoteId } from '@/utils/summary';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const Summary = ({ selectedNoteId }) => {

  const [summary, setSummary] = useState('');
  const [regenerate, setRegenerate] = useState(false);

  useEffect(() => {
    setSummary('');

    if (selectedNoteId === 'data-new-note') {
      setSummary('Save your note to see a summary here.');
      return;
    }

    async function fetchData() {
      const summary = await getSummaryByNoteId(selectedNoteId, regenerate);
      if (summary === -1) {
        setSummary("To create a summary, please log in.");
        return;
      }
      setSummary(summary);
      setRegenerate(false);
    }
    fetchData();
  }, [selectedNoteId, regenerate]);

  return (
    <div className="w-full min-h-screen mx-auto bg-gray-800 shadow-md p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Summary</h1>
      {
        selectedNoteId !== 'data-new-note' && <div>
          <button
            onClick={(e) => setRegenerate(true)}
            className="text-lg m-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
          >
            <FontAwesomeIcon icon={faArrowsRotate} /> Regenerate
          </button>
        </div>
      }
      {summary != '' ? <>
        <Markdown className="markdown" remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
          {summary}
        </Markdown>
      </>
        :
        <div className="flex justify-center items-center h-64">
          <TailSpin
            visible={true}
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      }
    </div>
  )
}

export default Summary;