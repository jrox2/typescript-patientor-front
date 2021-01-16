import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { Container, Icon } from "semantic-ui-react";

import { Patient } from "../types"; 
import { apiBaseUrl } from "../constants"; 

const PatientDetailsPage: React.FC = () => {
  //const [{ patients }, dispatch] = useStateValue();

  //const [error, setError] = React.useState<string | undefined>(); 

  const [patientName, setPatientName] = useState('LALA');
  const [patientSsn, setPatientSsn] = useState('');
  const [patientOccupation, setPatientOccupation] = useState('');
  const [genderIcon, setgenderIcon] = useState('genderless');
  
  const { id } = useParams<{ id: string }>();
  const location = useLocation<{pathname: string}>();
  const idPrm = location.pathname.split('/');
  let patientDetails;
  React.useEffect(() => {
    axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientDetails = async () => {
      try {
        const patientDetails2 = await axios.get<Patient[]>(
            `${apiBaseUrl}/patients/${idPrm[2]}`
            
          );
        patientDetails = Object.entries(patientDetails2.data);
        enum genderIcons {
            male = 'mars',
            female = 'venus',
            other = 'genderless'
        } 
        console.log("genderIcons: ", genderIcons["other"]);
        patientDetails.forEach(([key, value]) => {
            console.log("pt key:", key);
            console.log("pt value: ", value);
            switch (key) {
                case "name":
                    setPatientName(String(value));
                    break;
                case "ssn":
                    setPatientSsn(String(value));
                    break;
                case "occupation":
                    setPatientOccupation(String(value));
                    break;
                case "gender":
                    setgenderIcon(genderIcons['female']);
            }
            
        });
       
      } catch (e) {
        console.error(e);
      }
    };

    fetchPatientDetails();
  }, []);
  
  if (patientName === 'LALA') {
       return <><Icon loading name='spinner' size='big' /></>;
  } else {

  
  console.log("käytiinkö täällä ees?: ",  patientName, "result: ", patientDetails);
   
  return (
      <>
      
    <div className="App">
      <Container textAlign="left">
        <div className="divider"><h3>{patientName}<Icon name='mars' size='large' /></h3></div>
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
