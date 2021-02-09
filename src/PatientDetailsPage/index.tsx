import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Container,
  Icon,
  Label,
  Header,
  Grid,
  Button,
} from "semantic-ui-react";
import { Diagnose, Patient } from "../types";
import { apiBaseUrl } from "../constants";
import { EntryHealthcheckFormValues } from "../AddHealthcheckEntryModal/AddHealthcheckEntryForm";
import { OccupationalHealthcareEntryFormValues } from "../AddOccupationalEntryModal/AddOccupationalEntryForm";
import { HospitalEntryFormValues } from "../AddHospitalEntryModal/AddHospitalEntryForm";
import AddHealthcheckEntryModal from "../AddHealthcheckEntryModal";
import AddOccupationalEntryModal from "../AddOccupationalEntryModal";
import AddHospitalEntryModal from "../AddHospitalEntryModal";
import { addPatient, useStateValue } from "../state";
import "./index.css";
import HospitalEntry from "../components/HospitalEntry";
import HealtcCheckEntry from "../components/HealthCheckEntry";
import HealthRatingIcon from "../components/HealtRatingIcon";
import OccupationalHealthCareEntry from "../components/OccupationalHealthcareEntry";

const PatientDetailsPage: React.FC = () => {
  const [patientName, setPatientName] = useState("Loading");
  const [patientSsn, setPatientSsn] = useState("");
  const [patientOccupation, setPatientOccupation] = useState("");
  const [genderIcon, setgenderIcon] = useState("other");
  const [entries, setEntries] = useState<Entries[]>([]);
  const [{ diagnoses }] = useStateValue();
  const [diagnoseNames, setDiagnoseNames] = useState<Diagnoses[]>([]);

  const [{ patients }, dispatch] = useStateValue();

  const [modalHealthcheckOpen, setHealthcheckModalOpen] = useState<boolean>(
    false
  );
  const [modalHospitalOpen, setHospitalModalOpen] = useState<boolean>(false);
  const [
    modalOccupationalHealthcareOpen,
    setOccupationalHealthcareModalOpen,
  ] = useState<boolean>(false);

  const [error, setError] = useState<string | undefined>();
  const [entryType, setEntryType] = useState("");

  const openHealthcheckModal = (): void => setHealthcheckModalOpen(true);
  const openOccupationalHealthcareModal = (): void =>
    setOccupationalHealthcareModalOpen(true);
  const openHospitalModal = (): void => setHospitalModalOpen(true);

  const closeHealthcheckModal = (): void => {
    setHealthcheckModalOpen(false);
    setError(undefined);
  };

  const closeOccupationalHealthcareModal = (): void => {
    setOccupationalHealthcareModalOpen(false);
    setError(undefined);
  };

  const closeHospitalModal = (): void => {
    setHospitalModalOpen(false);
    setError(undefined);
  };

  const location = useLocation<{ pathname: string }>();
  const idPrm: string[] = location.pathname.split("/");

  const submitNewHealthcheckEntry = async (
    values: EntryHealthcheckFormValues
  ) => {
    try {
      const { data: newEntry } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${idPrm[2]}/entries`,
        values
      );
      dispatch({ type: "ADD_PATIENT", payload: newEntry });
      console.log("submitNewHealthcheckEntry: ", newEntry);
      dispatch(addPatient(newEntry));
      closeHealthcheckModal();
    } catch (e) {
      console.error(e.response.data);
      setError(e.response.data.error);
    }
  };
  const submitNewHospitalEntry = async (values: HospitalEntryFormValues) => {
    try {
      const { data: newEntry } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${idPrm[2]}/entries`,
        values
      );
      dispatch({ type: "ADD_PATIENT", payload: newEntry });
      dispatch(addPatient(newEntry));
      closeHospitalModal();
    } catch (e) {
      console.error(e.response.data);
      setError(e.response.data.error);
    }
  };

  const submitNewOccupationalHealthcareEntry = async (
    values: OccupationalHealthcareEntryFormValues
  ) => {
    try {
      const { data: newEntry } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${idPrm[2]}/entries`,
        values
      );
      dispatch({ type: "ADD_PATIENT", payload: newEntry });
      dispatch(addPatient(newEntry));
      closeOccupationalHealthcareModal();
    } catch (e) {
      console.error(e.response.data);
      setError(e.response.data.error);
    }
  };
  interface Entries {
    date: string;
    type: string;
    description: string;
    diagnosisCodes?: string[];
    healthCheckRating?: number;
    employerName?: string;
    sickLeave?: {
      startDate: string;
      endDate: string;
    };
    discharge?: {
      date: string;
      criteria: string;
    };
  }

  interface Diagnoses {
    code: string;
    name: string;
    latin?: string;
  }

  const SetEntryDetails = (entry: Entries) => {
    switch (entry.type) {
      case "OccupationalHealthcare":
        setEntries((entries) => [
          ...entries,
          {
            date: entry.date,
            type: entry.type,
            description: entry.description,
            diagnosisCodes: entry.diagnosisCodes,
            employerName: entry.employerName,
            sickLeave: entry.sickLeave,
          },
        ]);
        break;
      case "HealthCheck":
        setEntries((entries) => [
          ...entries,
          {
            date: entry.date,
            type: entry.type,
            description: entry.description,
            diagnosisCodes: entry.diagnosisCodes,
            healthCheckRating: entry.healthCheckRating,
          },
        ]);
        break;
      case "Hospital":
        setEntries((entries) => [
          ...entries,
          {
            date: entry.date,
            type: entry.type,
            description: entry.description,
            diagnosisCodes: entry.diagnosisCodes,
            discharge: entry.discharge,
          },
        ]);
        break;
    }
  };
  const getDiagnoseName = async (codePrm: string | string[] | undefined) => {
    const diagnosisDetailsFromApi = await axios.get<Diagnose>(
      `${apiBaseUrl}/diagnoses/${codePrm}`
    );

    return diagnosisDetailsFromApi.data.name;
  };

  let diagArray2: Diagnoses[];

  React.useEffect(() => {
    diagArray2 = [];
    const fetchPatientDetails = async () => {
      enum genderIcons {
        male = "mars",
        female = "venus",
        other = "genderless",
      }

      try {
        const patientDetailsFromApi = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${idPrm[2]}`
        );

        const diagnosisDetailsFromApi = await axios.get<Diagnoses[]>(
          `${apiBaseUrl}/diagnoses`
        );

        diagnosisDetailsFromApi.data.map((i) => {
          diagArray2.push(i);
        });

        setDiagnoseNames(diagArray2);

        if (patientDetailsFromApi.data.entries == null) {
          console.log("entries null");
        } else {
          patientDetailsFromApi.data.entries.map((entry) => {
            SetEntryDetails(entry);
          });
        }

        setPatientName(patientDetailsFromApi.data.name);
        setPatientSsn(String(patientDetailsFromApi.data.ssn));
        setPatientOccupation(patientDetailsFromApi.data.occupation);
        setgenderIcon(genderIcons[patientDetailsFromApi.data.gender]);
      } catch (e) {
        console.error(e);
      }
    };

    fetchPatientDetails();
  }, []);

  if (patientName === "Loading") {
    return (
      <>
        <Icon loading name="spinner" size="big" />
      </>
    );
  }

  const getDiagName = (diagnoseCode: string): string | "No data" => {
    const found = diagnoseNames.find((code) => code.code == diagnoseCode);
    if (found?.name) {
      return found?.name;
    } else {
      return "No description found";
    }
  };

  const renderDetails = (entry: Entries) => {
    switch (entry.type) {
      case "HealthCheck":
        return <HealtcCheckEntry date={entry.date} />;
      case "OccupationalHealthcare":
        return (
          <OccupationalHealthCareEntry
            date={entry.date}
            employerName={entry.employerName!}
            sickLeave={entry.sickLeave}
          />
        );
      case "Hospital":
        return <HospitalEntry date={entry.date} discharge={entry.discharge!} />;
    }
  };

  return (
    <div className="App">
      <Container textAlign="left">
        <div className="divider">
          <h3>
            {patientName}
            <Label
              icon={{ name: genderIcon }}
              size="huge"
              className="iconLabel"
            />
          </h3>
        </div>
        <div>ssn: {patientSsn}</div>
        <div>occupation: {patientOccupation}</div>
        <Header as="h5">Entries:</Header>

        {
          <React.Fragment>
            {entries.map((entry, index) => (
              <Card.Group key={index}>
                <Card.Content className="fluidLine">
                  <Card.Header>{renderDetails(entry)}</Card.Header>
                  <Card.Meta>{entry.description}</Card.Meta>
                </Card.Content>
                <Card.Description>
                  <ul>
                    {entry.diagnosisCodes != undefined
                      ? entry.diagnosisCodes?.map((diagnoseCode) => (
                          // {diagName = getDiagnoseName(diagnoseCode)},

                          <li key={diagnoseCode}>
                            {diagnoseCode} : {getDiagName(diagnoseCode)}
                          </li>
                        ))
                      : null}
                    {}
                  </ul>
                </Card.Description>
                <Grid.Row className="fluidLine">
                  <HealthRatingIcon rating={entry.healthCheckRating!} />
                </Grid.Row>
              </Card.Group>
            ))}
            <Grid>
              <Grid.Column floated="left" width={5}>
                <AddHealthcheckEntryModal
                  modalOpen={modalHealthcheckOpen}
                  onSubmit={submitNewHealthcheckEntry}
                  error={error}
                  onClose={closeHealthcheckModal}
                  entryType={entryType}
                />
                <Button
                  onClick={() => (
                    setEntryType("Healtcheck"), openHealthcheckModal()
                  )}
                >
                  Add Healtcheck Entry
                </Button>
              </Grid.Column>
              <Grid.Column floated="left" width={5}>
                <AddOccupationalEntryModal
                  modalOpen={modalOccupationalHealthcareOpen}
                  onSubmit={submitNewOccupationalHealthcareEntry}
                  error={error}
                  onClose={closeOccupationalHealthcareModal}
                  entryType={entryType}
                />
                <Button
                  onClick={() => (
                    setEntryType("OccupationalHealthcare"),
                    openOccupationalHealthcareModal()
                  )}
                >
                  Add Occupational Entry
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <AddHospitalEntryModal
                  modalOpen={modalHospitalOpen}
                  onSubmit={submitNewHospitalEntry}
                  error={error}
                  onClose={closeHospitalModal}
                  entryType={entryType}
                />
                <Button
                  onClick={() => (
                    setEntryType("Hospital"), openHospitalModal()
                  )}
                >
                  Add Hospital Entry
                </Button>
              </Grid.Column>
            </Grid>
          </React.Fragment>
        }
      </Container>
    </div>
  );
};

export default PatientDetailsPage;
