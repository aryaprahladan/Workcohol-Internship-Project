import { useState } from 'react';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    password2: ''
  });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    setError('');
    if (form.password !== form.password2) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const res = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          phone: form.phone,
          password: form.password
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Registration successful! You can now log in.');
      } else {
        setError(data.error || JSON.stringify(data));
      }
    } catch (err) {
      setError('Registration failed: ' + err.message);
    }
  };

  return (
    <div className="register-bg">
      <header className="register-header">
        <span className="logo">StartupPitch</span>
        <nav>
          <a href="/login">Login</a>
          <a href="/register">Sign Up</a>
        </nav>
      </header>
      <main className="register-main">
        <form className="register-card" onSubmit={handleSubmit}>
          <h2>Register</h2>
          <label>
            Username:
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              maxLength={150}
              pattern="[A-Za-z0-9@.+-_]+"
              title="Letters, digits and @/./+/-/_ only."
            />
            <span className="input-help">
              Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
            </span>
          </label>
          <label>
            Email:
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Phone:
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Password:
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <ul className="input-help-list">
              <li>Your password can’t be too similar to your other personal information.</li>
              <li>Your password must contain at least 8 characters.</li>
              <li>Your password can’t be a commonly used password.</li>
              <li>Your password can’t be entirely numeric.</li>
            </ul>
          </label>
          <label>
            Password confirmation:
            <input
              name="password2"
              type="password"
              value={form.password2}
              onChange={handleChange}
              required
            />
            <span className="input-help">
              Enter the same password as before, for verification.
            </span>
          </label>
          <button type="submit">Sign up</button>
          {msg && <p className="register-msg" style={{ color: "green" }}>{msg}</p>}
          {error && <p className="register-msg" style={{ color: "red" }}>{error}</p>}
        </form>
      </main>
      <footer className="register-footer">
        © 2025 Startup Pitch Platform. All rights reserved.
      </footer>
    </div>
  );
}