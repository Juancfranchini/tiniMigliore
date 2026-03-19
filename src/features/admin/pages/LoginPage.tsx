import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import logopanel from '../../../assets/icon.png';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Por favor, ingresá usuario y contraseña.');
      return;
    }

    const success = login(username, password);

    if (success) {
      navigate('/admin');
    } else {
      setError('Credenciales incorrectas. Verificá y volvé a intentar.');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: 'var(--color-brand-crema)',
      padding: '1rem'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 10px 30px rgba(167, 138, 166, 0.15)',
        padding: '2.5rem',
        textAlign: 'center'
      }}>
        
        <img 
          src={logopanel} 
          alt="Tini Migliore Panel" 
          style={{ 
            width: '180px', 
            height: 'auto', 
            margin: '0 auto 2rem',
            display: 'block',
            objectFit: 'contain'
          }} 
        />


        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
          
          <Input 
            label="Usuario"
            type="text"
            placeholder="Ingresá tu usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input 
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div style={{ 
              color: 'var(--color-error)', 
              fontSize: '0.875rem', 
              backgroundColor: '#FEE2E2', 
              padding: '0.75rem', 
              borderRadius: 'var(--radius-md)',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            style={{ 
              marginTop: '0.5rem',
              backgroundColor: 'var(--color-brand-acento)',
              width: '100%',
              borderRadius: 'var(--radius-full)'
            }}
            size="lg"
          >
            Iniciar Sesión
          </Button>
        </form>

        <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          Este acceso es exclusivo para administración.
        </p>

      </div>
    </div>
  );
}
