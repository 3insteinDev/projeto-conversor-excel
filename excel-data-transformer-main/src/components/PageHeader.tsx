import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  title: string;
  description?: string;
  showBack?: boolean;
}

export function PageHeader({ title, description, showBack = true }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {showBack && (
        <Button
          variant="ghost"
          asChild
          className="mb-4 -ml-2 gap-2 text-muted-foreground hover:text-foreground"
        >
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>
      )}
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      {description && (
        <p className="mt-2 text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
