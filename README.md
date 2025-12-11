# Document Management System

A full-stack web application for uploading, managing, and downloading PDF documents.

## Tech Stack

- **Frontend**: React, Vite, TanStack Query, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, Multer, Zod validation
- **Database**: PostgreSQL with Drizzle ORM
- **Language**: TypeScript

## Project Structure

```
├── design.md           # System design documentation
├── README.md           # This file
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── pages/      # Page components
│   │   ├── hooks/      # Custom hooks
│   │   └── lib/        # Utilities
│   └── index.html
├── backend/            # Express.js backend server
│   └── index.ts        # Server entry point
└── shared/             # Shared types and schemas
    └── schema.ts       # Database schema & types
```

## Features

- Upload PDF documents (max 10MB)
- View all uploaded documents
- Download documents
- Delete documents
- Drag-and-drop file upload
- Responsive design

## Prerequisites

- Node.js 18+
- PostgreSQL database
- npm (recommended)

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/documents
PORT=5000
```

## Installation

```bash
# Install dependencies
npm install

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

## API Endpoints

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| GET    | /api/documents        | List all documents  |
| POST   | /api/documents/upload | Upload a document   |
| GET    | /api/documents/:id    | Download a document |
| DELETE | /api/documents/:id    | Delete a document   |

## Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## License

MIT
