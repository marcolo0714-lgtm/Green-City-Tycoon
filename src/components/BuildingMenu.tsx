import { BUILDINGS, CATEGORY_COLORS, CATEGORY_LABELS } from '../data/buildings';
import { useGameStore } from '../store/gameStore';

export default function BuildingMenu() {
  const selectedBuilding = useGameStore((s) => s.selectedBuilding);
  const selectBuilding = useGameStore((s) => s.selectBuilding);
  const money = useGameStore((s) => s.money);

  const categories = [...new Set(BUILDINGS.map((b) => b.category))];

  return (
    <div className="building-menu">
      <h2>Buildings</h2>
      {categories.map((category) => (
        <div key={category} className="building-category">
          <h3
            className="category-header"
            style={{ color: CATEGORY_COLORS[category] }}
          >
            {CATEGORY_LABELS[category]}
          </h3>
          <div className="building-list">
            {BUILDINGS.filter((b) => b.category === category).map((b) => {
              const isSelected = selectedBuilding?.id === b.id;
              const canAfford = money >= b.cost;
              const stats: { value: number; cls: string; title: string; prefix: string; emoji: string }[] = [];
              if (b.income) stats.push({ value: b.income, cls: 'income', title: 'Income/day', prefix: '+', emoji: '💰' });
              if (b.pollution < 0) stats.push({ value: b.pollution, cls: 'clean', title: 'Pollution reduction', prefix: '', emoji: '🌿' });
              if (b.pollution > 0) stats.push({ value: b.pollution, cls: 'dirty', title: 'Pollution generated', prefix: '+', emoji: '🏭' });
              if (b.happinessBoost !== 0) stats.push({ value: b.happinessBoost, cls: b.happinessBoost > 0 ? 'income' : 'dirty', title: 'Happiness effect', prefix: b.happinessBoost > 0 ? '+' : '', emoji: '😊' });
              return (
                <button
                  key={b.id}
                  className={`building-btn ${isSelected ? 'selected' : ''} ${!canAfford ? 'disabled' : ''}`}
                  onClick={() => selectBuilding(isSelected ? null : b)}
                  style={{
                    borderColor: isSelected ? CATEGORY_COLORS[b.category] : 'transparent',
                    backgroundColor: isSelected ? CATEGORY_COLORS[b.category] + '22' : 'transparent',
                  }}
                  disabled={!canAfford}
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
      ))}
      {selectedBuilding && (
        <button className="cancel-btn" onClick={() => selectBuilding(null)}>
          Cancel selection
        </button>
      )}
    </div>
  );
}
