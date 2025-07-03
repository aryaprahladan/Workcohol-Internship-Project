import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [msg, setMsg] = useState('');
  const router = useRouter();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async e => {
  e.preventDefault();
  setMsg('');
  try {
    const res = await fetch('http://localhost:8000/api/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: form.username,
        password: form.password
      })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      //setMsg('Login successful!');
      // Save token for authenticated requests
      localStorage.setItem('token', data.token);
      //Redirect to home or pitches page
      router.push('/pitches');
    } else {
      setMsg('Login failed: ' + (data.error || data.non_field_errors || 'Invalid credentials'));
    }
  } catch (err) {
    setMsg('Login failed: ' + err.message);
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
        <form className="register-card" onSubmit={handleSubmit} style={{paddingTop: 0}}>
          <div className="login-title">Login to PitchPlatform</div>
          <label>
            Username
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit" className="login-btn">Login</button>
          <hr style={{margin: "18px 0 10px 0"}} />
          <div style={{textAlign: "center", marginBottom: "8px"}}>Don't have an account?</div>
          <a href="/register?type=founder" className="login-link login-link-blue">Register as Founder</a>
          <a href="/register?type=investor" className="login-link login-link-green">Register as Investor</a>
          {msg && <p className="register-msg">{msg}</p>}
        </form>
      </main>
      <footer className="register-footer">
        © 2025 Startup Pitch Platform. All rights reserved.
      </footer>
      <style jsx>{`
        .login-title {
          background: #1976d2;
          color: #fff;
          font-size: 1.5rem;
          font-weight: 600;
          padding: 16px 0 16px 18px;
          border-radius: 6px 6px 0 0;
          margin: -32px -36px 24px -36px;
        }
        .login-btn {
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
        .login-btn:hover {
          background: #1256a3;
        }
        .login-link {
          display: block;
          width: 100%;
          text-align: center;
          padding: 8px 0;
          margin-bottom: 8px;
          border-radius: 4px;
          font-weight: 500;
          text-decoration: none;
          border: 1.5px solid #1976d2;
          transition: background 0.2s, color 0.2s;
        }
        .login-link-blue {
          color: #1976d2;
          background: #fff;
        }
        .login-link-blue:hover {
          background: #e3f0ff;
        }
        .login-link-green {
          color: #388e3c;
          border-color: #388e3c;
          background: #fff;
        }
        .login-link-green:hover {
          background: #e6f7ea;
        }
      `}</style>
    </div>
  );
}