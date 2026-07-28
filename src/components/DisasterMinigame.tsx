import { useGameStore } from '../store/gameStore';

export default function DisasterMinigame() {
  const mg = useGameStore((s) => s.disasterMinigame);
  const answerMinigame = useGameStore((s) => s.answerMinigame);
  const closeMinigame = useGameStore((s) => s.closeMinigame);

  if (!mg) return null;

  const q = mg.questions[mg.currentIndex];
  const isLast = mg.currentIndex === mg.questions.length - 1;
  const isCorrect = mg.answered && mg.chosenIndex === q.correctIndex;

  const handleAnswer = (i: number) => {
    if (mg.answered) return;
    answerMinigame(i);
  };

  const handleNext = () => {
    if (!mg.answered) return;
    if (isLast) {
      closeMinigame();
    } else {
      useGameStore.setState({
        disasterMinigame: { ...mg, currentIndex: mg.currentIndex + 1, answered: false, chosenIndex: -1 },
      });
    }
  };

  return (
    <div className="minigame-overlay">
      <div className="minigame-board">
        {/* Teacher character */}
        <div className="minigame-teacher-row">
          <div className="minigame-teacher">
            <div className="teacher-face">{mg.answered ? (isCorrect ? '🤗' : '🤔') : '🧑‍🏫'}</div>
            <div className="teacher-body-css">
              <div className="teacher-torso-css" />
            </div>
          </div>

          {/* Speech bubble */}
          <div className={`minigame-bubble ${mg.answered ? (isCorrect ? 'bubble-correct' : 'bubble-wrong') : ''}`}>
            {mg.answered ? (
              <>
                <div className="bubble-reaction">{isCorrect ? '✅ Correct!' : `❌ Not quite — the answer is ${'ABCD'[q.correctIndex]}`}</div>
                <div className="bubble-explanation">{q.explanation}</div>
              </>
            ) : (
              <div className="minigame-question-text">{q.question}</div>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="minigame-progress">
          Question {mg.currentIndex + 1} of {mg.questions.length}
          <span className="minigame-score">✅ {mg.score}</span>
        </div>

        {/* Answers — 4 rows */}
        <div className="minigame-answers-col">
          {q.answers.map((a, i) => {
            let cls = 'minigame-btn';
            if (mg.answered) {
              if (i === mg.chosenIndex && i === q.correctIndex) cls += ' chosen-correct';
              else if (i === mg.chosenIndex) cls += ' chosen-wrong';
              else if (i === q.correctIndex) cls += ' correct';
              else cls += ' dimmed';
            }
            return (
              <button key={i} className={cls} onClick={() => handleAnswer(i)} disabled={mg.answered}>
                <span className="minigame-letter">{'ABCD'[i]}</span>
                <span>{a}</span>
              </button>
            );
          })}
        </div>

        {/* Next button */}
        {mg.answered && (
          <button className="minigame-next" onClick={handleNext}>
            {isLast ? '✅ Return to City' : 'Next Question →'}
          </button>
        )}
      </div>
    </div>
  );
}
