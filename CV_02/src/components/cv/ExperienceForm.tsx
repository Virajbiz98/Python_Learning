import { 
  PlusCircle, Trash, Building, Calendar, CalendarRange, MapPin, Briefcase 
} from 'lucide-react';
import { useState } from 'react';
import { Experience } from '../../types/database.types';

interface ExperienceFormProps {
  experience: Experience[];
  setExperience: (experience: Experience[]) => void;
}

function ExperienceForm({ experience, setExperience }: ExperienceFormProps) {
  const [newExperience, setNewExperience] = useState<Omit<Experience, 'id'>>({
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setNewExperience({ ...newExperience, [name]: checked });
    } else {
      setNewExperience({ ...newExperience, [name]: value });
    }
  };

  const addExperience = () => {
    const item: Experience = {
      ...newExperience,
      id: crypto.randomUUID(),
    };
    setExperience([...experience, item]);
    setNewExperience({
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    });
  };

  const removeExperience = (id: string) => {
    setExperience(experience.filter(item => item.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Work Experience</h2>
      <p className="text-gray-400 mb-6">
        Add your professional experience, including positions, companies, and responsibilities.
      </p>

      {/* List of existing experience entries */}
      {experience.length > 0 && (
        <div className="mb-8 space-y-4">
          <h3 className="text-lg font-semibold text-white">Your Experience</h3>
          {experience.map(item => (
            <div key={item.id} className="bg-dark-800 p-4 rounded-md relative">
              <button
                onClick={() => removeExperience(item.id)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-colors"
                aria-label="Remove experience entry"
              >
                <Trash size={18} />
              </button>
              <div className="pr-8">
                <p className="font-medium text-white">{item.company}</p>
                <p>{item.position}</p>
                <p className="text-sm text-gray-400">
                  {item.startDate} - {item.current ? 'Present' : item.endDate}
                </p>
                <p className="text-sm text-gray-400">{item.location}</p>
                <p className="text-sm mt-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form to add new experience */}
      <div className="glass-panel p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Add Experience</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
              Company *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                id="company"
                name="company"
                value={newExperience.company}
                onChange={handleChange}
                className="input pl-10"
                placeholder="Company name"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-300 mb-2">
              Position *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                id="position"
                name="position"
                value={newExperience.position}
                onChange={handleChange}
                className="input pl-10"
                placeholder="Job title"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
              Location *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                id="location"
                name="location"
                value={newExperience.location}
                onChange={handleChange}
                className="input pl-10"
                placeholder="City, Country"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-2">
                Start Date *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  id="startDate"
                  name="startDate"
                  value={newExperience.startDate}
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
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarRange className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  id="endDate"
                  name="endDate"
                  value={newExperience.endDate}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="MM/YYYY"
                  disabled={newExperience.current}
                  required={!newExperience.current}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="current"
              name="current"
              checked={newExperience.current}
              onChange={handleChange}
              className="h-4 w-4 bg-dark-800 border-dark-600 rounded focus:ring-primary-500 focus:border-primary-500 text-primary-600"
            />
            <label htmlFor="current" className="ml-2 block text-sm text-gray-300">
              I currently work here
            </label>
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={newExperience.description}
            onChange={handleChange}
            rows={4}
            className="input"
            placeholder="Describe your responsibilities, achievements, and skills used..."
            required
          />
        </div>

        <button
          type="button"
          onClick={addExperience}
          disabled={
            !newExperience.company ||
            !newExperience.position ||
            !newExperience.location ||
            !newExperience.startDate ||
            (!newExperience.endDate && !newExperience.current) ||
            !newExperience.description
          }
          className="mt-6 btn btn-primary flex items-center gap-2"
        >
          <PlusCircle size={18} />
          <span>Add Experience</span>
        </button>
      </div>
    </div>
  );
}

export default ExperienceForm;