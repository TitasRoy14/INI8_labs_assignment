import { FileText } from "lucide-react";

export function Header() {
  return (
    <header 
      className="sticky top-0 z-50 h-20 md:h-24 w-full bg-gradient-to-r from-primary via-primary/90 to-primary/80"
      data-testid="header"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <FileText className="size-6 md:size-8 text-primary-foreground" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-primary-foreground tracking-tight">
              MedDocs
            </h1>
            <p className="text-xs md:text-sm text-primary-foreground/80 hidden sm:block">
              Medical Document Portal
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-primary-foreground/70 hidden md:block">
            Secure Document Management
          </span>
        </div>
      </div>
    </header>
  );
}
