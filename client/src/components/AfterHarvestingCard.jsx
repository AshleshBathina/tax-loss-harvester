import { formatCurrency } from "../utils/formatters";
import "./CapitalGainsCard.css";

export default function AfterHarvestingCard({ afterGains, preRealisedGains, loading }) {
  if (loading) {
    return (
      <div className="card after-harvesting-card">
        <div className="card-loader">
          <div className="skeleton skeleton-title dark" />
          <div className="skeleton skeleton-row dark" />
          <div className="skeleton skeleton-row dark" />
          <div className="skeleton skeleton-row dark" />
          <div className="skeleton skeleton-total dark" />
        </div>
      </div>
    );
  }

  const { stcg, ltcg } = afterGains;
  const stcgNet = stcg.profits - stcg.losses;
  const ltcgNet = ltcg.profits - ltcg.losses;
  const effectiveGains = stcgNet + ltcgNet;
  const savings = preRealisedGains - effectiveGains;
  const showSavings = preRealisedGains > effectiveGains;

  return (
    <div className="card after-harvesting-card">
      <h2 className="card-title white">After Harvesting</h2>
      <table className="gains-table white">
        <thead>
          <tr>
            <th></th>
            <th>Short-term</th>
            <th>Long-term</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="row-label">Profits</td>
            <td>{formatCurrency(stcg.profits)}</td>
            <td>{formatCurrency(ltcg.profits)}</td>
          </tr>
          <tr>
            <td className="row-label">Losses</td>
            <td className="loss-value-dark">- {formatCurrency(stcg.losses)}</td>
            <td className="loss-value-dark">- {formatCurrency(ltcg.losses)}</td>
          </tr>
          <tr className="net-row">
            <td className="row-label">Net Capital Gains</td>
            <td className="bold">{formatCurrency(stcgNet)}</td>
            <td className="bold">{formatCurrency(ltcgNet)}</td>
          </tr>
        </tbody>
      </table>
      <div className="realised-gains-row white-border">
        <span className="realised-label">Effective Capital Gains:</span>
        <span className={`realised-value large ${effectiveGains < 0 ? "negative" : ""}`}>
          {effectiveGains < 0 ? "- " : ""}{formatCurrency(Math.abs(effectiveGains))}
        </span>
      </div>
      {showSavings && (
        <div className="savings-banner">
          <span className="savings-emoji">🎉</span>
          <span>
            You&apos;re going to save{" "}
            <strong>{formatCurrency(savings)}</strong>
          </span>
        </div>
      )}
    </div>
  );
}
