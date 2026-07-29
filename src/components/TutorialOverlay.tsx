import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

interface Step {
  key: string;
  title: string;
  text: string;
  waitFor: string | null;
  hint?: string;
  showWhen?: (money: number, eventsCount: number) => boolean;
}

const STEPS: Step[] = [
  {
    key: 'welcome',
    title: 'Welcome, Mayor!',
    text: 'Your mission: build a sustainable city that thrives economically and environmentally. Let\'s start by placing your first building.',
    waitFor: null,
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
    text: 'Your first building is up! Keep building to earn income — more Houses and Shops boost your daily earnings.',
    waitFor: null,
  },
  {
    key: 'meters',
    title: 'Watch the Meters',
    text: 'The right panel shows all 6 meter bars — Money, Population, Happiness, Air Quality, Renewable %, and Resilience. Fill them all and go green to win!',
    waitFor: null,
  },
  {
    key: 'events',
    title: 'Organize Events',
    text: 'Now you can organize events! Switch to the Events tab in the sidebar. Events are one-time purchases that permanently boost your meters — like doubling your income or multiplying your population capacity!',
    waitFor: null,
    showWhen: (m, e) => m >= 500 && e === 0,
  },
  {
    key: 'events_detail',
    title: 'How Events Work',
    text: 'Each event has conditions (like minimum population) and takes 2-8 days to organize. When complete, its effects stack multiplicatively — making all your buildings much more powerful. You\'ll need most events to win!',
    waitFor: null,
    showWhen: (m, e) => m >= 500 && e === 0,
  },
];

export default function TutorialOverlay() {
  const tutorialComplete = useGameStore((s) => s.tutorialComplete);
  const completeTutorial = useGameStore((s) => s.completeTutorial);
  const selectedBuilding = useGameStore((s) => s.selectedBuilding);
  const grid = useGameStore((s) => s.grid);
  const gameSpeed = useGameStore((s) => s.gameSpeed);
  const setGameSpeed = useGameStore((s) => s.setGameSpeed);
  const tutorialReplay = useGameStore((s) => s.tutorialReplay);
  const setTutorialStep = useGameStore((s) => s.setTutorialStep);
  const money = useGameStore((s) => s.money);
  const eventsOrganized = useGameStore((s) => s.eventsOrganized);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const [step, setStep] = useState(0);
  const [hadSelection, setHadSelection] = useState(false);
  const [startTileCount] = useState(0);
  const originalSpeed = useRef(gameSpeed);
  const setGameSpeedRef = useRef(setGameSpeed);
  setGameSpeedRef.current = setGameSpeed;
  const prevComplete = useRef(tutorialComplete);

  // Filter steps: show event steps only when player has $300+
  const visibleSteps = STEPS.filter(s => !s.showWhen || s.showWhen(money, eventsOrganized.length));

  // Sync step to store so BuildingMenu can read it
  useEffect(() => { setTutorialStep(step); }, [step, setTutorialStep]);

  // Reset step when tutorial is reopened (e.g. after restart)
  useEffect(() => {
    if (prevComplete.current && !tutorialComplete) {
      setStep(0);
      setHadSelection(false);
    }
    prevComplete.current = tutorialComplete;
  }, [tutorialComplete]);

  // Pause game while tutorial is showing, restore when completes
  useEffect(() => {
    if (tutorialComplete) return;
    const speed = useGameStore.getState().gameSpeed;
    if (speed !== 0) {
      originalSpeed.current = speed;
      setGameSpeedRef.current(0);
    }
    return () => {
      if (originalSpeed.current !== 0) setGameSpeedRef.current(originalSpeed.current);
    };
  }, [tutorialComplete]);

  // Ensure step stays within visible steps
  useEffect(() => {
    if (step >= visibleSteps.length) setStep(visibleSteps.length - 1);
  }, [visibleSteps.length, step]);

  const occupiedCount = grid.flat().filter(Boolean).length;
  const s = visibleSteps[step] || visibleSteps[visibleSteps.length - 1];
  const isLast = step === visibleSteps.length - 1;

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
        <p>
          {s.key === 'select' && isMobile
            ? 'Tap the 🏗️ button on the bottom toolbar to open the building menu, then tap any affordable building.'
            : s.key === 'meters' && isMobile
            ? 'Tap the 📊 button on the bottom toolbar to open the meters panel. Fill all 6 bars and go green to win!'
            : s.text}
        </p>
        {showHint && s.hint && (
          <p className="tutorial-hint">{s.hint}</p>
        )}
        <div className="tutorial-buttons">
          {step > 0 && (!s.waitFor || tutorialReplay) && (
            <button className="tutorial-btn" onClick={() => setStep(step - 1)}>Back</button>
          )}
          {isLast ? (
            <button className="tutorial-btn primary" onClick={completeTutorial}>Start Playing</button>
          ) : (!s.waitFor || tutorialReplay) ? (
            <button className="tutorial-btn primary" onClick={() => setStep(step + 1)}>Next</button>
          ) : null}
          <button className="tutorial-btn skip" onClick={completeTutorial}>Skip Tutorial</button>
        </div>
        <div className="tutorial-dots">
          {visibleSteps.map((_, i) => (
            <span key={i} className={`dot ${i === step ? 'active' : ''}`} onClick={() => !visibleSteps[i].waitFor && setStep(i)} />
          ))}
        </div>
      </div>
    </div>
  );
}

