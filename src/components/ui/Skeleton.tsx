import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className = '', variant = 'rectangular', width, height }: SkeletonProps) {
  const variantStyles = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={`skeleton ${variantStyles[variant]} ${className}`}
      style={{ width, height }}
    />
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="w-full h-64" />
      <div className="p-4 space-y-3">
        <Skeleton className="w-3/4 h-6" />
        <Skeleton className="w-1/2 h-4" />
        <div className="flex gap-2">
          <Skeleton className="w-16 h-6 rounded-full" />
          <Skeleton className="w-16 h-6 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function SeatMapSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="w-full h-8" />
      <div className="grid grid-cols-10 gap-2">
        {Array.from({ length: 60 }).map((_, i) => (
          <Skeleton key={i} className="w-8 h-8" />
        ))}
      </div>
    </div>
  );
}

export function BookingSummarySkeleton() {
  return (
    <div className="card p-6 space-y-4">
      <Skeleton className="w-1/2 h-8" />
      <Skeleton className="w-full h-40" />
      <Skeleton className="w-full h-12" />
      <Skeleton className="w-full h-12" />
    </div>
  );
}
