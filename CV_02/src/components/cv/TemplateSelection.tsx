import { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { generateCVSuggestions } from '../../lib/gemini';
import { JobAnalyzer } from './JobAnalyzer';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { UserProfile } from '../../types/database.types';

interface TemplateSelectionProps {
  title: string;
  setTitle: (title: string) => void;
  template: string;
  setTemplate: (template: string) => void;
  onAutoCreate?: (suggestions: any) => void;
}

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, professional design with a modern touch',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional layout, perfect for conservative industries',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold design for creative professionals',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Simple, elegant design focusing on content',
  },
];

function TemplateSelection({ title, setTitle, template, setTemplate, onAutoCreate }: TemplateSelectionProps) {
  const { user } = useAuth();
  const [showJobAnalyzer, setShowJobAnalyzer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleJobAnalysis = async (suggestions: any) => {
    if (!user) {
      toast.error('Please log in to create a CV');
      return;
    }

    setIsLoading(true);
    try {
      // Get user profile
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!userProfile) {
        toast.error('Please complete your profile first');
        return;
      }

      // Generate CV with AI suggestions
      if (onAutoCreate) {
        onAutoCreate(suggestions);
      }

      setShowJobAnalyzer(false);
      toast.success('CV template created with your profile data!');
    } catch (error) {
      console.error('Error creating CV:', error);
      toast.error('Failed to create CV');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Create Your CV</h2>
        <p className="text-gray-400 mb-6">
          Start with a template, or let AI help you create a targeted CV.
        </p>
      </div>

      {/* Auto-create section */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="flex items-center gap-4 mb-4">
          <Wand2 className="text-primary-500" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-white">Auto-Create CV</h3>
            <p className="text-gray-400">Let AI help you create a targeted CV using your profile</p>
          </div>
        </div>
        
        {showJobAnalyzer ? (
          <div className="mt-4">
            <JobAnalyzer onSuggestionsGenerated={handleJobAnalysis} />
            <button
              type="button"
              onClick={() => setShowJobAnalyzer(false)}
              className="btn btn-ghost mt-4"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowJobAnalyzer(true)}
            className="btn btn-outline w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Analyze Job Description'}
          </button>
        )}
      </div>

      {/* Manual template selection */}
      <div className="border-t border-gray-700 pt-8">
        <h3 className="text-xl font-semibold text-white mb-4">Or Choose a Template</h3>
        <div className="mb-6">
          <label htmlFor="cv-title" className="block text-sm font-medium text-gray-300 mb-2">
            CV Title
          </label>
          <input
            type="text"
            id="cv-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            placeholder="e.g., My Professional CV"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((t) => (
            <div
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                template === t.id
                  ? 'border-primary-500 bg-primary-500/10 shadow-glow'
                  : 'border-dark-700 bg-dark-800 hover:border-primary-500/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 ${
                    template === t.id
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-500'
                  }`}
                />
                <div>
                  <h3 className="font-semibold text-white">{t.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{t.description}</p>
                  <div className="mt-3 h-24 bg-dark-700 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TemplateSelection;