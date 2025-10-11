import React, { useState, useEffect } from 'react';

const Landing = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const styleSheet = document.createElement('style');
    styleSheet.innerHTML = `
      body, html {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow-x: hidden;
      }
      * {
        box-sizing: border-box;
      }
      @keyframes gridMove {
        0% { transform: translate(0, 0); }
        100% { transform: translate(50px, 50px); }
      }
      @keyframes modalSlideIn {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes typing {
        from { width: 0 }
        to { width: 100% }
      }
      @keyframes blink {
        0%, 100% { border-color: transparent }
        50% { border-color: #00f5ff }
      }
      .typewriter {
        display: inline-block;
        overflow: hidden;
        border-right: .1em solid #00f5ff;
        white-space: nowrap;
        letter-spacing: 0.05em;
        animation: typing 3s steps(30, end), blink .75s step-end infinite;
        min-width: 0;
        max-width: 100vw;
        font-size: 4vw;
        font-weight: 800;
      }
      @media (max-width: 600px) {
        .typewriter {
          font-size: 7vw;
        }
      }
      .feature-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 15px 30px rgba(0, 245, 255, 0.1);
        border-color: rgba(0, 245, 255, 0.4);
      }
      button:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      }
      input:focus {
        border-color: #00f5ff;
        box-shadow: 0 0 10px rgba(0, 245, 255, 0.3);
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const closeModals = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login submitted');
    closeModals();
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Register submitted');
    closeModals();
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundGrid}></div>
      <header style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoText}>Intellégendes</span>
        </div>
        <nav style={styles.nav}>
          <button style={styles.navButton} onClick={() => setShowLogin(true)}>Login</button>
          <button style={{ ...styles.navButton, ...styles.primaryButton }} onClick={() => setShowRegister(true)}>Register</button>
        </nav>
      </header>
      <main style={styles.main}>
        <div style={styles.hero}>
          <h1 style={styles.title} className="typewriter">
            AI-Powered Caption Generation<span style={styles.titleAccent}></span>
          </h1>
          <p style={styles.subtitle}>
            Advanced agentic AI with HFRL technology to create perfect captions for your content
          </p>
          <div style={styles.buttonGroup}>
            <button style={styles.ctaButton}>Start Creating</button>
            <button style={styles.secondaryButton}>Learn More</button>
          </div>
        </div>
        <div style={styles.features}>
          <div style={styles.featureCard} className="feature-card">
            <div style={styles.featureIcon}>🤖</div>
            <h3 style={styles.featureTitle}>Agentic AI</h3>
            <p style={styles.featureText}>Self-learning AI agents that adapt to your style</p>
          </div>
          <div style={styles.featureCard} className="feature-card">
            <div style={styles.featureIcon}>⚡</div>
            <h3 style={styles.featureTitle}>HFRL Technology</h3>
            <p style={styles.featureText}>Human Feedback Reinforcement Learning for better results</p>
          </div>
          <div style={styles.featureCard} className="feature-card">
            <div style={styles.featureIcon}>🎯</div>
            <h3 style={styles.featureTitle}>Smart Targeting</h3>
            <p style={styles.featureText}>Contextually aware captions for maximum engagement</p>
          </div>
        </div>
      </main>

      {/* Login Modal */}
      {showLogin && (
        <div style={styles.modal} onClick={closeModals}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Login</h2>
              <button style={styles.closeButton} onClick={closeModals}>×</button>
            </div>
            <form onSubmit={handleLogin} style={styles.form}>
              <input type="email" placeholder="Email" style={styles.input} required />
              <input type="password" placeholder="Password" style={styles.input} required />
              <button type="submit" style={styles.submitButton}>Login</button>
            </form>
            <p style={styles.switchText}>
              Don't have an account?
              <button style={styles.linkButton} onClick={() => { setShowLogin(false); setShowRegister(true); }}>Register</button>
            </p>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div style={styles.modal} onClick={closeModals}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Register</h2>
              <button style={styles.closeButton} onClick={closeModals}>×</button>
            </div>
            <form onSubmit={handleRegister} style={styles.form}>
              <input type="text" placeholder="Full Name" style={styles.input} required />
              <input type="email" placeholder="Email" style={styles.input} required />
              <input type="password" placeholder="Password" style={styles.input} required />
              <button type="submit" style={styles.submitButton}>Register</button>
            </form>
            <p style={styles.switchText}>
              Already have an account?
              <button style={styles.linkButton} onClick={() => { setShowRegister(false); setShowLogin(true); }}>Login</button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    width: '100vw',
    margin: 0,
    padding: 0,
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
    color: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
    backgroundSize: '50px 50px',
    animation: 'gridMove 20s linear infinite',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    position: 'relative',
    zIndex: 10,
    width: '100%',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold'
  },
  logoText: {
    background: 'linear-gradient(45deg, #00f5ff, #0080ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  nav: {
    display: 'flex',
    gap: '15px'
  },
  navButton: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#ffffff',
    padding: '10px 20px',
    borderRadius: '25px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '14px'
  },
  primaryButton: {
    background: 'linear-gradient(45deg, #00f5ff, #0080ff)',
    border: 'none'
  },
  main: {
    padding: '80px 0',
    textAlign: 'center',
    position: 'relative',
    zIndex: 10,
    width: '100%',
  },
  hero: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 20px',
  },
  title: {
    fontSize: '48px',
    fontWeight: '800',
    marginBottom: '20px',
    lineHeight: '1.2'
  },
  titleAccent: {
    background: 'linear-gradient(45deg, #00f5ff, #0080ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  subtitle: {
    fontSize: '20px',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: '40px',
    lineHeight: '1.6'
  },
  buttonGroup: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  ctaButton: {
    background: 'linear-gradient(45deg, #00f5ff, #0080ff)',
    border: 'none',
    color: '#ffffff',
    padding: '15px 30px',
    borderRadius: '30px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 30px rgba(0, 245, 255, 0.3)'
  },
  secondaryButton: {
    background: 'transparent',
    border: '2px solid rgba(255,255,255,0.3)',
    color: '#ffffff',
    padding: '15px 30px',
    borderRadius: '30px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    marginTop: '100px',
    maxWidth: '1000px',
    margin: '100px auto 0',
    padding: '0 20px'
  },
  featureCard: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '15px',
    padding: '30px',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)'
  },
  featureIcon: {
    fontSize: '40px',
    marginBottom: '20px'
  },
  featureTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '15px'
  },
  featureText: {
    color: 'rgba(255,255,255,0.7)',
    lineHeight: '1.6'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(5px)'
  },
  modalContent: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    borderRadius: '15px',
    padding: '30px',
    width: '90%',
    maxWidth: '400px',
    border: '1px solid rgba(255,255,255,0.1)',
    animation: 'modalSlideIn 0.3s ease'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px'
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '600',
    margin: 0
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '5px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  input: {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    padding: '15px',
    color: '#ffffff',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.3s ease'
  },
  submitButton: {
    background: 'linear-gradient(45deg, #00f5ff, #0080ff)',
    border: 'none',
    color: '#ffffff',
    padding: '15px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '10px'
  },
  switchText: {
    textAlign: 'center',
    marginTop: '20px',
    color: 'rgba(255,255,255,0.7)'
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#00f5ff',
    cursor: 'pointer',
    textDecoration: 'underline',
    marginLeft: '5px'
  }
};

export default Landing;