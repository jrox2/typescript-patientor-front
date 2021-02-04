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
import { HospitalEntryFormValues } from "../AddHospitalEntryModal/AddHospitalEntryForm";
import AddHealthcheckEntryModal from "../AddHealthcheckEntryModal";
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
  const [diagnoses, setDiagnoses] = useState<Diagnoses[]>([]);

  const [{ patients }, dispatch] = useStateValue();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalHospitalOpen, setHospitalModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [entryType, setEntryType] = useState("");

  const openModal = (): void => setModalOpen(true);
  const openHospitalModal = (): void => setHospitalModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
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
      dispatch(addPatient(newEntry));
      closeModal();
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
      closeModal();
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

  React.useEffect(() => {
    const getDiagnoseName = async (codePrm: string | string[] | undefined) => {
      const diagnosisDetailsFromApi = await axios.get<Diagnose>(
        `${apiBaseUrl}/diagnoses/${codePrm}`
      );
      setDiagnoses((diagnoses) => [
        ...diagnoses,
        {
          code: diagnosisDetailsFromApi.data.code,
          name: diagnosisDetailsFromApi.data.name,
          latin: diagnosisDetailsFromApi.data.latin,
        },
      ]);
    };
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

        if (patientDetailsFromApi.data.entries == null) {
          console.log("entries null");
        } else {
          patientDetailsFromApi.data.entries.map((entry) => {
            SetEntryDetails(entry);
            entry.diagnosisCodes?.map((code) => {
              getDiagnoseName(code);
            });
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
                    {diagnoses?.map((diagnose, index) => (
                      <li key={index}>
                        {diagnose.code} {diagnose.name}
                      </li>
                    ))}
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
                  modalOpen={modalOpen}
                  onSubmit={submitNewHealthcheckEntry}
                  error={error}
                  onClose={closeModal}
                  entryType={entryType}
                />
                <Button
                  onClick={() => (setEntryType("Healtcheck"), openModal())}
                >
                  Add Healtcheck Entry
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <AddHospitalEntryModal
                  modalOpen={modalHospitalOpen}
                  onSubmit={submitNewHospitalEntry}
                  error={error}
                  onClose={closeModal}
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
