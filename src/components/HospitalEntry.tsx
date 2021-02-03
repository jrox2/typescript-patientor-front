import React from "react";
import { Label } from "semantic-ui-react";

type Props = {
  date: string;
  discharge: {
    date: string;
    criteria: string;
  };
};

const HospitalEntry = ({ date, discharge }: Props) => {
  return (
    <>
      <div className="divider">
        <h3>
          {date}
          <Label
            icon={{ name: "hospital" }}
            size="huge"
            className="iconLabel"
          />
        </h3>
        <div>
          <b>Discharge:</b> {discharge.date} - {discharge.criteria}
        </div>
      </div>
    </>
  );
};

export default HospitalEntry;
