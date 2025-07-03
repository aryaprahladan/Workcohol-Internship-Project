import { useEffect, useState } from "react";

export default function Home() {
  const [pitches, setPitches] = useState([]);
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    // Fetch startup pitches
    fetch("http://localhost:8000/api/pitches/")
      .then((res) => res.json())
      .then((data) => setPitches(Array.isArray(data) ? data : []));

    // Fetch investor pitching details
    fetch("http://localhost:8000/api/investments/")
      .then((res) => res.json())
      .then((data) => setInvestments(Array.isArray(data) ? data : []));
  }, []);

  return (
    <div style={{ padding: "32px" }}>
      <h2>Featured Startups</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginBottom: "40px" }}>
        {pitches.length === 0 && <p>No startups found.</p>}
        {pitches.map((pitch) => (
          <div
            key={pitch.id}
            style={{
              background: "#fff",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              padding: 22,
              minWidth: 320,
              maxWidth: 350,
              marginBottom: 18,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h4 style={{ color: "#1976d2" }}>{pitch.name}</h4>
            <div style={{ fontSize: "0.97rem", color: "#444", marginBottom: 8 }}>
              <span>
                <b>Industry:</b> {pitch.industry}
              </span>
              <br />
              <span>
                <b>Stage:</b> {pitch.stage}
              </span>
              <br />
              <span>
                <b>Funding:</b> {pitch.funding}
              </span>
              <br />
              <span>
                <b>Goal:</b> {pitch.goal}
              </span>
              <br />
              <span>
                <b>Date:</b> {pitch.date}
              </span>
            </div>
            <p>{pitch.description}</p>
          </div>
        ))}
      </div>

      <h2>Investor Pitching Details</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
        {Array.isArray(investments) && investments.length === 0 && <p>No investor pitching details found.</p>}
        {Array.isArray(investments) &&
          investments.map((inv) => (
            <div
              key={inv.id}
              style={{
                background: "#f9f9f9",
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                padding: 20,
                minWidth: 320,
                maxWidth: 350,
                marginBottom: 18,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h4 style={{ color: "#388e3c" }}>
                Investor: {inv.investor_username || inv.investor || "Anonymous"}
              </h4>
              <div style={{ fontSize: "0.97rem", color: "#444", marginBottom: 8 }}>
                <span>
                  <b>Startup:</b> {inv.pitch_name || (inv.pitch && inv.pitch.name) || inv.pitch}
                </span>
                <br />
                <span>
                  <b>Amount:</b> {inv.amount}
                </span>
                <br />
                <span>
                  <b>Status:</b> {inv.approved ? "Approved" : "Pending"}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}