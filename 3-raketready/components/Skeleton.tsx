export function Skeleton({ className }: { className?: string }) {
    return (
        <div className={`animate-pulse bg-muted/50 rounded-lg ${className}`} />
    );
}
