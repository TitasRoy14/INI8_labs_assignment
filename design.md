# Document Management System - Design Document

## Section 1: Tech Stack Choices

### Q1: Which frontend framework did you choose and why?

**Choice: React with Vite**

**Rationale:**
- **React** is a widely-adopted, component-based library with excellent ecosystem support, making it ideal for building interactive UIs like document management interfaces.
- **Vite** provides lightning-fast HMR (Hot Module Replacement) and optimized builds, significantly improving developer experience compared to traditional bundlers like Webpack.
- React's declarative approach simplifies state management for features like upload progress, document lists, and delete confirmations.
- The combination offers excellent TypeScript support, which improves code quality and maintainability.

### Q2: Which backend framework did you choose and why?

**Choice: Express.js**

**Rationale:**
- **Express.js** is a minimal, flexible Node.js framework that provides robust routing and middleware support.
- Excellent integration with **Multer** for handling multipart/form-data (file uploads).
- Large ecosystem and community support with extensive documentation.
- Lightweight and unopinionated, allowing flexibility in architecture decisions.
- Seamless TypeScript integration for type-safe API development.

### Q3: Which database did you choose and why?

**Choice: PostgreSQL with Drizzle ORM**

**Rationale:**
- **PostgreSQL** is a powerful, open-source relational database with excellent reliability, data integrity, and ACID compliance.
- Better suited than NoSQL for structured document metadata (id, filename, filepath, filesize, timestamps).
- **Drizzle ORM** provides type-safe database operations with minimal overhead and excellent TypeScript integration.
- PostgreSQL's robust indexing supports efficient querying as the document collection grows.
- Strong support for concurrent operations and transaction management.

### Q4: What changes would you make to support 1,000 users?

**Architecture Modifications:**
1. **Load Balancing**: Implement a load balancer (nginx/HAProxy) to distribute traffic across multiple Express instances.
2. **Stateless Sessions**: Move session management to Redis for shared state across instances.
3. **Connection Pooling**: Configure PostgreSQL connection pooling (PgBouncer) to handle increased connections.
4. **Caching Layer**: Add Redis caching for frequently accessed document metadata.

**Infrastructure Changes:**
1. **Horizontal Scaling**: Deploy multiple backend instances behind a load balancer.
2. **Cloud File Storage**: Migrate from local filesystem to S3/MinIO for distributed file storage.
3. **CDN Integration**: Use a CDN for serving static assets and potentially cached documents.
4. **Database Replication**: Set up read replicas for PostgreSQL to handle read-heavy workloads.

**Scalability Considerations:**
1. **Rate Limiting**: Implement rate limiting per user to prevent abuse.
2. **Queue System**: Add a job queue (Bull/BullMQ) for async processing of uploads and deletions.
3. **Monitoring**: Implement APM (Application Performance Monitoring) with tools like Prometheus/Grafana.
4. **Auto-scaling**: Configure auto-scaling based on CPU/memory metrics in cloud deployment.

---

## Section 2: Architecture Overview

\`\`\`
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ARCHITECTURE DIAGRAM                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐      HTTP/HTTPS      ┌──────────────────────────────────────┐
│              │ ─────────────────────▶│              EXPRESS.JS              │
│   REACT +    │                      │               BACKEND                 │
│    VITE      │ ◀───────────────────  │                                      │
│  (Frontend)  │      JSON/Files      │  ┌────────────┐  ┌────────────────┐  │
│              │                      │  │   Multer   │  │  Zod Validator │  │
└──────────────┘                      │  │ (Uploads)  │  │  (Validation)  │  │
                                      │  └────────────┘  └────────────────┘  │
                                      └───────────┬────────────┬─────────────┘
                                                  │            │
                                    ┌─────────────┘            └──────────────┐
                                    │                                         │
                                    ▼                                         ▼
                        ┌───────────────────┐                    ┌────────────────────┐
                        │                   │                    │                    │
                        │    POSTGRESQL     │                    │   LOCAL FILESYSTEM │
                        │    (Database)     │                    │   (File Storage)   │
                        │                   │                    │                    │
                        │  ┌─────────────┐  │                    │   /uploads/        │
                        │  │  documents  │  │                    │   ├── file1.pdf    │
                        │  │   table     │  │                    │   ├── file2.pdf    │
                        │  └─────────────┘  │                    │   └── ...          │
                        │                   │                    │                    │
                        └───────────────────┘                    └────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           COMPONENT INTERACTIONS                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Frontend Components:                                                       │
│  ┌────────────┐   ┌────────────────┐   ┌──────────────┐   ┌─────────────┐  │
│  │   Header   │   │ FileUploadZone │   │ DocumentList │   │ DeleteDialog│  │
│  └────────────┘   └───────┬────────┘   └──────┬───────┘   └──────┬──────┘  │
│                           │                   │                   │         │
│                           └───────────┬───────┴───────────────────┘         │
│                                       │                                     │
│                                       ▼                                     │
│                           ┌─────────────────────┐                           │
│                           │  TanStack Query     │                           │
│                           │  (State Management) │                           │
│                           └──────────┬──────────┘                           │
│                                      │                                      │
│  Backend Endpoints:                  ▼                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐ │
│  │ GET /documents  │  │ POST /upload    │  │ GET/DELETE /documents/:id   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
\`\`\`

---

## Section 3: API Specification

### POST /api/documents/upload

| Property        | Value                                                        |
|-----------------|--------------------------------------------------------------|
| **URL**         | `/api/documents/upload`                                      |
| **Method**      | `POST`                                                       |
| **Content-Type**| `multipart/form-data`                                        |
| **Description** | Upload a new PDF document to the system                      |

**Request Format:**
\`\`\`
FormData:
  - file: <PDF file> (required, max 10MB, PDF only)
\`\`\`

**Success Response (201 Created):**
\`\`\`json
{
  "id": 1,
  "filename": "document.pdf",
  "filepath": "1699876543210-123456789.pdf",
  "filesize": 245678,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
\`\`\`

**Error Responses:**
- `400 Bad Request`: No file uploaded or invalid file type
- `400 Bad Request`: File exceeds 10MB limit
- `500 Internal Server Error`: Server error during upload

---

### GET /api/documents

| Property        | Value                                                        |
|-----------------|--------------------------------------------------------------|
| **URL**         | `/api/documents`                                             |
| **Method**      | `GET`                                                        |
| **Description** | Retrieve all documents, ordered by creation date (newest first) |

**Request Format:**
\`\`\`
No request body required
\`\`\`

**Success Response (200 OK):**
\`\`\`json
[
  {
    "id": 1,
    "filename": "document1.pdf",
    "filepath": "1699876543210-123456789.pdf",
    "filesize": 245678,
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "filename": "document2.pdf",
    "filepath": "1699876543211-987654321.pdf",
    "filesize": 123456,
    "createdAt": "2024-01-14T09:15:00.000Z"
  }
]
\`\`\`

**Error Responses:**
- `500 Internal Server Error`: Failed to fetch documents

---

### GET /api/documents/:id

| Property        | Value                                                        |
|-----------------|--------------------------------------------------------------|
| **URL**         | `/api/documents/:id`                                         |
| **Method**      | `GET`                                                        |
| **Description** | Download a specific document by ID                           |

**Request Format:**
\`\`\`
URL Parameter:
  - id: number (required) - Document ID
\`\`\`

**Success Response (200 OK):**
\`\`\`
Content-Type: application/pdf
Content-Disposition: attachment; filename="document.pdf"
Body: <binary PDF data>
\`\`\`

**Error Responses:**
- `400 Bad Request`: Invalid ID format
- `404 Not Found`: Document not found in database
- `404 Not Found`: File not found on filesystem
- `500 Internal Server Error`: Download failed

---

### DELETE /api/documents/:id

| Property        | Value                                                        |
|-----------------|--------------------------------------------------------------|
| **URL**         | `/api/documents/:id`                                         |
| **Method**      | `DELETE`                                                     |
| **Description** | Delete a document and its associated file                    |

**Request Format:**
\`\`\`
URL Parameter:
  - id: number (required) - Document ID
\`\`\`

**Success Response (200 OK):**
\`\`\`json
{
  "success": true,
  "message": "Document deleted"
}
\`\`\`

**Error Responses:**
- `400 Bad Request`: Invalid ID format
- `404 Not Found`: Document not found
- `500 Internal Server Error`: Delete failed

---

## Section 4: Data Flow Description

### Q5: Describe the upload and download process

#### Upload Flow (Step-by-Step)

\`\`\`
1. USER ACTION
   └── User drags/drops or selects a PDF file in FileUploadZone component

2. CLIENT VALIDATION
   └── Frontend validates file type (PDF only) and size (< 10MB)
   └── Creates FormData object with the file

3. HTTP REQUEST
   └── TanStack Query mutation sends POST to /api/documents/upload
   └── Content-Type: multipart/form-data

4. SERVER MIDDLEWARE (Multer)
   └── Multer middleware intercepts the request
   └── Validates file type (application/pdf)
   └── Validates file size (≤ 10MB)
   └── Generates unique filename: {timestamp}-{random}.pdf
   └── Saves file to /uploads directory

5. SERVER VALIDATION (Zod)
   └── Validates document metadata schema
   └── Ensures filename, filepath, filesize are valid

6. DATABASE INSERT
   └── Drizzle ORM inserts record into 'documents' table
   └── Stores: id, filename, filepath, filesize, createdAt

7. RESPONSE
   └── Returns created document object (201 Created)
   └── On error: deletes uploaded file, returns error response

8. CLIENT UPDATE
   └── TanStack Query invalidates 'documents' query
   └── Document list refreshes with new document
   └── Success toast notification displayed
\`\`\`

#### Download Flow (Step-by-Step)

\`\`\`
1. USER ACTION
   └── User clicks download button on DocumentCard component

2. HTTP REQUEST
   └── Browser navigates to GET /api/documents/:id
   └── Or: fetch request with response handling

3. SERVER VALIDATION
   └── Parses and validates document ID (must be number)

4. DATABASE QUERY
   └── Drizzle ORM queries 'documents' table by ID
   └── Retrieves document metadata (filename, filepath)

5. FILE SYSTEM CHECK
   └── Verifies file exists at /uploads/{filepath}
   └── Returns 404 if file missing

6. STREAM RESPONSE
   └── Sets Content-Type: application/pdf
   └── Sets Content-Disposition: attachment; filename="original.pdf"
   └── Creates ReadStream from file
   └── Pipes file stream to HTTP response

7. CLIENT HANDLING
   └── Browser receives file stream
   └── Triggers download dialog with original filename
   └── File saved to user's downloads folder
\`\`\`

---

## Section 5: Assumptions

### Q6: Document your assumptions

#### File Size Limits
- **Maximum file size**: 10MB per document
- **Rationale**: Balances usability with server resource constraints; covers most standard PDF documents
- **Implementation**: Enforced at both Multer middleware and Zod validation levels

#### File Type Restrictions
- **Allowed types**: PDF only (`application/pdf`)
- **Rationale**: Focused scope for document management; PDFs are universal for document sharing
- **Implementation**: MIME type validation in Multer fileFilter

#### Authentication Approach
- **Current state**: No authentication implemented
- **Assumption**: System operates in a trusted environment or behind network-level security
- **Future consideration**: Add JWT-based authentication or OAuth integration for production use

#### Concurrency Handling
- **File naming**: Timestamp + random number prevents filename collisions
- **Database**: PostgreSQL handles concurrent read/write operations natively
- **Assumption**: Single server instance; no distributed file locking required
- **File operations**: Synchronous file deletion to prevent race conditions

#### Storage Constraints
- **Location**: Local filesystem (`/uploads` directory)
- **Assumption**: Adequate disk space available; single server deployment
- **Future consideration**: Migrate to cloud storage (S3) for distributed deployments

#### Error Handling
- **File cleanup**: Failed uploads trigger automatic file deletion
- **Orphan files**: Assumes manual cleanup if database insert fails after file save
- **Missing files**: Returns 404 if database record exists but file is missing

#### Performance Assumptions
- **Concurrent users**: Designed for small to medium workloads (< 100 concurrent users)
- **Document count**: No pagination implemented; assumes < 1000 documents total
- **Response time**: Acceptable latency for local filesystem operations

#### Browser Support
- **Target**: Modern browsers with File API and drag-drop support
- **Assumption**: Users have JavaScript enabled
- **Download method**: Browser-native file download handling

#### Data Retention
- **Policy**: Documents persist until manually deleted
- **No automatic cleanup**: Files remain on disk indefinitely
- **Backup**: No automated backup strategy implemented
