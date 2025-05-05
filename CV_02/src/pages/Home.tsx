import { 
  FileText, Pencil, Download, LayoutGrid, Globe, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroSphere from '../components/home/HeroSphere';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

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
  color = '#1E3A8A',
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
    color: "#1E3A8A",
  },
  {
    title: "Easy Editing",
    description: "Intuitive interface makes it simple to add, edit, and organize your resume content.",
    icon: Pencil,
    color: "#1E40AF",
  },
  {
    title: "PDF Export",
    description: "Download your resume as a professional PDF file ready to share with potential employers.",
    icon: Download,
    color: "#2563EB",
  },
  {
    title: "Customizable Sections",
    description: "Add or remove sections to tailor your CV to specific job applications.",
    icon: LayoutGrid,
    color: "#3B82F6",
  },
  {
    title: "Multi-language Support",
    description: "Create CVs in multiple languages to apply for international positions.",
    icon: Globe,
    color: "#60A5FA",
  },
  {
    title: "Privacy First",
    description: "Your data is secure and never shared with third parties without your consent.",
    icon: ShieldCheck,
    color: "#93C5FD",
  },
];

function FeatureGrid() {
  const [features, setFeatures] = useState(featuresData);

  useEffect(() => {
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32" style={{ background: 'linear-gradient(to bottom, rgba(0, 16, 0, 0.6), rgba(0, 32, 0, 0.6), rgba(0, 48, 0, 0.6))' }}>
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
      <section className="py-20" id="features" style={{ background: 'linear-gradient(to bottom, rgba(0, 16, 0, 0.6), rgba(0, 32, 0, 0.6), rgba(0, 48, 0, 0.6))' }}>
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
      <section className="py-16" style={{ background: 'linear-gradient(to bottom, rgba(0, 16, 0, 0.6), rgba(0, 32, 0, 0.6), rgba(0, 48, 0, 0.6))' }}>
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