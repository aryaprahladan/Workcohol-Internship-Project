export default function PitchCard({ pitch }) {
  return (
    <div>
      <h3>{pitch.company_name}</h3>
      <p>{pitch.idea}</p>
      <p>Amount Requested: {pitch.amount_requested}</p>
      <p>Approved: {pitch.approved ? 'Yes' : 'No'}</p>
    </div>
  );
}