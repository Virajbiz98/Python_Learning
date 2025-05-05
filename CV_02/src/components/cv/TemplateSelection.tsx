import { useState } from 'react';

interface TemplateSelectionProps {
  title: string;
  setTitle: (title: string) => void;
  template: string;
  setTemplate: (template: string) => void;
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

function TemplateSelection({ title, setTitle, template, setTemplate }: TemplateSelectionProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Choose a Template</h2>
      <p className="text-gray-400 mb-6">
        Select a template and give your CV a title before proceeding.
      </p>
      
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
  );
}

export default TemplateSelection;