import { PlusCircle, School, Trash, CalendarRange, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import { Education } from '../../types/database.types';

interface EducationFormProps {
  education: Education[];
  setEducation: (education: Education[]) => void;
}

function EducationForm({ education, setEducation }: EducationFormProps) {
  const [newEducation, setNewEducation] = useState<Omit<Education, 'id'>>({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEducation({ ...newEducation, [name]: value });
  };

  const addEducation = () => {
    const item: Education = {
      ...newEducation,
      id: crypto.randomUUID(),
    };
    setEducation([...education, item]);
    setNewEducation({
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: '',
    });
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter(item => item.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Education</h2>
      <p className="text-gray-400 mb-6">
        Add your academic background, including degrees, institutions, and relevant details.
      </p>

      {/* List of existing education entries */}
      {education.length > 0 && (
        <div className="mb-8 space-y-4">
          <h3 className="text-lg font-semibold text-white">Your Education</h3>
          {education.map(item => (
            <div key={item.id} className="bg-dark-800 p-4 rounded-md relative">
              <button
                onClick={() => removeEducation(item.id)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-colors"
                aria-label="Remove education entry"
              >
                <Trash size={18} />
              </button>
              <div className="pr-8">
                <p className="font-medium text-white">{item.institution}</p>
                <p>{item.degree} in {item.field}</p>
                <p className="text-sm text-gray-400">
                  {item.startDate} - {item.endDate}
                </p>
                <p className="text-sm mt-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form to add new education */}
      <div className="glass-panel p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Add Education</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="institution" className="block text-sm font-medium text-gray-300 mb-2">
              Institution *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <School className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                id="institution"
                name="institution"
                value={newEducation.institution}
                onChange={handleChange}
                className="input pl-10"
                placeholder="University name"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="degree" className="block text-sm font-medium text-gray-300 mb-2">
              Degree *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GraduationCap className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                id="degree"
                name="degree"
                value={newEducation.degree}
                onChange={handleChange}
                className="input pl-10"
                placeholder="Bachelor's, Master's, etc."
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="field" className="block text-sm font-medium text-gray-300 mb-2">
              Field of Study *
            </label>
            <input
              type="text"
              id="field"
              name="field"
              value={newEducation.field}
              onChange={handleChange}
              className="input"
              placeholder="Computer Science, Business, etc."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-2">
                Start Date *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarRange className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  id="startDate"
                  name="startDate"
                  value={newEducation.startDate}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="MM/YYYY"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-2">
                End Date *
              </label>
              <input
                type="text"
                id="endDate"
                name="endDate"
                value={newEducation.endDate}
                onChange={handleChange}
                className="input"
                placeholder="MM/YYYY or Present"
                required
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={newEducation.description}
            onChange={handleChange}
            rows={3}
            className="input"
            placeholder="Describe your achievements, coursework, or other relevant details..."
          />
        </div>

        <button
          type="button"
          onClick={addEducation}
          disabled={!newEducation.institution || !newEducation.degree || !newEducation.field || !newEducation.startDate || !newEducation.endDate}
          className="mt-6 btn btn-primary flex items-center gap-2"
        >
          <PlusCircle size={18} />
          <span>Add Education</span>
        </button>
      </div>
    </div>
  );
}

export default EducationForm;