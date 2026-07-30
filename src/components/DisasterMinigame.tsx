import { useGameStore } from '../store/gameStore';

const DISASTER_NAMES: Record<string, string> = {
  tsunami: 'tsunamis',
  earthquake: 'earthquakes',
  drought: 'droughts',
  smog: 'smog',
};

export default function DisasterMinigame() {
  const mg = useGameStore((s) => s.disasterMinigame);
  const answerMinigame = useGameStore((s) => s.answerMinigame);
  const closeMinigame = useGameStore((s) => s.closeMinigame);
  const nextMinigamePhase = useGameStore((s) => s.nextMinigamePhase);

  if (!mg) return null;

  const disasterLabel = DISASTER_NAMES[mg.type] || 'disasters';
  const q = mg.phase === 'quiz' ? mg.questions[mg.currentIndex] : null;
  const isLastQ = q ? mg.currentIndex === mg.questions.length - 1 : false;
  const isCorrect = mg.answered && q && mg.chosenIndex === q.correctIndex;

  const handleAnswer = (i: number) => {
    if (!mg || mg.answered || mg.phase !== 'quiz') return;
    answerMinigame(i);
  };

  const handleNextQuestion = () => {
    if (!mg.answered || mg.phase !== 'quiz') return;
    if (isLastQ) {
      nextMinigamePhase(); // quiz → results
    } else {
      useGameStore.setState({
        disasterMinigame: { ...mg, currentIndex: mg.currentIndex + 1, answered: false, chosenIndex: -1 },
      });
    }
  };

  const pct = 1 - mg.score * 0.175;
  const reductionLabel = mg.score === 0 ? '0%' : `${Math.round((1 - pct) * 100)}%`;

  return (
    <div className="minigame-overlay">
      <div className="minigame-board">
        {/* === INTRO SCREEN === */}
        {mg.phase === 'intro' && (
          <>
            <div className="minigame-teacher-row">
              <div className="minigame-teacher">
                <div className="teacher-face">🧑‍🏫</div>
                <div className="teacher-body-css">
                  <div className="teacher-torso-css" />
                </div>
              </div>
              <div className="minigame-bubble">
                <p className="bubble-intro-text">
                  A {mg.type} is approaching! Let's test your public awareness about {disasterLabel}.
                </p>
                <p className="bubble-intro-sub">
                  Answer 4 questions correctly to reduce the disaster's impact on your city. Every correct answer helps!
                </p>
              </div>
            </div>
            <button className="minigame-next" onClick={nextMinigamePhase}>
              Begin Quiz →
            </button>
          </>
        )}

        {/* === QUIZ SCREEN === */}
        {mg.phase === 'quiz' && q && (
          <>
            <div className="minigame-teacher-row">
              <div className="minigame-teacher">
                <div className="teacher-face">{mg.answered ? (isCorrect ? '🤗' : '🤔') : '🧑‍🏫'}</div>
                <div className="teacher-body-css">
                  <div className="teacher-torso-css" />
                </div>
              </div>
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

            <div className="minigame-progress">
              Question {mg.currentIndex + 1} of {mg.questions.length}
              <span className="minigame-score">✅ {mg.score}</span>
            </div>

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

            {mg.answered && (
              <button className="minigame-next" onClick={handleNextQuestion}>
                {isLastQ ? 'See Results →' : 'Next Question →'}
              </button>
            )}
          </>
        )}

        {/* === RESULTS SCREEN === */}
        {mg.phase === 'results' && (
          <>
            <div className="minigame-teacher-row">
              <div className="minigame-teacher">
                <div className="teacher-face">{mg.score >= 3 ? '🎉' : mg.score >= 1 ? '😊' : '😔'}</div>
                <div className="teacher-body-css">
                  <div className="teacher-torso-css" />
                </div>
              </div>
              <div className="minigame-bubble">
                <p className="bubble-intro-text">
                  You answered <strong>{mg.score} out of 4</strong> correctly!
                </p>
                <p className="bubble-intro-sub">
                  The disaster's damage will be reduced by <strong>{reductionLabel}</strong>.
                  {mg.score === 4 && ' Perfect score — maximum protection!'}
                  {mg.score === 0 && ' No reduction — brace for full impact.'}
                </p>
              </div>
            </div>
            <div className="minigame-results-stats">
              <div className="results-stat">
                <span className="results-stat-icon">✅</span>
                <span className="results-stat-label">Correct</span>
                <span className="results-stat-value">{mg.score} / 4</span>
              </div>
              <div className="results-stat">
                <span className="results-stat-icon">🛡️</span>
                <span className="results-stat-label">Damage Taken</span>
                <span className="results-stat-value">{Math.round(pct * 100)}%</span>
              </div>
              <div className="results-stat highlight">
                <span className="results-stat-icon">⭐</span>
                <span className="results-stat-label">Reduction</span>
                <span className="results-stat-value">{reductionLabel}</span>
              </div>
            </div>
            <button className="minigame-next" onClick={closeMinigame}>
              ✅ Return to City
            </button>
          </>
        )}
      </div>
    </div>
  );
}
