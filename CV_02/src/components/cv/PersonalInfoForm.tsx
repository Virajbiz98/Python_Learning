import { Briefcase, Mail, MapPin, Phone, User } from 'lucide-react';
import { PersonalInfo } from '../../types/database.types';

interface PersonalInfoFormProps {
  personalInfo: PersonalInfo;
  setPersonalInfo: (info: PersonalInfo) => void;
}

function PersonalInfoForm({ personalInfo, setPersonalInfo }: PersonalInfoFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonalInfo({ ...personalInfo, [name]: value });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Personal Information</h2>
      <p className="text-gray-400 mb-6">
        Add your contact information and professional summary.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={personalInfo.fullName}
              onChange={handleChange}
              className="input pl-10"
              placeholder="John Doe"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
            Professional Title *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Briefcase className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              id="title"
              name="title"
              value={personalInfo.title}
              onChange={handleChange}
              className="input pl-10"
              placeholder="Software Engineer"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={personalInfo.email}
              onChange={handleChange}
              className="input pl-10"
              placeholder="john.doe@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
            Phone *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={personalInfo.phone}
              onChange={handleChange}
              className="input pl-10"
              placeholder="+1 (555) 123-4567"
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
              value={personalInfo.location}
              onChange={handleChange}
              className="input pl-10"
              placeholder="New York, NY"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-2">
            Website (Optional)
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={personalInfo.website || ''}
            onChange={handleChange}
            className="input"
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="summary" className="block text-sm font-medium text-gray-300 mb-2">
          Professional Summary *
        </label>
        <textarea
          id="summary"
          name="summary"
          value={personalInfo.summary}
          onChange={handleChange}
          rows={5}
          className="input"
          placeholder="Write a brief summary of your professional background, skills, and career objectives..."
          required
        />
        <p className="mt-2 text-sm text-gray-500">
          Keep your summary concise and focused on your key professional strengths.
        </p>
      </div>
    </div>
  );
}

export default PersonalInfoForm;