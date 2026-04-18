import { useState } from "react";
import "./ImportantNotes.css";
import { ChevronDown, ChevronUp, Info } from "lucide-react"

const NOTES = [
  "Tax-loss harvesting is currently not allowed under Indian tax regulations. Please consult your tax advisor before making any decisions.",
  "Tax harvesting does not apply to derivatives or futures. These are handled separately as business income under tax rules.",
  "Price and market value data is fetched from Coingecko, not from individual exchanges. As a result, values may slightly differ from the ones on your exchange.",
  "Some countries do not have a short-term / long-term bifurcation. For now, we are calculating everything as long-term.",
  "Only realized losses are considered for harvesting. Unrealized losses in held assets are not counted.",
];

export default function ImportantNotes() {
  const [open, setOpen] = useState(false);

  return (
    <div className={`important-notes ${open ? "open" : ""}`}>
      <button
        className="important-notes-header"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <div className="important-notes-title">
          <span className="info-icon"><Info /></span>
          <span>Important Notes &amp; Disclaimers</span>
        </div>
        <span className={`chevron ${open ? "up" : "down"}`}>{open ? <ChevronUp /> : <ChevronDown />}</span>
      </button>
      {open && (
        <div className="important-notes-body">
          <ul>
            {NOTES.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
