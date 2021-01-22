import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Container, Icon, Label, Header } from "semantic-ui-react";
import { Diagnose, Patient } from "../types"; 
import { apiBaseUrl } from "../constants"; 
import './index.css';

const PatientDetailsPage: React.FC = () => {
  
  const [patientName, setPatientName] = useState('Loading');
  const [patientSsn, setPatientSsn] = useState('');
  const [patientOccupation, setPatientOccupation] = useState('');
  const [genderIcon, setgenderIcon] = useState('other');
  const [entries, setEntries] = useState<Entries[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnoses[]>([]);

  interface Entries {
      date: string;
      description: string;
      diagnosisCodes?: string [];
  } 
  
  interface Diagnoses {
      code: string;
      name: string;
      latin?: string;
  }

  const location = useLocation<{pathname: string}>();
  const idPrm: string[] = location.pathname.split('/');

  React.useEffect(() => {
   
   const getDiagnoseName = async (codePrm: string | string[] | undefined) => {
   const diagnosisDetailsFromApi = await axios.get<Diagnose>(
        `${apiBaseUrl}/diagnoses/${codePrm}`
      );
      setDiagnoses(diagnoses => [...diagnoses, {code: diagnosisDetailsFromApi.data.code, name: diagnosisDetailsFromApi.data.name, latin: diagnosisDetailsFromApi.data.latin}]);
    };
    const fetchPatientDetails = async () => {
        enum genderIcons {
            male = 'mars',
            female = 'venus',
            other = 'genderless'
        } 
      try {
        const patientDetailsFromApi = await axios.get<Patient>(
            `${apiBaseUrl}/patients/${idPrm[2]}`
          );
          
        if (patientDetailsFromApi.data.entries == null) {
            console.log("entries null");
        } else {
           patientDetailsFromApi.data.entries.map(entry => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            entry.diagnosisCodes?.map((code) => {
                getDiagnoseName(code);
            }),
            setEntries(entries => [...entries, {date: entry.date, description: entry.description, diagnosisCodes: entry.diagnosisCodes}]);
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
  }, [] );
  
  if (patientName === 'Loading') {
       return <><Icon loading name='spinner' size='big' /></>;
  } else {
    console.log("diag-code: ", entries, diagnoses);
  }

  return (
      
    <div className="App">
      <Container textAlign="left">
        <div className="divider"><h3>{patientName}<Label icon={{name: genderIcon}} size='huge' className="iconLabel"/></h3></div>
        <div>ID: {location.pathname}</div>
        <div>ssn: {patientSsn}</div>
        <div>occupation: {patientOccupation}</div>
        <Header as='h5'>Entries:</Header>

        {
        <React.Fragment>
        { entries.map((entry, index) => (
            <div key={index}>
                <div>{entry.date} {entry.description}</div>
                <ul>{diagnoses?.map((diagnose, index) => (
                    <li key={index}>{diagnose.code} {diagnose.name}</li>
                ))}</ul>
            </div>
            ))
        }
        </React.Fragment>   
        }
     </Container>
    </div>

  );
};


export default PatientDetailsPage;