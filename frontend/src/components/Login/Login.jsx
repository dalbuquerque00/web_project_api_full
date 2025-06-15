import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../blocks/auth.css';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formData.email, formData.password);
  };

  return (
    <div className="auth">
      <h2 className="auth__title">Iniciar sessão</h2>
      <form className="auth__form" onSubmit={handleSubmit}>
        <input
          className="auth__input"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          className="auth__input"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Palavra-Passe"
          required
        />
        <button className="auth__submit" type="submit">
          Iniciar sessão
        </button>
      </form>
      <div className="auth__login">
        <p>Ainda não tem conta ?<Link to="/signup" className="auth__login-link">Cadastre-se</Link></p>
      </div>
    </div>
  );
}

export default Login;