import { 
  PlusCircle, Trash, Building, CalendarRange, MapPin, Briefcase 
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { experienceSchema } from '../../lib/validationSchemas';
import type { z } from 'zod';
import { Experience } from '../../types/database.types';
import { toast } from 'sonner';

interface ExperienceFormProps {
  experience: Experience[];
  setExperience: (experience: Experience[]) => void;
}

function ExperienceForm({ experience, setExperience }: ExperienceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<z.infer<typeof experienceSchema>>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: undefined,
      current: false,
      description: '',
    }
  });

  const current = watch('current');

  const onSubmit = (formData: z.infer<typeof experienceSchema>) => {
    try {
      const item: Experience = {
        ...formData,
        id: crypto.randomUUID(),
        endDate: formData.endDate || 'Present',
        description: [formData.description]
      };
      setExperience([...experience, item]);
      reset();
      toast.success('Experience entry added successfully');
    } catch (error) {
      toast.error('Failed to add experience entry');
    }
  };

  const removeExperience = (id: string) => {
    setExperience(experience.filter(item => item.id !== id));
    toast.success('Experience entry removed');
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
      <form onSubmit={handleSubmit(onSubmit)} className="glass-panel p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Add Experience</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="company" className="block text-sm font-medium text-gray-300">
              Company *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building className="h-5 w-5 text-gray-500" />
              </div>
              <input
                {...register('company')}
                type="text"
                id="company"
                className={`input pl-10 ${errors.company ? 'border-red-500' : ''}`}
                placeholder="Company name"
              />
            </div>
            {errors.company && (
              <p className="text-sm text-red-500">{errors.company.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="position" className="block text-sm font-medium text-gray-300">
              Position *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-gray-500" />
              </div>
              <input
                {...register('position')}
                type="text"
                id="position"
                className={`input pl-10 ${errors.position ? 'border-red-500' : ''}`}
                placeholder="Job title"
              />
            </div>
            {errors.position && (
              <p className="text-sm text-red-500">{errors.position.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-300">
              Location *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-500" />
              </div>
              <input
                {...register('location')}
                type="text"
                id="location"
                className={`input pl-10 ${errors.location ? 'border-red-500' : ''}`}
                placeholder="City, Country"
              />
            </div>
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-300">
              Start Date *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarRange className="h-5 w-5 text-gray-500" />
              </div>
              <input
                {...register('startDate')}
                type="text"
                id="startDate"
                className={`input pl-10 ${errors.startDate ? 'border-red-500' : ''}`}
                placeholder="MM/YYYY"
              />
            </div>
            {errors.startDate && (
              <p className="text-sm text-red-500">{errors.startDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-300">
              End Date *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarRange className="h-5 w-5 text-gray-500" />
              </div>
              <input
                {...register('endDate')}
                type="text"
                id="endDate"
                className={`input pl-10 ${errors.endDate ? 'border-red-500' : ''}`}
                placeholder="MM/YYYY"
                disabled={current}
                value={current ? 'Present' : undefined}
              />
            </div>
            {errors.endDate && (
              <p className="text-sm text-red-500">{errors.endDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <input
                {...register('current')}
                type="checkbox"
                id="current"
                className="mr-2"
                onChange={(e) => {
                  setValue('current', e.target.checked);
                  if (e.target.checked) {
                    setValue('endDate', 'Present');
                  } else {
                    setValue('endDate', '');
                  }
                }}
              />
              <label htmlFor="current" className="text-sm font-medium text-gray-300">
                I currently work here
              </label>
            </div>
            {errors.current && (
              <p className="text-sm text-red-500">{errors.current.message}</p>
            )}
          </div>

          <div className="md:col-span-2 space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              {...register('description')}
              id="description"
              rows={4}
              className={`input ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Describe your responsibilities and achievements..."
            ></textarea>
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              <PlusCircle size={18} className="mr-2" />
              Add Experience
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ExperienceForm;