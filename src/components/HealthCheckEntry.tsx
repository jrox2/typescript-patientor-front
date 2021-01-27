import React from "react";
import { Label } from "semantic-ui-react";

type Props = {
  date: string;
};

const HealthCheckEntry = ({ date }: Props) => {
  return (
    <>
      <div className="divider">
        <h3>
          {date}
          <Label icon={{ name: "doctor" }} size="huge" className="iconLabel" />
        </h3>
      </div>
    </>
  );
};

export default HealthCheckEntry;
