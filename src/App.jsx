import React, { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Team from './components/Team';
import Locations from './components/Locations';
import Services from './components/Services';
import Stories from './components/Stories';
import FAQ from './components/FAQ';
import Book from './components/Book';
import Footer from './components/Footer';

import initMainLogic from './main-logic.js';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '60px 20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2>Something went wrong while rendering.</h2>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              marginTop: '16px',
              cursor: 'pointer',
              borderRadius: '8px',
              background: '#0D7C66',
              color: '#fff',
              border: 'none',
              fontWeight: 600
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  useEffect(() => {
    try {
      initMainLogic();
    } catch (e) {
      console.error('initMainLogic error:', e);
    }
  }, []);

  return (
    <ErrorBoundary>
      <div className="App">
        <Header />
        <Hero />
        <Team />
        <Locations />
        <Services />
        <Stories />
        <FAQ />
        <Book />
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;