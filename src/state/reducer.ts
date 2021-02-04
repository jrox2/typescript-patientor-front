import { State } from "./state";
import { Patient, Diagnosis } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "SET_DIAGNOSE_LIST";
      payload: Diagnosis[];
    };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients,
        },
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload,
        },
      };
    case "SET_DIAGNOSE_LIST":
      return {
        ...state,
        diagnoses: {
          ...action.payload.reduce(
            (memo, diagnose) => ({ ...memo, [diagnose.code]: diagnose }),
            {}
          ),
          ...state.diagnoses,
        },
      };

    default:
      return state;
  }
};

export const setPatientList = (patients: Patient[]) => {
  return {
    type: "SET_PATIENT_LIST" as const,
    payload: patients,
  };
};

export const addPatient = (newPatient: Patient) => {
  return {
    type: "ADD_PATIENT" as const,
    payload: newPatient,
  };
};

export const setDiagnoseList = (diagnoses: Diagnosis[]) => {
  return {
    type: "SET_DIAGNOSE_LIST" as const,
    payload: diagnoses,
  };
};
