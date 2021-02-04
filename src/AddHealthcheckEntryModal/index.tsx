import React from "react";
import { Modal, Segment } from "semantic-ui-react";
import AddHealthcheckEntryForm, {
  EntryHealthcheckFormValues,
} from "./AddHealthcheckEntryForm";

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: EntryHealthcheckFormValues) => void;
  error?: string;
  entryType: string;
}

const AddEntryModal = ({
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
      <AddHealthcheckEntryForm onSubmit={onSubmit} onCancel={onClose} />
    </Modal.Content>
  </Modal>
);

export default AddEntryModal;
