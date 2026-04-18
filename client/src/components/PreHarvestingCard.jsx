import { formatCurrency } from "../utils/formatters";
import "./CapitalGainsCard.css";

export default function PreHarvestingCard({ capitalGains, loading }) {
  if (loading) {
    return (
      <div className="card pre-harvesting-card">
        <div className="card-loader">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-row" />
          <div className="skeleton skeleton-row" />
          <div className="skeleton skeleton-row" />
          <div className="skeleton skeleton-total" />
        </div>
      </div>
    );
  }

  const { stcg, ltcg } = capitalGains.capitalGains;
  const stcgNet = stcg.profits - stcg.losses;
  const ltcgNet = ltcg.profits - ltcg.losses;
  const realisedGains = stcgNet + ltcgNet;

  return (
    <div className="card pre-harvesting-card">
      <h2 className="card-title">Pre Harvesting</h2>
      <table className="gains-table">
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
            <td className="loss-value">- {formatCurrency(stcg.losses)}</td>
            <td className="loss-value">- {formatCurrency(ltcg.losses)}</td>
          </tr>
          <tr className="net-row">
            <td className="row-label">Net Capital Gains</td>
            <td className={stcgNet < 0 ? "loss-value bold" : "bold"}>{formatCurrency(stcgNet)}</td>
            <td className={ltcgNet < 0 ? "loss-value bold" : "bold"}>{formatCurrency(ltcgNet)}</td>
          </tr>
        </tbody>
      </table>
      <div className="realised-gains-row">
        <span className="realised-label">Realised Capital Gains:</span>
        <span className="realised-value">{formatCurrency(realisedGains)}</span>
      </div>
    </div>
  );
}
