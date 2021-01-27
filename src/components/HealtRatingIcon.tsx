import React from "react";
import { Label } from "semantic-ui-react";

type BarProps = {
  rating: number;
};

enum healthIcons {
  green = 0,
  yellow = 1,
  orange = 2,
  red = 3,
}

const HealthRatingIcon = ({ rating }: BarProps) => {
  const iconColor = rating != undefined ? healthIcons[rating] : "white";
  return (
    <div className="">
      <Label
        icon={{ name: "heart" }}
        color="green"
        size="big"
        className={`iconLabel ${iconColor}`}
      />
    </div>
  );
};

export default HealthRatingIcon;
