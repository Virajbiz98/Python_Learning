import { PlusCircle, Trash, Zap } from 'lucide-react';
import { useState } from 'react';
import { Skill } from '../../types/database.types';

interface SkillsFormProps {
  skills: Skill[];
  setSkills: (skills: Skill[]) => void;
}

function SkillsForm({ skills, setSkills }: SkillsFormProps) {
  const [newSkill, setNewSkill] = useState<Omit<Skill, 'id'>>({
    name: '',
    level: 3,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'range') {
      setNewSkill({ ...newSkill, [name]: parseInt(value) });
    } else {
      setNewSkill({ ...newSkill, [name]: value });
    }
  };

  const addSkill = () => {
    const item: Skill = {
      ...newSkill,
      id: crypto.randomUUID(),
    };
    setSkills([...skills, item]);
    setNewSkill({
      name: '',
      level: 3,
    });
  };

  const removeSkill = (id: string) => {
    setSkills(skills.filter(item => item.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Skills</h2>
      <p className="text-gray-400 mb-6">
        Add your professional skills and rate your proficiency level for each.
      </p>

      {/* List of existing skills */}
      {skills.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Your Skills</h3>
          <div className="bg-dark-800 p-4 rounded-md">
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <div
                  key={skill.id}
                  className="group bg-dark-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {skill.name}
                  <span className="text-gray-400">({skill.level}/5)</span>
                  <button
                    onClick={() => removeSkill(skill.id)}
                    className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove skill"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Form to add new skill */}
      <div className="glass-panel p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Add Skill</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Skill Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Zap className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={newSkill.name}
                onChange={handleChange}
                className="input pl-10"
                placeholder="e.g., JavaScript, Project Management, etc."
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-300 mb-2">
              Proficiency Level: {newSkill.level}/5
            </label>
            <input
              type="range"
              id="level"
              name="level"
              min="1"
              max="5"
              step="1"
              value={newSkill.level}
              onChange={handleChange}
              className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Expert</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={addSkill}
          disabled={!newSkill.name}
          className="mt-6 btn btn-primary flex items-center gap-2"
        >
          <PlusCircle size={18} />
          <span>Add Skill</span>
        </button>
      </div>
    </div>
  );
}

export default SkillsForm;