import { call, put, takeLatest } from 'redux-saga/effects';

import instance from '../../utils/Instances';
import { REACT_APP_LOCALHOST_URL } from '../../utils/Common';
import { categoryItemDetailsActions } from './categoryItemDetailsSlice';

const DEFAULT_LIMIT = 10;
const BASEURL = `${REACT_APP_LOCALHOST_URL}/api/v1`;

export function* getCategory(action) {
  try {
    const catID = action.payload;
    const userID = localStorage.getItem('userID');
    const params = new URLSearchParams();
    params.append('id', userID);
    params.append('catID', catID);
    const response = yield call(instance.get, `${BASEURL}/category?${params.toString()}`);
    yield put(categoryItemDetailsActions.getCategorySuccess(response.data));
  } catch (e) {
    yield put(categoryItemDetailsActions.getCategoryFailure(e));
  }
}

export function* getItemsForCategory(action) {
  try {
    const catID = action.payload;
    const userID = localStorage.getItem('userID');
    const params = new URLSearchParams();
    params.append('id', userID);
    params.append('catID', catID);
    params.append('limit', DEFAULT_LIMIT);
    const response = yield call(instance.get, `${BASEURL}/category/items?${params.toString()}`);
    yield put(categoryItemDetailsActions.getItemsForCategorySuccess(response.data));
  } catch (e) {
    yield put(categoryItemDetailsActions.getItemsForCategoryFailure(e));
  }
}

export function* fetchAddItemsInCategory(action) {
  try {
    const userID = localStorage.getItem('userID');
    const { id, rowSelected, collaborators } = action.payload;
    const response = yield call(instance.post, `${BASEURL}/category/items`, {
      id,
      userID,
      assetIDs: rowSelected,
      collaborators: collaborators,
    });
    yield put(categoryItemDetailsActions.addItemsInCategorySuccess(response.data));
  } catch (e) {
    yield put(categoryItemDetailsActions.addItemsInCategoryFailure(e));
  }
}

export function* uploadImage(action) {
  try {
    const { id, selectedImage } = action.payload;
    const formData = new FormData();
    formData.append('imageSrc', selectedImage);
    const response = yield call(instance.post, `${BASEURL}/${id}/uploadImage`, formData);
    yield put(categoryItemDetailsActions.uploadImageSuccess(response.data));
  } catch (e) {
    yield put(categoryItemDetailsActions.uploadImageFailure(e));
  }
}

export function* getSelectedImage(action) {
  try {
    const { id } = action.payload;
    // we need to modify the image to be of arrayBuffer type and build a blob object from it
    const response = yield call(instance.get, `${BASEURL}/${id}/fetchImage`, {
      responseType: 'arraybuffer',
    });
    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    const avatarUrl = URL.createObjectURL(blob);
    yield put(categoryItemDetailsActions.getSelectedImageSuccess(avatarUrl));
  } catch (e) {
    yield put(categoryItemDetailsActions.getSelectedImageFailure(e));
  }
}

export function* watchGetCategory() {
  yield takeLatest(`categoryItemDetails/getCategory`, getCategory);
}

export function* watchGetItemsForCategory() {
  yield takeLatest(`categoryItemDetails/getItemsForCategory`, getItemsForCategory);
}

export function* watchFetchAddItemsInCategory() {
  yield takeLatest(`categoryItemDetails/addItemsInCategory`, fetchAddItemsInCategory);
}

export function* watchUploadImage() {
  yield takeLatest(`categoryItemDetails/uploadImage`, uploadImage);
}

export function* watchGetSelectedImage() {
  yield takeLatest(`categoryItemDetails/getSelectedImage`, getSelectedImage);
}

export default [
  watchGetCategory,
  watchGetItemsForCategory,
  watchFetchAddItemsInCategory,
  watchUploadImage,
  watchGetSelectedImage,
];