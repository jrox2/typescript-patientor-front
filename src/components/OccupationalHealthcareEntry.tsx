import React from "react";
import { Label } from "semantic-ui-react";

type Props = {
  date: string;
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
};

const OccupationalHealthcare = ({ date, employerName, sickLeave }: Props) => {
  return (
    <>
      <div className="divider">
        <h3>
          {date}
          <Label
            icon={{ name: "stethoscope" }}
            size="huge"
            className="iconLabel"
          />
          {employerName}
        </h3>
        <div>
          <b>Sickleave:</b> {sickLeave?.startDate} - {sickLeave?.endDate}
        </div>
      </div>
    </>
  );
};

export default OccupationalHealthcare;
