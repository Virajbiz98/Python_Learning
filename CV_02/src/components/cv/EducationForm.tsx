import { PlusCircle, School, Trash, CalendarRange, GraduationCap } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { educationSchema } from '../../lib/validationSchemas';
import type { z } from 'zod';
import { Education } from '../../types/database.types';
import { toast } from 'sonner';

type EducationInputs = z.infer<typeof educationSchema>;

interface EducationFormProps {
  education: Education[];
  setEducation: (education: Education[]) => void;
}

function EducationForm({ education, setEducation }: EducationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<EducationInputs>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: '',
    }
  });

  const onSubmit = (data: EducationInputs) => {
    try {
      const item: Education = {
        ...data,
        id: crypto.randomUUID(),
      };
      setEducation([...education, item]);
      reset();
      toast.success('Education entry added successfully');
    } catch (error) {
      toast.error('Failed to add education entry');
    }
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter(item => item.id !== id));
    toast.success('Education entry removed');
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
      <form onSubmit={handleSubmit(onSubmit)} className="glass-panel p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Add Education</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="institution" className="block text-sm font-medium text-gray-300">
              Institution *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <School className="h-5 w-5 text-gray-500" />
              </div>
              <input
                {...register('institution')}
                type="text"
                id="institution"
                className={`input pl-10 ${errors.institution ? 'border-red-500' : ''}`}
                placeholder="University name"
              />
            </div>
            {errors.institution && (
              <p className="text-sm text-red-500">{errors.institution.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="degree" className="block text-sm font-medium text-gray-300">
              Degree *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GraduationCap className="h-5 w-5 text-gray-500" />
              </div>
              <input
                {...register('degree')}
                type="text"
                id="degree"
                className={`input pl-10 ${errors.degree ? 'border-red-500' : ''}`}
                placeholder="Bachelor's, Master's, etc."
              />
            </div>
            {errors.degree && (
              <p className="text-sm text-red-500">{errors.degree.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="field" className="block text-sm font-medium text-gray-300">
              Field of Study *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GraduationCap className="h-5 w-5 text-gray-500" />
              </div>
              <input
                {...register('field')}
                type="text"
                id="field"
                className={`input pl-10 ${errors.field ? 'border-red-500' : ''}`}
                placeholder="Computer Science, Business, etc."
              />
            </div>
            {errors.field && (
              <p className="text-sm text-red-500">{errors.field.message}</p>
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
                placeholder="MM/YYYY or Present"
              />
            </div>
            {errors.endDate && (
              <p className="text-sm text-red-500">{errors.endDate.message}</p>
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
              placeholder="Describe your studies, achievements, and relevant coursework..."
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
              Add Education
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EducationForm;