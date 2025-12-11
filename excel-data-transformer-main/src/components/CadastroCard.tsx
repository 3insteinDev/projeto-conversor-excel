import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CadastroCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  highlight?: boolean;
  className?: string;
}

export function CadastroCard({ title, description, icon: Icon, href, highlight, className }: CadastroCardProps) {
  return (
    <Link
      to={href}
      className={cn(
        'group relative overflow-hidden rounded-lg border bg-card p-6 transition-all duration-300',
        'hover:shadow-lg hover:-translate-y-1',
        highlight 
          ? 'border-primary/50 bg-primary/5 hover:border-primary' 
          : 'border-border hover:border-primary/50',
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative">
        <div className={cn(
          'mb-4 inline-flex rounded-lg p-3',
          highlight ? 'bg-primary/20' : 'bg-primary/10'
        )}>
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}
