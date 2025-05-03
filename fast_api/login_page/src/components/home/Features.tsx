import { 
  FileText, 
  Download, 
  Edit, 
  Layout, 
  Globe, 
  Shield 
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="glass-panel p-6 rounded-xl transition-transform hover:scale-105">
      <div className="bg-primary/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function Features() {
  const features = [
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: "Professional Templates",
      description: "Choose from a variety of professionally designed templates to showcase your skills and experience."
    },
    {
      icon: <Edit className="h-6 w-6 text-primary" />,
      title: "Easy Editing",
      description: "Intuitive interface makes it simple to add, edit, and organize your resume content."
    },
    {
      icon: <Download className="h-6 w-6 text-primary" />,
      title: "PDF Export",
      description: "Download your resume as a professional PDF file ready to share with potential employers."
    },
    {
      icon: <Layout className="h-6 w-6 text-primary" />,
      title: "Customizable Sections",
      description: "Add or remove sections to tailor your CV to specific job applications."
    },
    {
      icon: <Globe className="h-6 w-6 text-primary" />,
      title: "Multi-language Support",
      description: "Create CVs in multiple languages to apply for international positions."
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Privacy First",
      description: "Your data is secure and never shared with third parties without your consent."
    }
  ];

  return (
    <section className="py-20" id="features">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful <span className="glow-text text-primary">Features</span> for Your CV
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Everything you need to create professional, standout resumes that help you land your dream job.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;