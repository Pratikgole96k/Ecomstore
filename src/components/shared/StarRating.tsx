import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number; // 0 to 5
  totalReviews?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export default function StarRating({
  rating,
  totalReviews,
  size = 'md',
  showCount = true,
}: StarRatingProps) {
  const starSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const currentSize = starSizes[size];

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${currentSize} ${
              star <= Math.round(rating)
                ? 'text-vastrika-gold-500 fill-vastrika-gold-500'
                : 'text-stone-300'
            }`}
          />
        ))}
      </div>
      {showCount && (
        <span className="text-xs font-semibold text-stone-600">
          {rating.toFixed(1)} {totalReviews !== undefined && <span className="text-stone-400 font-normal">({totalReviews})</span>}
        </span>
      )}
    </div>
  );
}
