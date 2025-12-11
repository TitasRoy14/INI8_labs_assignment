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
├── shared/             # Shared types and schemas
│   └── schema.ts       # Database schema & types
└── uploads/            # File storage directory (auto-created)
```

## Features

- ✅ Upload PDF documents (max 10MB)
- ✅ View all uploaded documents with metadata
- ✅ Download documents
- ✅ Delete documents with confirmation
- ✅ Drag-and-drop file upload interface
- ✅ Responsive design with dark mode support
- ✅ Real-time file validation

## Prerequisites

- **Node.js** 18+ (Download from [nodejs.org](https://nodejs.org/))
- **PostgreSQL** database (Version 12+)
- **npm** (comes with Node.js)

## Environment Variables

Create a `.env` file in the **root directory**:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/documents
PORT=5000
NODE_ENV=development
```

**Example for local PostgreSQL:**

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/document_management
PORT=5000
NODE_ENV=development
```

## Installation

### Step 1: Clone or Extract the Project

```bash
cd document-management-system
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Setup PostgreSQL Database

**Option A: Using PostgreSQL CLI**

```bash
# Create database
psql -U postgres
CREATE DATABASE document_management;
\q
```

**Option B: Using pgAdmin**

- Open pgAdmin
- Right-click on Databases → Create → Database
- Name: `document_management`

### Step 4: Run Database Migrations

```bash
npm run db:push
```

This creates the `documents` table in your PostgreSQL database.

### Step 5: Start Development Server

```bash
npm run dev
```

The application will be available at:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## API Endpoints

### Base URL: `http://localhost:5000`

| Method | Endpoint              | Description         | Request Body         | Response                |
| ------ | --------------------- | ------------------- | -------------------- | ----------------------- |
| GET    | /api/documents        | List all documents  | None                 | Array of documents      |
| POST   | /api/documents/upload | Upload a document   | FormData (file: PDF) | Created document object |
| GET    | /api/documents/:id    | Download a document | None                 | PDF file stream         |
| DELETE | /api/documents/:id    | Delete a document   | None                 | Success message         |

### Example API Usage

**Upload Document:**

```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -F "file=@/path/to/document.pdf"
```

**List Documents:**

```bash
curl http://localhost:5000/api/documents
```

**Download Document:**

```bash
curl http://localhost:5000/api/documents/1 --output document.pdf
```

**Delete Document:**

```bash
curl -X DELETE http://localhost:5000/api/documents/1
```

## Development Commands

```bash
# Start development server (with hot reload)
npm run dev

# Type-check TypeScript
npm run check

# Build for production
npm run build

# Start production server
npm start

# Push database schema changes
npm run db:push
```

## Production Deployment

### Step 1: Build the Application

```bash
npm run build
```

### Step 2: Set Environment Variables

```env
DATABASE_URL=postgresql://user:password@production-host:5432/documents
PORT=5000
NODE_ENV=production
```

### Step 3: Start the Server

```bash
npm start
```

## Troubleshooting

### Database Connection Error

```
Error: DATABASE_URL must be set
```

**Solution**: Ensure `.env` file exists with valid `DATABASE_URL`

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution**: Change `PORT` in `.env` or kill the process using port 5000

### Upload Fails

```
Error: Only PDF files allowed
```

**Solution**: Ensure you're uploading a valid PDF file (not image or other format)

### Styles Not Loading

**Solution**:

1. Ensure `tailwind.config.ts` exists in root
2. Verify `frontend/src/index.css` imports Tailwind directives
3. Restart dev server: `npm run dev`

## File Size Limits

- **Maximum upload size**: 10MB per PDF
- **Allowed file types**: PDF only (`.pdf`)
- **Storage location**: `./uploads/` directory

## Additional Documentation

For detailed system design, architecture, and API specifications, see [design.md](./design.md)
