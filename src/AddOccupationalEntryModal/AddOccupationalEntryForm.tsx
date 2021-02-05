import React from "react";
import { Grid, Button, Label } from "semantic-ui-react";
import { Formik, Form, Field } from "formik";
import { TextField, DiagnosisSelection } from "../AddPatientModal/FormField";
import { OccupationalHealthcareEntry } from "../types";
import { useStateValue } from "../state";

export type OccupationalHealthcareEntryFormValues = Omit<
  OccupationalHealthcareEntry,
  "id"
>;

interface Props {
  onSubmit: (values: OccupationalHealthcareEntryFormValues) => void;
  onCancel: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const OccupationalHealthcareEntryForm: React.FC<Props> = ({
  onSubmit,
  onCancel,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [{ diagnoses }] = useStateValue();
  return (
    <Formik
      initialValues={{
        type: "OccupationalHealthcare",
        description: "",
        date: "",
        specialist: "",
        diagnosisCodes: [],
        employerName: "",
        sickLeave: {
          startDate: "",
          endDate: "",
        },
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (!values.employerName) {
          errors.employerName = requiredError;
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className="form ui">
            Type: OccupationalHealthcare
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            />
            <Field
              label="Employer name"
              placeholder="Employer name"
              name="employerName"
              component={TextField}
            />
            <Label>Sickleave:</Label>
            <Field
              label="Start Date"
              placeholder="YYYY-MM-DD"
              name="sickleave.startdate"
              component={TextField}
            />
            <Field
              label="End Date"
              placeholder="YY-MM-DD"
              name="sickleave.enddate"
              component={TextField}
            />
            <Grid>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add Entry
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default OccupationalHealthcareEntryForm;
