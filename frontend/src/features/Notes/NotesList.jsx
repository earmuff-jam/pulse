import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Stack } from '@mui/material';

import Note from './Note';
import AddNote from './AddNote';
import { notesActions } from './notesSlice';
import NoteHeader from './Header/NoteHeader';
import SimpleModal from '@common/SimpleModal/SimpleModal';

const NotesList = () => {
  const dispatch = useDispatch();
  const { loading, notes } = useSelector((state) => state.notes);

  const [editMode, setEditMode] = useState(false);
  const [selecteNoteID, setSelectedNoteID] = useState(null);

  const handleEditMode = () => setEditMode(!editMode);

  const resetData = () => {
    setEditMode(false);
    setSelectedNoteID(null);
  };

  useEffect(() => {
    dispatch(notesActions.getNotes());
  }, []);

  return (
    <Stack spacing="1rem">
      <NoteHeader handleClick={handleEditMode} />
      <Note notes={notes} loading={loading} setEditMode={setEditMode} setSelectedNoteID={setSelectedNoteID} />
      {editMode && (
        <SimpleModal
          title="Add New Note"
          subtitle={'Assigned locations are approximate values.'}
          handleClose={resetData}
          maxSize="sm"
        >
          <AddNote
            setEditMode={setEditMode}
            setSelectedNoteID={setSelectedNoteID}
            noteID={selecteNoteID}
            notes={notes}
          />
        </SimpleModal>
      )}
    </Stack>
  );
};

export default NotesList;
