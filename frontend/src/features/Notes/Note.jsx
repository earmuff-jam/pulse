import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { notesActions } from './notesSlice';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Accordion, Skeleton } from '@mui/material';
import NoteAccordionSummary from './NoteAccordion/NoteAccordionSummary';
import NoteAccordionDetails from './NoteAccordion/NoteAccordionDetails';
import { categorizeNotes, ConfirmationBoxModal, EmptyComponent } from '../../utils/utils';

const Note = ({ notes, loading, setEditMode, setSelectedNoteID }) => {
  const dispatch = useDispatch();
  dayjs.extend(relativeTime);

  const [deleteID, setDeleteID] = useState(-1);
  const [formattedNotes, setFormattedNotes] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const reset = () => {
    setConfirmDelete(false);
    setDeleteID(-1);
  };

  const handleConfirmDelete = () => {
    removeSelectedNote(deleteID);
    setConfirmDelete(false);
  };

  const removeSelectedNote = (noteID) => {
    dispatch(notesActions.removeNote({ noteID }));
    enqueueSnackbar('Successfully removed notes.', {
      variant: 'success',
    });
  };

  useEffect(() => {
    if (Array.isArray(notes) && notes.length >= 0) {
      const transformedData = categorizeNotes(notes);
      setFormattedNotes(transformedData);
    }
  }, [loading, notes]);

  if (loading) {
    return <Skeleton height="2rem" />;
  }

  if (!notes || notes.length === 0) {
    return <EmptyComponent subtitle="Add new notes." />;
  }

  return (
    <>
      {formattedNotes.map((v, index) => (
        <Accordion key={index} elevation={0}>
          <NoteAccordionSummary noteCategory={v.category} totalNotes={v.totalNotes} />
          <NoteAccordionDetails
            details={v.details}
            setEditMode={setEditMode}
            setSelectedNoteID={setSelectedNoteID}
            setConfirmDelete={setConfirmDelete}
            setDeleteID={setDeleteID}
          />
        </Accordion>
      ))}
      <ConfirmationBoxModal
        openDialog={confirmDelete}
        title="Confirm deletion"
        text="Delete this item?"
        textVariant="body2"
        handleClose={reset}
        maxSize="xs"
        deleteID={deleteID}
        confirmDelete={handleConfirmDelete}
      />
    </>
  );
};

export default Note;
