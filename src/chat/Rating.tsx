import React, { useState } from "react";

interface RatingProps {
  onRate: (rating: number) => void;
}

export const Rating: React.FC<RatingProps> = ({ onRate }) => {
  const [rating, setRating] = useState(0);

  const handleRating = (rate: number) => {
    setRating(rate);
    onRate(rate);
  };

  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleRating(star)}
          style={{ cursor: "pointer", color: star <= rating ? "gold" : "gray" }}
        >
            &#9733;
        </span>
      ))}
    </div>
  );
};
