# ShimmerCV - Professional Resume Builder

ShimmerCV is a modern, feature-rich resume builder application that helps users create professional CVs with ease. Built with React, TypeScript, and FastAPI, it offers a sleek dark theme interface with intuitive CV creation and management features.

## Features

- 🔐 Secure user authentication
- 📝 Multi-step CV creation wizard
- 🎨 Multiple professional CV templates
- 📱 Fully responsive design
- 🔄 Real-time CV preview
- ⬇️ PDF export functionality
- 🎯 Easy template switching
- ✨ Modern glass-morphism UI

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Router
- React Hook Form
- Lucide React Icons
- Framer Motion

### Backend
- FastAPI
- Python 3.9+
- JWT Authentication
- SQLite Database
- Pydantic
- uvicorn

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- pip

### Installation

1. Clone the repository:
```bash
git clone https://github.com/virajbiz98/login_page.git

```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
pip install -r requirements.txt
```

### Running the Application

1. Start the backend server:
```bash
npm run backend
# or
uvicorn api.main:app --reload
```

2. Start the frontend development server:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:5173
```

## Project Structure

```
shimmercv/
├── api/                  # FastAPI backend
│   └── main.py          # Main API endpoints
├── src/                 # React frontend
│   ├── components/      # Reusable components
│   ├── contexts/        # React contexts
│   ├── pages/           # Page components
│   └── main.tsx         # Entry point
├── public/              # Static assets
└── package.json         # Project dependencies
```

## API Endpoints

- `POST /token` - User authentication
- `POST /users` - User registration
- `GET /users/me` - Get current user
- `GET /cvs` - List user's CVs
- `POST /cvs` - Create new CV
- `GET /cvs/{id}` - Get CV by ID
- `PUT /cvs/{id}` - Update CV
- `DELETE /cvs/{id}` - Delete CV

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Lucide Icons](https://lucide.dev) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com) for styling
- [FastAPI](https://fastapi.tiangolo.com) for the backend framework
