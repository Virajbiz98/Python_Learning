# CV Builder Application

[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

A modern web application for creating professional CVs with real-time previews and secure cloud storage.

## Features
- Multi-step form for CV creation
- Real-time preview of CV layout
- PDF export functionality
- User authentication (Email/Google)
- Cloud storage for CV templates
- Responsive design for all devices
- Dark/light mode support

## Tech Stack
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Build Tool**: Vite
- **Form Handling**: React Hook Form
- **State Management**: React Context API
- **Routing**: React Router 6

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/virajbiz98/CV_02.git
   
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## Configuration
Update `.env` with your Supabase credentials:
```ini
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Deployment
The application can be deployed to:
- [Vercel](https://vercel.com)
- [Netlify](https://netlify.com)
- Any static hosting service

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
Distributed under the MIT License. See `LICENSE` for more information.
