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

function App() {
  useEffect(() => {
    try {
      initMainLogic();
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
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
  );
}

export default App;
