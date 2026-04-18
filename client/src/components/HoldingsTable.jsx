import { useState } from "react";
import { formatGain } from "../utils/formatters";
import "./HoldingsTable.css";

const DEFAULT_VISIBLE = 5;

function CoinImage({ src, coin }) {
  const [imgError, setImgError] = useState(false);
  if (imgError || !src) {
    return (
      <div className="coin-placeholder">
        {coin?.charAt(0) ?? "?"}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={coin}
      className="coin-logo"
      onError={() => setImgError(true)}
    />
  );
}

export default function HoldingsTable({ holdings, selectedIds, onToggle, onToggleAll, loading }) {
  const [showAll, setShowAll] = useState(false);

  if (loading) {
    return (
      <div className="holdings-card">
        <h2 className="holdings-title">Holdings</h2>
        <div className="holdings-skeleton">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton-row-full" />
          ))}
        </div>
      </div>
    );
  }

  const visibleHoldings = showAll ? holdings : holdings.slice(0, DEFAULT_VISIBLE);
  const allSelected = holdings.length > 0 && selectedIds.size === holdings.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < holdings.length;

  return (
    <div className="holdings-card">
      <h2 className="holdings-title">Holdings</h2>
      <div className="table-wrapper">
        <table className="holdings-table">
          <thead>
            <tr>
              <th className="th-check">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => { if (el) el.indeterminate = someSelected; }}
                  onChange={() => onToggleAll()}
                  className="row-checkbox"
                  id="select-all-checkbox"
                  aria-label="Select all holdings"
                />
              </th>
              <th className="th-asset">Asset</th>
              <th className="th-right th-holdings">
                <span>Holdings</span>
                <span className="sub-heading">Avg Buy Price</span>
              </th>
              <th className="th-right th-current-price">Current Price</th>
              <th className="th-right th-stcg">
                <span>Short-term</span>
              </th>
              <th className="th-right th-ltcg">
                <span>Long-Term</span>
              </th>
              <th className="th-right th-amount">Amount to Sell</th>
            </tr>
          </thead>
          <tbody>
            {visibleHoldings.map((holding, idx) => {
              const id = `${holding.coin}-${holding.coinName}-${idx}`;
              const isSelected = selectedIds.has(id);
              const stcgGain = formatGain(holding.stcg.gain);
              const ltcgGain = formatGain(holding.ltcg.gain);
              const totalValue = (holding.currentPrice * holding.totalHolding).toFixed(2);

              return (
                <tr
                  key={id}
                  className={`holding-row ${isSelected ? "selected" : ""}`}
                  onClick={() => onToggle(id, holding)}
                >
                  <td className="td-check" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggle(id, holding)}
                      className="row-checkbox"
                      id={`checkbox-${id}`}
                      aria-label={`Select ${holding.coinName}`}
                    />
                  </td>
                  <td className="td-asset">
                    <div className="asset-info">
                      <CoinImage src={holding.logo} coin={holding.coin} />
                      <div className="asset-names">
                        <span className="asset-coin">{holding.coinName}</span>
                        <span className="asset-symbol">{holding.coin}</span>
                      </div>
                    </div>
                  </td>
                  <td className="td-right">
                    <div className="holding-amount">
                      <span className="holding-total">
                        {parseFloat(holding.totalHolding.toPrecision(6))} {holding.coin}
                      </span>
                      <span className="holding-price">
                        ₹{parseFloat(holding.averageBuyPrice.toPrecision(5)).toLocaleString("en-IN")} / {holding.coin}
                      </span>
                    </div>
                  </td>
                  <td className="td-right">
                    <span className="current-price">
                      ₹{parseFloat(holding.currentPrice.toPrecision(6)).toLocaleString("en-IN")}
                    </span>
                  </td>
                  <td className="td-right">
                    <div className="gain-cell">
                      <span className={`gain-value ${stcgGain.isPositive ? "positive" : "negative"}`}>
                        {stcgGain.text}
                      </span>
                      <span className="gain-balance">
                        {parseFloat(holding.stcg.balance.toPrecision(4))} {holding.coin}
                      </span>
                    </div>
                  </td>
                  <td className="td-right">
                    <div className="gain-cell">
                      {holding.ltcg.balance > 0 ? (
                        <>
                          <span className={`gain-value ${ltcgGain.isPositive ? "positive" : "negative"}`}>
                            {ltcgGain.text}
                          </span>
                          <span className="gain-balance">
                            {parseFloat(holding.ltcg.balance.toPrecision(4))} {holding.coin}
                          </span>
                        </>
                      ) : (
                        <span className="no-value">-</span>
                      )}
                    </div>
                  </td>
                  <td className="td-right">
                    {isSelected ? (
                      <span className="amount-to-sell">
                        {parseFloat(holding.totalHolding.toPrecision(6))} {holding.coin}
                      </span>
                    ) : (
                      <span className="no-value">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {holdings.length > DEFAULT_VISIBLE && (
        <button
          className="view-all-btn"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? "Show Less ▲" : `View All (${holdings.length}) ▼`}
        </button>
      )}
    </div>
  );
}
