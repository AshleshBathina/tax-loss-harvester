import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import ImportantNotes from "./components/ImportantNotes";
import PreHarvestingCard from "./components/PreHarvestingCard";
import AfterHarvestingCard from "./components/AfterHarvestingCard";
import HoldingsTable from "./components/HoldingsTable";
import { fetchHoldings } from "./api/holdings";
import { fetchCapitalGains } from "./api/capitalGains";
import "./App.css";

function computeAfterHarvestingGains(baseCapitalGains, selectedHoldings) {
  const base = baseCapitalGains.capitalGains;
  let stcgProfits = base.stcg.profits;
  let stcgLosses = base.stcg.losses;
  let ltcgProfits = base.ltcg.profits;
  let ltcgLosses = base.ltcg.losses;

  for (const holding of selectedHoldings.values()) {
    const { stcg, ltcg } = holding;
    if (stcg.gain > 0) {
      stcgProfits += stcg.gain;
    } else if (stcg.gain < 0) {
      stcgLosses += Math.abs(stcg.gain);
    }
    if (ltcg.gain > 0) {
      ltcgProfits += ltcg.gain;
    } else if (ltcg.gain < 0) {
      ltcgLosses += Math.abs(ltcg.gain);
    }
  }

  return {
    stcg: { profits: stcgProfits, losses: stcgLosses },
    ltcg: { profits: ltcgProfits, losses: ltcgLosses },
  };
}

export default function App() {
  const [holdings, setHoldings] = useState([]);
  const [capitalGains, setCapitalGains] = useState(null);
  const [holdingsLoading, setHoldingsLoading] = useState(true);
  const [gainsLoading, setGainsLoading] = useState(true);
  const [holdingsError, setHoldingsError] = useState(null);
  const [gainsError, setGainsError] = useState(null);
  const [howItWorksTooltip, setHowItWorksTooltip] = useState(false);

  // Map of { id -> holding } for selected rows
  const [selectedMap, setSelectedMap] = useState(new Map());

  useEffect(() => {
    fetchHoldings()
      .then((data) => {
        // Sort: holdings with meaningful values first
        const sorted = [...data].sort((a, b) => {
          const aVal = Math.abs(a.stcg.gain) + Math.abs(a.ltcg.gain);
          const bVal = Math.abs(b.stcg.gain) + Math.abs(b.ltcg.gain);
          return bVal - aVal;
        });
        setHoldings(sorted);
      })
      .catch((err) => setHoldingsError(err.message))
      .finally(() => setHoldingsLoading(false));

    fetchCapitalGains()
      .then((data) => setCapitalGains(data))
      .catch((err) => setGainsError(err.message))
      .finally(() => setGainsLoading(false));
  }, []);

  const handleToggle = useCallback((id, holding) => {
    setSelectedMap((prev) => {
      const next = new Map(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.set(id, holding);
      }
      return next;
    });
  }, []);

  const handleToggleAll = useCallback(() => {
    setSelectedMap((prev) => {
      if (prev.size === holdings.length) {
        return new Map();
      }
      const next = new Map();
      holdings.forEach((h, idx) => {
        const id = `${h.coin}-${h.coinName}-${idx}`;
        next.set(id, h);
      });
      return next;
    });
  }, [holdings]);

  const selectedIds = new Set(selectedMap.keys());

  const afterGains =
    capitalGains && !gainsLoading
      ? computeAfterHarvestingGains(capitalGains, selectedMap)
      : null;

  const preRealisedGains = capitalGains
    ? capitalGains.capitalGains.stcg.profits -
    capitalGains.capitalGains.stcg.losses +
    capitalGains.capitalGains.ltcg.profits -
    capitalGains.capitalGains.ltcg.losses
    : 0;

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Tax Harvesting</h1>
          <div
            className="how-it-works-wrapper"
            onMouseEnter={() => setHowItWorksTooltip(true)}
            onMouseLeave={() => setHowItWorksTooltip(false)}
          >
            <a href="#" className="how-it-works" onClick={(e) => e.preventDefault()}>
              How it works?
            </a>
            {howItWorksTooltip && (
              <div className="how-it-works-tooltip">
                <p>
                  Tax-loss harvesting lets you sell assets at a loss to offset
                  your capital gains, reducing your overall tax liability.
                  Select holdings below to see the impact.
                </p>
                <a href="#" className="how-it-works-tooltip-link" onClick={(e) => e.preventDefault()}>
                  Know More
                </a>
              </div>
            )}
          </div>
        </div>

        <ImportantNotes />

        {gainsError && (
          <div className="error-banner">
            ⚠️ Failed to load capital gains data: {gainsError}
          </div>
        )}

        <div className="cards-row">
          <PreHarvestingCard
            capitalGains={capitalGains}
            loading={gainsLoading}
          />
          <AfterHarvestingCard
            afterGains={
              afterGains || {
                stcg: { profits: 0, losses: 0 },
                ltcg: { profits: 0, losses: 0 },
              }
            }
            preRealisedGains={preRealisedGains}
            loading={gainsLoading}
          />
        </div>

        {holdingsError && (
          <div className="error-banner">
            ⚠️ Failed to load holdings: {holdingsError}
          </div>
        )}

        <HoldingsTable
          holdings={holdings}
          selectedIds={selectedIds}
          onToggle={handleToggle}
          onToggleAll={handleToggleAll}
          loading={holdingsLoading}
        />
      </main>
    </div>
  );
}
