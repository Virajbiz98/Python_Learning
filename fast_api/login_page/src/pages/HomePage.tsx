import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import CTA from '../components/home/CTA';

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;