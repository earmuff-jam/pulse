import { takeLatest, put, call } from 'redux-saga/effects';
import { REACT_APP_LOCALHOST_URL } from '../../utils/Common';
import { notesActions } from './notesSlice';
import instance from '@utils/Instances';

const BASEURL = `${REACT_APP_LOCALHOST_URL}/api/v1/profile`;

export function* fetchNotes() {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.get, `${BASEURL}/${USER_ID}/notes`);
    yield put(notesActions.getNotesSuccess(response.data));
  } catch (e) {
    yield put(notesActions.getNotesFailure(e));
  }
}

export function* createNote(action) {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.post, `${BASEURL}/${USER_ID}/notes`, { ...action.payload });
    yield put(notesActions.createNoteSuccess(response.data));
  } catch (e) {
    yield put(notesActions.createNoteFailure(e));
  }
}

export function* updateNote(action) {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.put, `${BASEURL}/${USER_ID}/notes`, { ...action.payload });
    yield put(notesActions.updateNoteSuccess(response.data));
  } catch (e) {
    yield put(notesActions.updateNoteFailure(e));
  }
}

export function* removeNote(action) {
  try {
    const USER_ID = localStorage.getItem('userID');
    const { noteID } = action.payload;
    const response = yield call(instance.delete, `${BASEURL}/${USER_ID}/notes/${noteID}`);
    yield put(notesActions.removeNoteSuccess(response.data));
  } catch (e) {
    yield put(notesActions.removeNoteFailure(e));
  }
}

export function* watchFetchNotes() {
  yield takeLatest(`notes/getNotes`, fetchNotes);
}

export function* watchCreateNote() {
  yield takeLatest(`notes/createNote`, createNote);
}

export function* watchUpdateNote() {
  yield takeLatest(`notes/updateNote`, updateNote);
}

export function* watchRemoveNote() {
  yield takeLatest(`notes/removeNote`, removeNote);
}

export default [watchFetchNotes, watchCreateNote, watchUpdateNote, watchRemoveNote];
