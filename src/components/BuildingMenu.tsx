import { useState } from 'react';
import { BUILDINGS, CATEGORY_COLORS, CATEGORY_LABELS } from '../data/buildings';
import { EVENTS } from '../data/events';
import { useGameStore } from '../store/gameStore';

function fmt(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
  return String(n);
}

export default function BuildingMenu() {
  const [tab, setTab] = useState<'buildings' | 'events' | 'goals'>('buildings');

  const selectedBuilding = useGameStore((s) => s.selectedBuilding);
  const selectBuilding = useGameStore((s) => s.selectBuilding);
  const money = useGameStore((s) => s.money);
  const population = useGameStore((s) => s.population);
  const happiness = useGameStore((s) => s.happiness);
  const pollution = useGameStore((s) => s.pollution);
  const renewablePct = useGameStore((s) => s.renewablePct);
  const resilience = useGameStore((s) => s.resilience);
  const tutorialComplete = useGameStore((s) => s.tutorialComplete);
  const tutorialStep = useGameStore((s) => s.tutorialStep);
  const tutorialReplay = useGameStore((s) => s.tutorialReplay);
  const eventsOrganized = useGameStore((s) => s.eventsOrganized);
  const eventTimers = useGameStore((s) => s.eventTimers);
  const organizeEvent = useGameStore((s) => s.organizeEvent);
  const completedObjectives = useGameStore((s) => s.completedObjectives);
  const showEventPopup = useGameStore((s) => s.showEventPopup);
  const devShowAllGoals = useGameStore((s) => s.devShowAllGoals);
  const devShowAllEventViews = useGameStore((s) => s.devShowAllEventViews);

  const tutorialBlocksSelection = !tutorialComplete && !tutorialReplay && tutorialStep < 1;

  const GOALS: { id: string; text: string }[] = [
    { id: 'first_build', text: 'Place your first building' },
    { id: 'money_500', text: 'Earn $500' },
    { id: 'pop_200', text: 'Reach 200 population' },
    { id: 'park_built', text: 'Build a Park or Green Roof' },
    { id: 'first_event', text: 'Organize your first event' },
    { id: 'money_5k', text: 'Save up $5,000' },
    { id: 'renewable_built', text: 'Build a renewable energy building' },
    { id: 'happiness_60', text: 'Reach 60% happiness' },
    { id: 'pop_5k', text: 'Reach 5,000 population' },
    { id: 'survive_disaster', text: 'Survive a natural disaster' },
    { id: 'money_50k', text: 'Amass $50,000' },
    { id: 'terrain_cleared', text: 'Clear a terrain tile' },
    { id: 'event_5', text: 'Organize 5 events' },
    { id: 'renewable_50', text: 'Reach 50% renewable energy' },
    { id: 'money_500k', text: 'Grow treasury to $500,000' },
    { id: 'pop_500k', text: 'Reach 500,000 population' },
    { id: 'resilience_50', text: 'Reach 50% resilience' },
    { id: 'event_10', text: 'Organize all 10 events' },
    { id: 'renewable_95', text: 'Reach 95% renewable energy' },
    { id: 'money_10M', text: 'Reach $10,000,000' },
  ];

  const GOAL_DEPS: Record<string, string> = {
    money_500: 'first_build',
    pop_200: 'first_build',
    park_built: 'pop_200',
    first_event: 'money_500',
    money_5k: 'first_event',
    renewable_built: 'first_event',
    happiness_60: 'park_built',
    pop_5k: 'pop_200',
    survive_disaster: 'money_500',
    money_50k: 'money_5k',
    terrain_cleared: 'money_5k',
    event_5: 'first_event',
    renewable_50: 'renewable_built',
    money_500k: 'money_50k',
    pop_500k: 'pop_5k',
    resilience_50: 'survive_disaster',
    event_10: 'event_5',
    renewable_95: 'renewable_50',
    money_10M: 'money_500k',
  };

  const visibleGoals = devShowAllGoals
    ? GOALS
    : GOALS.filter((g) => {
        const dep = GOAL_DEPS[g.id];
        return !dep || completedObjectives.includes(dep);
      });

  return (
    <div className="building-menu">
      <div className="menu-tabs">
        <button
          className={`menu-tab ${tab === 'buildings' ? 'active' : ''}`}
          onClick={() => { setTab('buildings'); selectBuilding(null); }}
        >
          Buildings
        </button>
        <button
          className={`menu-tab ${tab === 'events' ? 'active' : ''}`}
          onClick={() => { setTab('events'); selectBuilding(null); }}
        >
          Events
        </button>
        <button
          className={`menu-tab ${tab === 'goals' ? 'active' : ''}`}
          onClick={() => { setTab('goals'); selectBuilding(null); }}
        >
          Goals
        </button>
      </div>

      {tab === 'buildings' && (
        <>
          <h2>Buildings</h2>
          {(() => {
            const available = BUILDINGS.filter(b =>
              !b.unlockEvent || eventsOrganized.includes(b.unlockEvent)
            );
            const categories = [...new Set(available.map((b) => b.category))];
            return categories.map((category) => (
              <div key={category} className="building-category">
                <h3 className="category-header" style={{ color: CATEGORY_COLORS[category] }}>
                  {CATEGORY_LABELS[category]}
                </h3>
                <div className="building-list">
                  {available.filter((b) => b.category === category).map((b) => {
                    const isSelected = selectedBuilding?.id === b.id;
                    const canAfford = money >= b.cost;
                    const stats: { value: number; cls: string; title: string; prefix: string; emoji: string }[] = [];
                    if (b.income) stats.push({ value: b.income, cls: 'income', title: 'Income/day', prefix: '+', emoji: '💰' });
                    if (b.pollution < 0) stats.push({ value: b.pollution, cls: 'clean', title: 'Pollution reduction', prefix: '', emoji: '🌿' });
                    if (b.pollution > 0) stats.push({ value: b.pollution, cls: 'dirty', title: 'Pollution generated', prefix: '+', emoji: '🏭' });
                    if (b.happinessBoost !== 0) stats.push({ value: b.happinessBoost, cls: b.happinessBoost > 0 ? 'happiness' : 'dirty', title: 'Happiness effect', prefix: b.happinessBoost > 0 ? '+' : '', emoji: '😊' });
                    return (
                      <button
                        key={b.id}
                        className={`building-btn ${isSelected ? 'selected' : ''} ${!canAfford ? 'disabled' : ''}`}
                        onClick={() => selectBuilding(isSelected ? null : b)}
                        style={{
                          borderColor: isSelected ? CATEGORY_COLORS[b.category] : 'transparent',
                          backgroundColor: isSelected ? CATEGORY_COLORS[b.category] + '22' : 'transparent',
                        }}
                        disabled={!canAfford || tutorialBlocksSelection}
                        title={!canAfford ? `Need $${b.cost - money} more` : `Place ${b.name} — $${b.cost}`}
                      >
                        <span className="building-emoji">{b.emoji}</span>
                        <div className="building-info">
                          <div className="building-name-row">
                            <span className="building-name">{b.name}</span>
                            <span className="building-cost">${b.cost}</span>
                          </div>
                          {stats.length > 0 && (
                            <div className="building-stats">
                              {stats.map((s, i) => (
                                <span key={i} className={`building-stat ${s.cls}`} title={s.title}>
                                  {s.emoji} {s.prefix}{s.value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ));
          })()}
          {selectedBuilding && (
            <button className="cancel-btn" onClick={() => selectBuilding(null)}>
              Cancel selection
            </button>
          )}
        </>
      )}

      {tab === 'events' && (
        <>
          <h2>Events</h2>
          {EVENTS.map((ev) => {
            const completed = eventsOrganized.includes(ev.id);
            const inProgress = eventTimers[ev.id] !== undefined;
            const daysLeft = inProgress ? eventTimers[ev.id] : 0;
            const canAfford = money >= ev.cost;

            // Build condition rows
            const condRows: { met: boolean; label: string }[] = [];
            const c = ev.conditions;
            if (c.population !== undefined) condRows.push({ met: population >= c.population, label: `👥 Population ≥ ${fmt(c.population)}` });
            if (c.happiness !== undefined) condRows.push({ met: happiness >= c.happiness, label: `😊 Happiness ≥ ${c.happiness}%` });
            if (c.pollution !== undefined) condRows.push({ met: pollution <= c.pollution, label: `🌿 Air Quality ≥ ${100 - c.pollution}%` });
            if (c.renewablePct !== undefined) condRows.push({ met: renewablePct >= c.renewablePct, label: `⚡ Renewable ≥ ${c.renewablePct}%` });
            if (c.resilience !== undefined) condRows.push({ met: resilience >= c.resilience, label: `🛡️ Resilience ≥ ${c.resilience}%` });
            if (c.money !== undefined) condRows.push({ met: money >= c.money, label: `💰 Reserve $${fmt(c.money)}` });

            const allMet = condRows.every(cc => cc.met) && canAfford && !completed && !inProgress;

            // Build effect rows
            const effRows: string[] = [];
            if (ev.effects.incomeMultiplier) effRows.push(`💰 Income ×${ev.effects.incomeMultiplier}`);
            if (ev.effects.resilienceMultiplier) effRows.push(`🛡️ Resilience ×${ev.effects.resilienceMultiplier}`);
            if (ev.effects.renewableMultiplier) effRows.push(`⚡ Renewable ×${ev.effects.renewableMultiplier}`);
            if (ev.effects.popCapMultiplier) effRows.push(`🏘️ Pop Cap ×${ev.effects.popCapMultiplier}`);
            if (ev.effects.popGrowthMultiplier) effRows.push(`📈 Pop Growth ×${ev.effects.popGrowthMultiplier}`);
            if (ev.effects.pollutionMultiplier && ev.effects.pollutionMultiplier < 1) effRows.push(`🌿 Pollution ×${ev.effects.pollutionMultiplier}`);

            return (
              <div
                key={ev.id}
                className={`event-card ${completed ? 'event-done' : ''} ${inProgress ? 'event-progress' : ''}`}
              >
                <div className="event-header">
                  <span className="event-emoji">{ev.emoji}</span>
                  <span className="event-name">{ev.name}</span>
                  <span className="event-cost">${fmt(ev.cost)}</span>
                </div>
                <div className="event-desc">{ev.description}</div>
                {condRows.length > 0 && (
                  <div className="event-section">
                    <div className="event-section-title">Requirements</div>
                    {condRows.map((cr, i) => (
                      <div key={i} className={`event-row ${cr.met ? 'met' : 'unmet'}`}>
                        {cr.met ? '✓' : '✗'} {cr.label}
                      </div>
                    ))}
                  </div>
                )}
                {effRows.length > 0 && (
                  <div className="event-section">
                    <div className="event-section-title">Boosts</div>
                    {effRows.map((e, i) => (
                      <div key={i} className="event-row boost">{e}</div>
                    ))}
                  </div>
                )}
                {!completed && !inProgress && (
                  <button
                    className={`event-organize-btn ${allMet ? '' : 'disabled'}`}
                    onClick={() => { if (allMet) organizeEvent(ev.id); }}
                    disabled={!allMet}
                  >
                    {allMet ? `Organize (${ev.duration}d)` : canAfford ? 'Conditions not met' : `Need $${fmt(ev.cost - money)}`}
                  </button>
                )}
                {inProgress && (
                  <div className="event-timer">⏳ Organizing... {daysLeft}d left</div>
                )}
                {completed && (
                  <div className="event-done-row">
                    <span className="event-done-label">✓ Completed</span>
                    <button className="event-view-btn" onClick={() => showEventPopup(ev.id)}>🔍 View</button>
                  </div>
                )}
                {!completed && devShowAllEventViews && (
                  <div className="event-done-row">
                    <button className="event-view-btn" onClick={() => showEventPopup(ev.id)}>🔍 Preview</button>
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {tab === 'goals' && (
        <>
          <h2>Goals</h2>
          <div className="goals-list">
            {visibleGoals.map((g) => {
              const done = completedObjectives.includes(g.id);
              const dep = GOAL_DEPS[g.id];
              const locked = devShowAllGoals && dep && !completedObjectives.includes(dep);
              return (
                <div key={g.id} className={`goal-item ${done ? 'done' : ''} ${locked ? 'locked' : ''}`}>
                  <span className="goal-check">{done ? '✅' : locked ? '🔒' : '☐'}</span>
                  <span className="goal-text">{g.text}</span>
                </div>
              );
            })}
          </div>
          <div className="goals-progress">
            {completedObjectives.length} / {GOALS.length} completed
          </div>
        </>
      )}
    </div>
  );
}
