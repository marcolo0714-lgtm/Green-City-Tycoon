import { useGameStore } from '../store/gameStore';

function Illustration({ eventId }: { eventId: string }) {
  switch (eventId) {
    case 'event_1': return <GreenDay />;
    case 'event_2': return <CleanEnergy />;
    case 'event_3': return <CoastalShield />;
    case 'event_4': return <Geothermal />;
    case 'event_5': return <MetroTransit />;
    case 'event_6': return <GreenArchitecture />;
    case 'event_7': return <WaterRenaissance />;
    case 'event_8': return <ClimateInnovation />;
    case 'event_9': return <SmartResilient />;
    case 'event_10': return <WorldSummit />;
    default: return null;
  }
}

/* 1: Community Green Day — trees with connected trunks+canopies */
function GreenDay() {
  return (
    <div className="illo illo-gd">
      <div className="gd-sun" />
      <div className="gd-cloud gd-c1" />
      <div className="gd-cloud gd-c2" />
      {[40, 100, 170, 260].map((l, i) => {
        const th = 26 + i * 6;
        const cs = 28 + i * 12;
        return (
          <div key={`gt-${i}`} className="gd-tree" style={{ left: l }}>
            <div className="gd-canopy" style={{ width: cs, height: cs }} />
            <div className="gd-trunk" style={{ height: th }} />
          </div>
        );
      })}
      <div className="gd-grass" />
      <div className="gd-ground" />
      <div className="gd-person" />
    </div>
  );
}

/* 2: Clean Energy Kickstart — turbines above hills */
function CleanEnergy() {
  return (
    <div className="illo illo-ce">
      <div className="ce-sky" />
      {[50, 170, 290].map((l, i) => (
        <div key={`wt-${i}`} className="ce-turbine" style={{ left: l }}>
          <div className="ce-blades" />
          <div className="ce-tower" />
        </div>
      ))}
      <div className="ce-hill ce-h1" />
      <div className="ce-hill ce-h2" />
      <div className="ce-recycle" />
    </div>
  );
}

/* 3: Coastal Shield — full-width wall with center gap */
function CoastalShield() {
  return (
    <div className="illo illo-cs">
      <div className="cs-sky" />
      {[0, 1, 2].map((i) => <div key={`sw-${i}`} className="cs-wave" style={{ bottom: 70 + i * 24, opacity: 1 - i * 0.3 }} />)}
      <div className="cs-backwall" />
      <div className="cs-wall"><div className="cs-wtop" /></div>
      <div className="cs-shore" />
    </div>
  );
}

/* 4: Geothermal Plant — power plant + cooling tower on earth */
function Geothermal() {
  return (
    <div className="illo illo-gt">
      <div className="gt-sky" />
      <div className="gt-earth">
        <div className="gt-building" />
        <div className="gt-tower" />
        <div className="gt-vent gt-v1" />
        <div className="gt-vent gt-v2" />
        <div className="gt-vent gt-v3" />
        <div className="gt-steam gt-s1" />
        <div className="gt-steam gt-s2" />
        <div className="gt-steam gt-s3" />
        <div className="gt-heat" />
      </div>
    </div>
  );
}

/* 5: Metro Transit — keep as is */
function MetroTransit() {
  return (
    <div className="illo illo-mt">
      <div className="mt-ceiling" />
      <div className="mt-pillar mt-p1" />
      <div className="mt-pillar mt-p2" />
      <div className="mt-pillar mt-p3" />
      <div className="mt-platform" />
      <div className="mt-rail mt-r1" />
      <div className="mt-rail mt-r2" />
      <div className="mt-sign" />
      <div className="mt-train" />
    </div>
  );
}

/* 6: Green Architecture Expo — central tower + side buildings */
function GreenArchitecture() {
  return (
    <div className="illo illo-ga">
      <div className="ga-sky" />
      <div className="ga-sun" />
      <div className="ga-bldg ga-left"><div className="ga-win" /><div className="ga-win" /></div>
      <div className="ga-bldg ga-main">
        <div className="ga-floor ga-f1" />
        <div className="ga-floor ga-f2" />
        <div className="ga-floor ga-f3" />
        <div className="ga-vine ga-vl" />
        <div className="ga-vine ga-vr" />
      </div>
      <div className="ga-bldg ga-right"><div className="ga-win" /><div className="ga-win" /></div>
      <div className="ga-ground" />
      <div className="ga-person ga-p1" />
      <div className="ga-person ga-p2" />
      <div className="ga-person ga-p3" />
    </div>
  );
}

/* 7: Water Renaissance — desalination plant: intake from sea, tanks, clean output */
function WaterRenaissance() {
  return (
    <div className="illo illo-wr">
      <div className="wr-sky" />
      <div className="wr-sea" />
      <div className="wr-platform" />
      <div className="wr-intake" />
      <div className="wr-tank wr-t1"><div className="wr-tband" /></div>
      <div className="wr-tank wr-t2"><div className="wr-tband" /></div>
      <div className="wr-pipe wr-ph" />
      <div className="wr-pipe wr-pv" />
      <div className="wr-outlet" />
      <div className="wr-wave wr-w1" />
      <div className="wr-wave wr-w2" />
    </div>
  );
}

/* 8: Climate Innovation — science buildings with telescopes on top */
function ClimateInnovation() {
  return (
    <div className="illo illo-ci">
      <div className="ci-sky" />
      <div className="ci-building ci-b1">
        <div className="ci-dome"><div className="ci-scope" /></div>
      </div>
      <div className="ci-building ci-b2">
        <div className="ci-win-row" />
        <div className="ci-dish" />
      </div>
      <div className="ci-building ci-b3">
        <div className="ci-win-row" />
        <div className="ci-ant" />
      </div>
      <div className="ci-ground" />
      <div className="ci-star ci-s1" />
      <div className="ci-star ci-s2" />
      <div className="ci-star ci-s3" />
    </div>
  );
}

/* 9: Smart Resilient City — tsunami blocked by building barrier */
function SmartResilient() {
  return (
    <div className="illo illo-sr">
      <div className="sr-night" />
      <div className="sr-tsunami">
        <div className="sr-twave sr-tw1" />
        <div className="sr-twave sr-tw2" />
        <div className="sr-twave sr-tw3" />
      </div>
      <div className="sr-barrier" />
      <div className="sr-spark sr-sp1" />
      <div className="sr-spark sr-sp2" />
      {[180, 220, 260, 300, 340].map((l, i) => (
        <div key={`sk-${i}`} className="sr-building" style={{ left: l, height: 40 + i * 14, width: 16 + i * 4 }} />
      ))}
      <div className="sr-ground" />
    </div>
  );
}

/* 10: World Summit — 3D conference room with leaders signing */
function WorldSummit() {
  return (
    <div className="illo illo-ws">
      <div className="ws-wall ws-back" /><div className="ws-wall ws-left" /><div className="ws-wall ws-right" />
      <div className="ws-window" />
      <div className="ws-floor" />
      <div className="ws-flag ws-fl1" />
      <div className="ws-flag ws-fl2" />
      <div className="ws-table" />
      <div className="ws-chandelier" />
      <div className="ws-doc" />
      <div className="ws-pen" />
      {[30, 80, 130, 240, 290].map((l, i) => (
        <div key={`ch-${i}`} className="ws-chair" style={{ left: l }}>
          <div className="ws-head" style={{ background: ['#fbbf24','#c084fc','#fca5a5','#86efac','#fdba74'][i] }} />
          <div className="ws-body" />
        </div>
      ))}
    </div>
  );
}

export default function EventPopup() {
  const popups = useGameStore((s) => s.eventPopups);
  const dismiss = useGameStore((s) => s.dismissEventPopup);

  if (popups.length === 0) return null;
  const p = popups[0];

  return (
    <div className="event-popup-overlay" onClick={dismiss}>
      <div className="event-popup-card">
        <div className="event-popup-illo" style={{ background: p.color + '15' }}>
          <Illustration eventId={p.id} />
        </div>
        <div className="event-popup-body">
          <h2 className="event-popup-title">{p.name} Organized!</h2>
          <p className="event-popup-desc">{p.description}</p>
          <div className="event-popup-effects">
            {p.effects.map((e, i) => (
              <span key={i} className="event-popup-effect">{e}</span>
            ))}
          </div>
          <p className="event-popup-hint">Click anywhere to continue</p>
          {popups.length > 1 && (
            <p className="event-popup-queue">+{popups.length - 1} more</p>
          )}
        </div>
      </div>
    </div>
  );
}
