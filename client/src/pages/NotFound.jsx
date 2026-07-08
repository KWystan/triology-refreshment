import { Link } from 'react-router-dom';
import { Button } from '../components';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-headline)',
          fontSize: 'clamp(4rem, 10vw, 6rem)',
          fontWeight: 800,
          lineHeight: 1,
          color: 'var(--color-primary-container)',
          marginBottom: '1rem',
        }}
      >
        404
      </h1>
      <p
        style={{
          fontSize: '1.125rem',
          color: 'var(--color-on-surface-variant)',
          marginBottom: '2rem',
          maxWidth: '400px',
        }}
      >
        The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
      </p>
      <Button variant="primary" size="lg" as={Link} to="/">
        Back to Home
      </Button>
    </div>
  );
}
