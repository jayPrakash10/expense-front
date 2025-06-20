import { ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function AppCard({
  title,
  description,
  action,
  children,
  className,
}: CardProps) {
  return (
    <Card className={cn("py-3 rounded-lg gap-0", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-3 border-b [.border-b]:pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          {description && (
            <CardDescription className="text-sm text-muted-foreground">
              {description}
            </CardDescription>
          )}
        </div>
        {action}
      </CardHeader>
      <CardContent className="pt-2 px-3">
        {children}
      </CardContent>
    </Card>
  );
}
