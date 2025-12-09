# Medical Document Management Portal - Design Guidelines

## Design Approach
**System-Based Approach** leveraging shadcn/ui components with medical industry professionalism. This utility-focused application prioritizes clarity, efficiency, and trust-building through clean layouts and professional presentation.

## Core Design Elements

### A. Typography Hierarchy
- **Headings**: Inter or DM Sans font family
  - H1 (Portal Title): text-3xl md:text-4xl, font-bold
  - H2 (Section Headers): text-2xl, font-semibold
  - H3 (Card Titles): text-lg, font-medium
- **Body Text**: text-base for descriptions, text-sm for metadata
- **Data Display**: Tabular numerics use font-mono for alignment

### B. Layout System
**Spacing Primitives**: Use Tailwind units of 3, 4, 6, 8, 12, and 16 consistently
- Section padding: py-12 md:py-16
- Card/component padding: p-6 md:p-8
- Element gaps: gap-4 to gap-8
- Container: max-w-7xl mx-auto with px-4 md:px-6

### C. Component Library

**1. Header**
- Full-width medical gradient banner (implement with the specified green tones)
- Height: h-20 md:h-24
- Contains: Logo/title (left), navigation/actions (right)
- Sticky positioning: sticky top-0 z-50
- Medical cross icon or FileText icon alongside portal title

**2. File Upload Zone**
- Prominent card positioned near top of main content
- Drag-and-drop area: min-h-48, dashed border-2, rounded-lg
- Center-aligned upload icon (Upload from lucide-react, size-12)
- Clear instructional text: "Drop PDF files here or click to browse"
- File size limit display: "Maximum 10MB per file"
- Visual feedback states: hover (border emphasis), dragging-over (background shift), uploading (progress indicator)

**3. Document List/Grid**
- Two layout options based on viewport:
  - **Desktop (lg:)**: Grid layout with grid-cols-2 lg:grid-cols-3 gap-6
  - **Mobile/Tablet**: Single column stack with gap-4
- Each document card includes:
  - FileText icon (size-10) prominently displayed
  - Filename (truncate with ellipsis, font-medium)
  - Metadata row: File size + Upload date (text-sm, muted appearance)
  - Action buttons row: Download (Download icon) + Delete (Trash2 icon)
  - Card: rounded-xl, p-6, subtle border, hover elevation effect

**4. Empty State**
- Centered content when no documents exist
- Large FileText icon (size-16)
- Heading: "No documents uploaded yet"
- Subtext: "Upload your first medical document to get started"
- Min-height: min-h-96 for proper centering

**5. Action Buttons**
- Primary upload button: px-6 py-3, rounded-lg, font-medium
- Icon buttons (download/delete): p-2, rounded-md
- Loading states: Spinner icon replaces button content, disabled state
- Buttons on any background: backdrop-blur-sm bg-white/10 for transparency

**6. Confirmation Dialog**
- shadcn/ui Dialog component for delete confirmations
- Dialog content: max-w-md, p-6
- Warning icon at top
- Clear action buttons: "Cancel" (secondary) + "Delete" (destructive styling)

**7. Toast Notifications**
- Position: top-right of viewport
- Success: Checkmark icon with confirmation message
- Error: AlertCircle icon with error details
- Duration: 4-5 seconds auto-dismiss

### D. Page Layout Structure

**Main Container**:
```
- Header (sticky)
- Main content wrapper: py-8 md:py-12, min-h-screen
  - Upload section card
  - Divider/spacing: mt-12
  - Documents section heading + count badge
  - Document grid/list
  - Empty state (conditional)
```

**Responsive Breakpoints**:
- Mobile-first approach
- md: (768px) - Two-column grid begins
- lg: (1024px) - Three-column grid, expanded spacing
- All touch targets minimum 44px for mobile usability

### E. Data Formatting
- **File Sizes**: Display as "2.4 MB" or "156 KB" with one decimal
- **Dates**: Relative format preferred ("2 hours ago", "Yesterday", "Jan 15, 2024")
- **Filenames**: Truncate long names with ellipsis, show full name on hover tooltip

### F. Visual Enhancements
- **Card Shadows**: Subtle shadow-sm on rest, shadow-md on hover
- **Transitions**: transition-all duration-200 for interactive elements
- **Borders**: Use border opacity variants for subtle separation
- **Icons**: Consistent size-5 for inline icons, size-6 to size-12 for featured icons
- **Loading States**: Skeleton loaders for document cards during fetch, spinner for upload progress

## Images
No hero image required. This is a functional portal where immediate access to upload and document management takes priority. All iconography uses lucide-react library.

## Accessibility
- ARIA labels on all icon-only buttons
- Focus visible states on all interactive elements (ring-2 ring-offset-2)
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text for decorative icons marked as aria-hidden="true"
- Form labels properly associated with inputs
- Keyboard navigation for all workflows