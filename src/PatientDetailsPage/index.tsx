import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Container, Icon, Label } from "semantic-ui-react";

import { Patient } from "../types"; 
import { apiBaseUrl } from "../constants"; 

const PatientDetailsPage: React.FC = () => {
  
  const [patientName, setPatientName] = useState('Loading');
  const [patientSsn, setPatientSsn] = useState('');
  const [patientOccupation, setPatientOccupation] = useState('');
  const [genderIcon, setgenderIcon] = useState('other');
  
  //const { id } = useParams<{ id: string }>();
  const location = useLocation<{pathname: string}>();
  const idPrm: string[] = location.pathname.split('/');
  console.log("idPrm:", idPrm);
  React.useEffect(() => {
   
    axios.get<void>(`${apiBaseUrl}/ping`);

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

        setPatientName(patientDetailsFromApi.data.name);
        setPatientSsn(String(patientDetailsFromApi.data.ssn));
        setPatientOccupation(patientDetailsFromApi.data.occupation);
        setgenderIcon(genderIcons[patientDetailsFromApi.data.gender]);
       
      } catch (e) {
        console.error(e);
      }
    };

    fetchPatientDetails();
  }, );
  
  if (patientName === 'Loading') {
       return <><Icon loading name='spinner' size='big' /></>;
  } else {

  
  return (
      <>
      
    <div className="App">
      <Container textAlign="left">
        <div className="divider"><h3>{patientName}<Label icon={{name: genderIcon}} size='large' /></h3></div>
        <div>ID: {location.pathname}</div>
        <div>ssn: {patientSsn}</div>
        <div>occupation: {patientOccupation}</div>
      </Container>
    </div>
    </>
  );
}
};

export default PatientDetailsPage;
