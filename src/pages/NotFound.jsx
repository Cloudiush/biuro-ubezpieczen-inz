import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container" style={{ 
      textAlign: 'center', 
      padding: '100px 20px', 
      minHeight: '60vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>
      <h1 className="anim-slide-up" style={{ fontSize: '5rem', color: 'var(--secondary)', marginBottom: '10px' }}>
        404
      </h1>
      
      <h2 className="anim-slide-up delay-100" style={{ marginBottom: '20px', fontSize: '2rem' }}>
        Nie znaleziono strony
      </h2>
      
      <p className="anim-slide-up delay-200" style={{ color: 'var(--text-muted)', marginBottom: '40px', maxWidth: '500px' }}>
        Przepraszamy, ale strona o podanym adresie nie istnieje, została usunięta lub jest chwilowo niedostępna. Prosimy upewnić się, że wprowadzony adres URL jest poprawny.
      </p>
      
      <div className="anim-slide-up delay-300">
        <Link to="/" className="btn-primary" style={{ padding: '15px 40px', display: 'inline-block', width: 'auto' }}>
          &larr; Powrót na stronę główną
        </Link>
      </div>
    </div>
  );
};

export default NotFound;