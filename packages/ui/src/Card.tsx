import { cn } from './utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated';
}

export function Card({ variant = 'default', className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-white',
        variant === 'bordered' && 'border border-gray-200',
        variant === 'elevated' && 'shadow-lg',
        variant === 'default' && 'border border-gray-100 shadow-sm',
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-6 py-4 border-b border-gray-100', className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-6 py-4', className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-6 py-4 border-t border-gray-100', className)} {...props} />;
}
