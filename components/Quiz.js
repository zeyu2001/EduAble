import React, { useState, useEffect } from 'react';
import { TailSpin } from 'react-loader-spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons'

import 'katex/dist/katex.min.css';
import Markdown from 'react-markdown';
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css';

import { getQuizByNoteId } from '@/utils/quiz';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const QuizComponent = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showCorrect, setShowCorrect] = useState(false);

  const handleAnswerOptionClick = (isCorrect, e) => {

    setShowCorrect(true);

    if (isCorrect) {
      setScore(score + 1);
    }
    const nextQuestion = currentQuestion + 1;

    setTimeout(() => {

      setShowCorrect(false);

      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
      } else {
        const result = `You scored ${score} out of ${questions.length}`;
        Swal.fire({
          title: 'Quiz Result',
          text: result,
          icon: 'info',
          confirmButtonText: 'OK'
        });
        setCurrentQuestion(0);
        setScore(0);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className='mb-8'>
        <div className='text-xl font-semibold mb-2'>
          <span>Question {currentQuestion + 1}</span>/{questions.length}
        </div>
        <div className='text-2xl font-bold mb-4'>
          <Markdown className="markdown" remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
            {questions[currentQuestion].question}
          </Markdown>
        </div>
      </div>
      <div className='text-center'>
        {questions[currentQuestion].choices.map((answerOption, index) => (
          <button
            key={index}
            onClick={(e) => handleAnswerOptionClick(index === questions[currentQuestion].answer, e)}
            className={`text-lg m-4 
              bg-blue-500 hover:bg-blue-700 
              ${showCorrect && index === questions[currentQuestion].answer ? 'bg-green-500 hover:bg-green-700' : ''
              }
              ${showCorrect && index !== questions[currentQuestion].answer ? 'bg-red-500 hover:bg-red-700' : ''
              }
              text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out`}
          >
            <Markdown className="markdown" remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {answerOption}
            </Markdown>
          </button>
        ))}
      </div>
    </div>
  );
};

const Quiz = ({ selectedNoteId }) => {

  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState('');
  const [regenerate, setRegenerate] = useState(false);

  useEffect(() => {
    setQuiz(null);

    if (selectedNoteId === 'data-new-note') {
      setError('Save your note to see a quiz here.');
      return;
    }

    async function fetchData() {
      const quiz = await getQuizByNoteId(selectedNoteId);
      if (quiz === -1) {
        setError("To create a quiz, please log in.");
        return;
      }
      setQuiz(quiz.questions);
    }
    fetchData();
  }, [selectedNoteId, regenerate]);

  return (
    <div className="w-full min-h-screen mx-auto bg-gray-200 dark:bg-gray-800 shadow-md p-6">
      <h1 className="text-2xl font-bold dark:text-white mb-4">Quiz</h1>
      {
        error && <p>{error}</p>
      }
      {quiz === null && !error &&
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
      {
        quiz && <>
          <div>
            <button
              onClick={(e) => setRegenerate(!regenerate)}
              className="text-lg m-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
            >
              <FontAwesomeIcon icon={faArrowsRotate} /> Regenerate
            </button>
          </div>
          <QuizComponent questions={quiz} />
        </>
      }
    </div>


  )
}

export default Quiz;;