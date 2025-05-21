import { useState, useEffect } from 'react';
import { Lightbulb, AlertCircle, CheckSquare, FileText, Target } from 'lucide-react';
import { generateCVSuggestions } from '../../lib/gemini';
import type { CVSuggestion } from '../../lib/gemini';
import type { UserProfile } from '../../types/database.types';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface JobAnalyzerProps {
  onSuggestionsGenerated: (suggestions: CVSuggestion) => void;
}

export function JobAnalyzer({ onSuggestionsGenerated }: JobAnalyzerProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<CVSuggestion | null>(null);

  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (error) throw error;
      if (data) {
        setUserProfile(data as UserProfile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      toast.error('Failed to load user profile');
    }
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    if (!userProfile) {
      setError('Please complete your profile first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const suggestions = await generateCVSuggestions(jobDescription, userProfile);
      setAnalysis(suggestions);
      onSuggestionsGenerated(suggestions);
    } catch (err) {
      setError('Failed to analyze job description. Please try again.');
      console.error('Error analyzing job:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label 
            htmlFor="jobDescription" 
            className="block text-sm font-medium text-gray-200 mb-2"
          >
            Job Description
          </label>
          <textarea
            id="jobDescription"
            rows={6}
            className="w-full px-3 py-2 text-gray-200 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle size={16} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="w-full px-4 py-2 text-white bg-primary-500 rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Job Description'}
        </button>
      </div>

      {analysis && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Key Skills */}
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="text-primary-500" size={20} />
                <h3 className="text-lg font-semibold text-gray-200">Key Skills Required</h3>
              </div>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                {analysis.keySkills.map((skill: string, index: number) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>

            {/* Qualifications */}
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <CheckSquare className="text-primary-500" size={20} />
                <h3 className="text-lg font-semibold text-gray-200">Required Qualifications</h3>
              </div>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                {analysis.qualifications.map((qual: string, index: number) => (
                  <li key={index}>{qual}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Responsibilities */}
          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Target className="text-primary-500" size={20} />
              <h3 className="text-lg font-semibold text-gray-200">Core Responsibilities</h3>
            </div>              <ul className="list-disc list-inside space-y-1 text-gray-300">
                {analysis.responsibilities.map((resp: string, index: number) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
          </div>

          {/* Strength Analysis */}
          {analysis.strengthsAnalysis && (
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="text-primary-500" size={20} />
                <h3 className="text-lg font-semibold text-gray-200">CV Recommendations</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Strong Matches</h4>
                  <ul className="list-disc list-inside space-y-1 text-green-400">
                    {analysis.strengthsAnalysis.matches.map((match: string, index: number) => (
                      <li key={index}>{match}</li>
                    ))}
                  </ul>
                </div>
                {analysis.strengthsAnalysis.gaps.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Areas to Highlight</h4>
                    <ul className="list-disc list-inside space-y-1 text-yellow-400">
                      {analysis.strengthsAnalysis.gaps.map((gap: string, index: number) => (
                        <li key={index}>{gap}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Recommendations</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-300">
                    {analysis.strengthsAnalysis.recommendations.map((rec: string, index: number) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
