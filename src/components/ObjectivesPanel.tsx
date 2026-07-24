import { useGameStore } from '../store/gameStore';

const OBJECTIVES_TEXT: { id: string; text: string }[] = [
  { id: 'first_build', text: 'Place your first building' },
  { id: 'money_1k', text: 'Reach $1,000' },
  { id: 'pop_20', text: 'Reach 20 population' },
  { id: 'park_built', text: 'Build a Park or Green Roof' },
  { id: 'happiness_50', text: 'Reach 50% happiness' },
  { id: 'renewable_built', text: 'Build a renewable energy building' },
  { id: 'money_50k', text: 'Reach $50,000' },
  { id: 'renewable_80', text: 'Reach 80%+ renewable energy' },
  { id: 'survive_disaster', text: 'Survive a natural disaster' },
];

const DEPENDS: Record<string, string> = {
  money_1k: 'first_build',
  pop_20: 'first_build',
  park_built: 'pop_20',
  happiness_50: 'park_built',
  renewable_built: 'money_1k',
  money_50k: 'money_1k',
  renewable_80: 'renewable_built',
  survive_disaster: 'money_1k',
};

export default function ObjectivesPanel() {
  const completed = useGameStore((s) => s.completedObjectives);

  const visible = OBJECTIVES_TEXT.filter((o) => {
    const dep = DEPENDS[o.id];
    return !dep || completed.includes(dep);
  });

  if (visible.length === 0) return null;

  return (
    <div className="objectives-panel">
      <h4 className="objectives-title">Objectives</h4>
      {visible.map((o) => {
        const done = completed.includes(o.id);
        return (
          <div key={o.id} className={`objective-item ${done ? 'done' : ''}`}>
            <span className="objective-check">{done ? '✅' : '☐'}</span>
            <span className="objective-text">{o.text}</span>
          </div>
        );
      })}
    </div>
  );
}
