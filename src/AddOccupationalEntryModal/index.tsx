import React from "react";
import { Modal, Segment } from "semantic-ui-react";
import AddOccupationalEntryForm, {
  OccupationalHealthcareEntryFormValues,
} from "./AddOccupationalEntryForm";

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: OccupationalHealthcareEntryFormValues) => void;
  error?: string;
  entryType: string;
}

const AddOccupationalEntryModal = ({
  modalOpen,
  onClose,
  onSubmit,
  error,
  entryType,
}: Props) => (
  <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
    <Modal.Header>Add a new Entry</Modal.Header>
    <Modal.Content>
      {entryType}
      {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
      <AddOccupationalEntryForm onSubmit={onSubmit} onCancel={onClose} />
    </Modal.Content>
  </Modal>
);

export default AddOccupationalEntryModal;
