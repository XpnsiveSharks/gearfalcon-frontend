"use client";

import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
    onChange?: (rating: number) => void;
    initialRating?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ onChange, initialRating = 0 }) => {
    const [rating, setRating] = useState(initialRating);
    const [hoverRating, setHoverRating] = useState(0);

    const handleClick = (value: number) => {
        setRating(value);
        if (onChange) {
            onChange(value);
        }
    };

    const handleMouseEnter = (value: number) => {
        setHoverRating(value);
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    const getStarFill = (starIndex: number) => {
        const displayRating = (hoverRating || rating) / 2;
        if (displayRating >= starIndex) {
            return "gold";
        }
        return "lightgray";
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((starIndex) => {
                    const evenValue = starIndex * 2;
                    const oddValue = starIndex * 2 - 1;
                    return (
                        <div key={starIndex} className="relative">
                            <Star
                                size={40}
                                fill={getStarFill(starIndex)}
                                color={getStarFill(starIndex)}
                                onMouseEnter={() => handleMouseEnter(evenValue)}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => handleClick(evenValue)}
                                className="cursor-pointer"
                            />
                        </div>
                    );
                })}
            </div>
            <p className="text-gray-600">
                {hoverRating > 0 ? `${hoverRating}/10` : rating > 0 ? `${rating}/10` : 'Select a rating'}
            </p>
        </div>
    );
};

export default StarRating;
