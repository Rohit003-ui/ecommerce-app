import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: '3rem auto' }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required style={styles.input} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={styles.input} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required style={styles.input} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={styles.btn}>Create Account</button>
      </form>
    </div>
  );
}

const styles = {
  input: { display: 'block', width: '100%', padding: '0.5rem', marginBottom: '1rem' },
  btn: { width: '100%', padding: '0.6rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
};
