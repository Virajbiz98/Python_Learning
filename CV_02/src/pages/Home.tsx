import { 
  FileText, Pencil, Download, LayoutGrid, Globe, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroSphere from '../components/home/HeroSphere';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: any;
  color?: string;
}

function FeatureCard({
  title,
  description,
  icon: Icon,
  color = '#008000',
}: FeatureCardProps) {
  return (
    <div className="card p-6 transition-all duration-300 hover:border-primary-500/50 hover:blue-glow group relative overflow-hidden hover:translate-y-[-4px] hover:border-blue-500 hover:shadow-blue-500 cursor-pointer hover-3d floating" style={{ perspective: '1000px' }}>
      <div className="absolute inset-0 opacity-10">
        {/* <FeatureCanvas color={color} /> */}
      </div>
      <div className="relative z-10">
        <div className="p-3 bg-primary-500/10 rounded-lg inline-flex mb-4 group-hover:bg-primary-500/30 transition-colors">
          <Icon className="h-6 w-6 text-primary-500" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
}


interface Feature {
  title: string;
  description: string;
  icon: any;
  color: string;
}

const featuresData: Feature[] = [
  {
    title: "Professional Templates",
    description: "Choose from a variety of professionally designed templates to showcase your skills and experience.",
    icon: FileText,
    color: "#008000",
  },
  {
    title: "Easy Editing",
    description: "Intuitive interface makes it simple to add, edit, and organize your resume content.",
    icon: Pencil,
    color: "#008000",
  },
  {
    title: "PDF Export",
    description: "Download your resume as a professional PDF file ready to share with potential employers.",
    icon: Download,
    color: "#008000",
  },
  {
    title: "Customizable Sections",
    description: "Add or remove sections to tailor your CV to specific job applications.",
    icon: LayoutGrid,
    color: "#008000",
  },
  {
    title: "Multi-language Support",
    description: "Create CVs in multiple languages to apply for international positions.",
    icon: Globe,
    color: "#008000",
  },
  {
    title: "Privacy First",
    description: "Your data is secure and never shared with third parties without your consent.",
    icon: ShieldCheck,
    color: "#008000",
  },
];

function FeatureGrid() {
  const [features, setFeatures] = useState(featuresData);
  const featureGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          } else {
            entry.target.classList.remove('in-view');
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    if (featureGridRef.current) {
      observer.observe(featureGridRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={featureGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature) => (
        <FeatureCard
          key={feature.title}
          title={feature.title}
          description={feature.description}
          icon={feature.icon}
          color={feature.color}
        />
      ))}
    </div>
  );
}

function Home() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const { ref: heroRef, inView: heroInView } = useInView({
    triggerOnce: true,
    rootMargin: '-50px 0px',
  });

  const { ref: featuresRef, inView: featuresInView } = useInView({
    triggerOnce: true,
    rootMargin: '-50px 0px',
  });

  const { ref: ctaRef, inView: ctaInView } = useInView({
    triggerOnce: true,
    rootMargin: '-50px 0px',
  });

  useEffect(() => {
    // Simulate content load delay
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className={`relative overflow-hidden py-20 sm:py-32 ${isLoading ? 'loading-animation' : ''} ${heroInView ? 'scroll-fade-in' : 'scroll-fade-out'}`} style={{ background: 'linear-gradient(to bottom, rgba(0, 16, 0, 0.3), rgba(0, 32, 0, 0.3), rgba(0, 48, 0, 0.3))' }}>
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Build Your{' '}
                <span className="text-primary-500 inline-block relative">
                  Professional CV
                </span>{' '}
                in Minutes
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                Create standout resumes with our intuitive builder. Choose
                from beautiful templates, customize to your needs, and
                export to PDF instantly.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to={user ? '/dashboard' : '/register'}
                  className="btn btn-primary"
                >
                  Get Started Free
                </Link>
                <Link to={user ? '/dashboard' : '/login'} className="btn btn-secondary">
                  Sign In
                </Link>
              </div>
            </div>
            <div className="relative w-full h-80 sm:h-[500px] flex items-center justify-center order-first lg:order-last">
              <div className="orbit-container w-full h-full">
                <HeroSphere />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className={`py-20 ${isLoading ? 'loading-animation' : ''} ${featuresInView ? 'scroll-fade-in' : 'scroll-fade-out'}`} id="features" style={{ background: 'linear-gradient(to bottom, rgba(0, 16, 0, 0.3), rgba(0, 32, 0, 0.3), rgba(0, 48, 0, 0.3))' }}>
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Powerful <span className="text-primary-500">Features</span> for Your CV
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Everything you need to create professional, standout resumes that help you
              land your dream job.
            </p>
          </div>
          {/* Features Section */}
          <FeatureGrid />
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className={`py-16 ${isLoading ? 'loading-animation' : ''} ${ctaInView ? 'scroll-fade-in' : 'scroll-fade-out'}`} style={{ background: 'linear-gradient(to bottom, rgba(0, 16, 0, 0.3), rgba(0, 32, 0, 0.3), rgba(0, 48, 0, 0.3))' }}>
        <div className="container">
          <div className="glass-panel p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Build Your Professional CV?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers who have successfully created standout
              resumes with ShimmerCV's intuitive builder.
            </p>
            <Link
              to={user ? '/dashboard' : '/register'}
              className="btn btn-primary text-base px-6 py-3"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
