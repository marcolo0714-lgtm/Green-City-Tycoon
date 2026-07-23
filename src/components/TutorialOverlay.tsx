import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

const STEPS = [
  {
    key: 'welcome',
    title: 'Welcome, Mayor!',
    text: 'Your mission: build a sustainable city that thrives economically and environmentally. Let\'s start by placing your first building.',
    waitFor: null as string | null,
  },
  {
    key: 'select',
    title: 'Step 1: Select a Building',
    text: 'Open the left sidebar and click on any affordable building. It will earn income and attract citizens once built.',
    waitFor: 'selectedBuilding',
    hint: 'Select a building from the left menu to continue.',
  },
  {
    key: 'place',
    title: 'Step 2: Place It on a Tile',
    text: 'Now click any green tile on the grid to place your building. Each tile is a plot of land ready for development.',
    waitFor: 'buildingPlaced',
    hint: 'Click a green tile on the grid to place your building.',
  },
  {
    key: 'done',
    title: 'Great Start!',
    text: 'Your first building is up! Now keep building — balance economic buildings with green spaces, renewable energy, and community services. Watch the meters on the right to track your city\'s health.',
    waitFor: null,
  },
  {
    key: 'meters',
    title: 'Watch the Meters',
    text: 'The right panel shows Money, Population, Happiness, Air Quality, Renewable %, and Resilience. Keep them all healthy to win!',
    waitFor: null,
  },
  {
    key: 'win',
    title: 'Win Condition',
    text: 'Reach $2000, 100 population, 90%+ happiness, 90%+ resilience, 80%+ renewable, and 90%+ air quality all at once. Good luck, Mayor!',
    waitFor: null,
  },
];

export default function TutorialOverlay() {
  const tutorialComplete = useGameStore((s) => s.tutorialComplete);
  const completeTutorial = useGameStore((s) => s.completeTutorial);
  const selectedBuilding = useGameStore((s) => s.selectedBuilding);
  const grid = useGameStore((s) => s.grid);
  const gameSpeed = useGameStore((s) => s.gameSpeed);
  const setGameSpeed = useGameStore((s) => s.setGameSpeed);

  const [step, setStep] = useState(0);
  const [hadSelection, setHadSelection] = useState(false);
  const [startTileCount] = useState(0);
  const originalSpeed = useRef(gameSpeed);
  const setGameSpeedRef = useRef(setGameSpeed);
  setGameSpeedRef.current = setGameSpeed;

  // Pause game during tutorial, restore on unmount
  useEffect(() => {
    const prevSpeed = originalSpeed.current;
    const setSpeed = setGameSpeedRef.current;
    if (prevSpeed !== 0) {
      setSpeed(0);
    }
    return () => {
      if (prevSpeed !== 0) {
        setSpeed(prevSpeed);
      }
    };
  }, []);

  const occupiedCount = grid.flat().filter(Boolean).length;
  const s = STEPS[step];
  const isLast = step === STEPS.length - 1;

  // Auto-advance when user completes the required action
  useEffect(() => {
    if (s.waitFor === 'selectedBuilding' && selectedBuilding) {
      setHadSelection(true);
      const t = setTimeout(() => setStep(step + 1), 400);
      return () => clearTimeout(t);
    }
    if (s.waitFor === 'buildingPlaced' && hadSelection && occupiedCount > startTileCount) {
      const t = setTimeout(() => setStep(step + 1), 600);
      return () => clearTimeout(t);
    }
  }, [s.waitFor, selectedBuilding, occupiedCount, hadSelection, step, startTileCount]);

  if (tutorialComplete) return null;

  const showHint = s.waitFor && !(s.waitFor === 'selectedBuilding' && selectedBuilding)
    && !(s.waitFor === 'buildingPlaced' && occupiedCount > startTileCount);

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-card">
        <h3>{s.title}</h3>
        <p>{s.text}</p>
        {showHint && s.hint && (
          <p className="tutorial-hint">{s.hint}</p>
        )}
        <div className="tutorial-buttons">
          {step > 0 && !s.waitFor && (
            <button className="tutorial-btn" onClick={() => setStep(step - 1)}>Back</button>
          )}
          {isLast ? (
            <button className="tutorial-btn primary" onClick={completeTutorial}>Start Playing</button>
          ) : !s.waitFor ? (
            <button className="tutorial-btn primary" onClick={() => setStep(step + 1)}>Next</button>
          ) : null}
          <button className="tutorial-btn skip" onClick={completeTutorial}>Skip Tutorial</button>
        </div>
        <div className="tutorial-dots">
          {STEPS.map((_, i) => (
            <span key={i} className={`dot ${i === step ? 'active' : ''}`} onClick={() => !STEPS[i].waitFor && setStep(i)} />
          ))}
        </div>
      </div>
    </div>
  );
}

