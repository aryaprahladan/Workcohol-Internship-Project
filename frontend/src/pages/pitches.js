import { useEffect, useState } from "react";

const INDUSTRIES = [
  "",
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Other"
];
const STAGES = [
  "",
  "Idea",
  "Prototype",
  "Early Revenue",
  "Growth",
  "Mature"
];

export default function Pitches() {
  const [pitches, setPitches] = useState([]);
  const [filteredPitches, setFilteredPitches] = useState([]);
  const [filters, setFilters] = useState({
    industry: "",
    stage: "",
    name: "",
    funding: "",
    minGoal: "",
    maxGoal: "",
    dateFrom: "",
    dateTo: ""
  });
  const [newPitch, setNewPitch] = useState({
    name: "",
    industry: "",
    stage: "",
    funding: "",
    goal: "",
    date: "",
    description: ""
  });
  const [addError, setAddError] = useState("");
  const [investError, setInvestError] = useState({});

  useEffect(() => {
    fetch("http://localhost:8000/api/pitches/")
      .then((res) => res.json())
      .then((data) => {
        setPitches(Array.isArray(data) ? data : []);
        setFilteredPitches(Array.isArray(data) ? data : []);
      });
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApply = (e) => {
    e.preventDefault();
    let filtered = pitches.filter((pitch) => {
      return (
        (filters.industry === "" || pitch.industry === filters.industry) &&
        (filters.stage === "" || pitch.stage === filters.stage) &&
        (filters.name === "" || pitch.name.toLowerCase().includes(filters.name.toLowerCase())) &&
        (filters.funding === "" || pitch.funding === filters.funding) &&
        (filters.goal === "" || pitch.goal === filters.goal) &&
        (filters.minGoal === "" || parseFloat(pitch.goal) >= parseFloat(filters.minGoal)) &&
        (filters.maxGoal === "" || parseFloat(pitch.goal) <= parseFloat(filters.maxGoal)) &&
        (filters.dateFrom === "" || pitch.date >= filters.dateFrom) &&
        (filters.dateTo === "" || pitch.date <= filters.dateTo)
      );
    });
    setFilteredPitches(filtered);
  };

  const handleNewPitchChange = (e) => {
    setNewPitch({ ...newPitch, [e.target.name]: e.target.value });
  };

  const handleAddPitch = async (e) => {
    e.preventDefault();
    setAddError("");
    try {
      const res = await fetch("http://localhost:8000/api/pitches/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newPitch)
      });
      if (!res.ok) throw new Error("Failed to add pitch");
      setNewPitch({
        name: "",
        industry: "",
        stage: "",
        funding: "",
        goal: "",
        date: "",
        description: ""
      });
      // Refetch pitches
      const data = await fetch("http://localhost:8000/api/pitches/").then((r) => r.json());
      setPitches(Array.isArray(data) ? data : []);
      setFilteredPitches(Array.isArray(data) ? data : []);
    } catch (err) {
      setAddError(err.message);
    }
  };

  // Investment form handler for each pitch
  const handleInvest = async (e, pitchId) => {
    e.preventDefault();
    const amount = e.target.amount.value;
    setInvestError({});
    try {
      const res = await fetch("http://localhost:8000/api/investments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          pitch: pitchId,
          amount: amount,
          approved: false
        })
      });
      if (!res.ok){
        const errorData = await res.json();
        console.log(errorData);
        throw new Error("Failed to invest");
      } 
      e.target.reset();
      alert("Investment submitted!");
    } catch (err) {
      setInvestError((prev) => ({ ...prev, [pitchId]: err.message }));
    }
  };

  return (
    <div className="pitches-container">
      <aside className="pitches-sidebar">
        <form onSubmit={handleAddPitch} style={{ marginBottom: 24, background: "#f5f7fa", padding: 12, borderRadius: 6 }}>
          <h3> Add StartUps</h3>
          <label>
            Name:
            <input name="name" value={newPitch.name} onChange={handleNewPitchChange} required />
          </label>
          <label>
            Industry:
            <select name="industry" value={newPitch.industry} onChange={handleNewPitchChange} required>
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind ? ind : "---------"}
                </option>
              ))}
            </select>
          </label>
          <label>
            Stage:
            <select name="stage" value={newPitch.stage} onChange={handleNewPitchChange} required>
              {STAGES.map((st) => (
                <option key={st} value={st}>
                  {st ? st : "---------"}
                </option>
              ))}
            </select>
          </label>
          <label>
            Funding:
            <input name="funding" value={newPitch.funding} onChange={handleNewPitchChange} required />
          </label>
          <label>
            Goal:
            <input name="goal" value={newPitch.goal} onChange={handleNewPitchChange} required />
          </label>
          <label>
            Date:
            <input type="date" name="date" value={newPitch.date} onChange={handleNewPitchChange} required />
          </label>
          <label>
            Description:
            <input name="description" value={newPitch.description} onChange={handleNewPitchChange} required />
          </label>
          <button type="submit" className="pitches-apply-btn">
            Add
          </button>
          {addError && <div style={{ color: "red", marginTop: 4 }}>{addError}</div>}
        </form>
      </aside>
      <main className="pitches-main">
        {filteredPitches.map((pitch) => (
          <div className="pitch-card" key={pitch.id}>
            <h4>{pitch.name}</h4>
            <div className="pitch-meta">
              <span>
                <b>Industry:</b> {pitch.industry}
              </span>
              <span>
                <b>Stage:</b> {pitch.stage}
              </span>
              <span>
                <b>Funding:</b> {pitch.funding}
              </span>
              <span>
                <b>Goal:</b> {pitch.goal}
              </span>
              <span>
                <b>Date:</b> {pitch.date}
              </span>
            </div>
            <p>{pitch.description}</p>
            {/* Investment form */}
            <form onSubmit={(e) => handleInvest(e, pitch.id)} style={{ marginTop: 10 }}>
              <input
                type="number"
                name="amount"
                placeholder="Investment Amount"
                min="1"
                required
                style={{ width: "70%", marginRight: 8 }}
              />
              <button type="submit" className="pitch-invest-btn">
                Invest
              </button>
              {investError[pitch.id] && (
                <div style={{ color: "red", marginTop: 4 }}>{investError[pitch.id]}</div>
              )}
            </form>
          </div>
        ))}
      </main>
      <style jsx>{`
        .pitches-container {
          display: flex;
          margin: 40px 0 0 0;
        }
        .pitches-sidebar {
          width: 320px;
          background: #fafbfc;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          padding: 24px 18px 18px 18px;
          margin-left: 40px;
          margin-right: 32px;
          height: fit-content;
        }
        .pitches-sidebar h3 {
          margin-bottom: 18px;
          font-size: 1.2rem;
        }
        .pitches-sidebar label {
          display: block;
          margin-bottom: 12px;
          font-size: 1rem;
        }
        .pitches-sidebar input,
        .pitches-sidebar select {
          width: 100%;
          margin-top: 4px;
          margin-bottom: 2px;
          padding: 6px 8px;
          border: 1px solid #bbb;
          border-radius: 4px;
          font-size: 1rem;
          background: #fff;
        }
        .pitches-apply-btn {
          background: #1976d2;
          color: #fff;
          border: none;
          border-radius: 4px;
          padding: 10px 0;
          width: 100%;
          font-size: 1.1rem;
          font-weight: 600;
          margin-top: 10px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .pitches-apply-btn:hover {
          background: #1256a3;
        }
        .pitches-main {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
        }
        .pitch-card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          padding: 22px 24px 18px 24px;
          min-width: 320px;
          max-width: 350px;
          margin-bottom: 18px;
          display: flex;
          flex-direction: column;
        }
        .pitch-card h4 {
          margin-bottom: 10px;
          font-size: 1.2rem;
          color: #1976d2;
        }
        .pitch-meta {
          font-size: 0.97rem;
          color: #444;
          margin-bottom: 8px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px 18px;
        }
        .pitch-invest-btn {
          background: #1976d2;
          color: #fff;
          border: none;
          border-radius: 4px;
          padding: 8px 0;
          width: 100%;
          font-size: 1rem;
          font-weight: 600;
          margin-top: 10px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .pitch-invest-btn:hover {
          background: #1256a3;
        }
      `}</style>
    </div>
  );
}