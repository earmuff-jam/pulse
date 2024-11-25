import { takeLatest, put, call } from 'redux-saga/effects';
import { categoryActions } from './categoriesSlice';
import { REACT_APP_LOCALHOST_URL } from '../../utils/Common';
import instance from '@utils/Instances';

const DEFAULT_LIMIT = 10;
const BASEURL = `${REACT_APP_LOCALHOST_URL}/api/v1`;

export function* getCategories(action) {
  try {
    const userID = localStorage.getItem('userID');
    const params = new URLSearchParams();
    params.append('id', userID);
    if (action.payload) {
      params.append('limit', action.payload);
    } else {
      params.append('limit', DEFAULT_LIMIT);
    }
    const response = yield call(instance.get, `${BASEURL}/categories?${params.toString()}`);
    yield put(categoryActions.getCategoriesSuccess(response.data));
  } catch (e) {
    yield put(categoryActions.getCategoriesFailure(e));
  }
}

export function* getCategory(action) {
  try {
    const catID = action.payload;
    const userID = localStorage.getItem('userID');
    const params = new URLSearchParams();
    params.append('id', userID);
    params.append('catID', catID);
    const response = yield call(instance.get, `${BASEURL}/category?${params.toString()}`);
    yield put(categoryActions.getCategorySuccess(response.data));
  } catch (e) {
    yield put(categoryActions.getCategoryFailure(e));
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
    yield put(categoryActions.getItemsForCategorySuccess(response.data));
  } catch (e) {
    yield put(categoryActions.getItemsForCategoryFailure(e));
  }
}

export function* createCategory(action) {
  try {
    const response = yield call(instance.post, `${BASEURL}/category`, { ...action.payload });
    yield put(categoryActions.createCategorySuccess(response.data));
  } catch (e) {
    yield put(categoryActions.createCategoryFailure(e));
  }
}

export function* updateCategory(action) {
  try {
    const { id } = action.payload;
    const response = yield call(instance.put, `${BASEURL}/category/${id}`, { ...action.payload });
    yield put(categoryActions.updateCategorySuccess(response.data));
  } catch (e) {
    yield put(categoryActions.updateCategoryFailure(e));
  }
}

export function* removeCategory(action) {
  try {
    const { id } = action.payload;
    const response = yield call(instance.delete, `${BASEURL}/category/${id}`);
    yield put(categoryActions.removeCategorySuccess(response.data));
  } catch (e) {
    yield put(categoryActions.removeCategoryFailure(e));
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
    yield put(categoryActions.addItemsInCategorySuccess(response.data));
  } catch (e) {
    yield put(categoryActions.addItemsInCategoryFailure(e));
  }
}

export function* uploadImage(action) {
  try {
    const { id, selectedImage } = action.payload;
    const formData = new FormData();
    formData.append('imageSrc', selectedImage);
    const response = yield call(instance.post, `${BASEURL}/${id}/uploadImage`, formData);
    yield put(categoryActions.uploadImageSuccess(response.data));
  } catch (e) {
    yield put(categoryActions.uploadImageFailure(e));
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
    yield put(categoryActions.getSelectedImageSuccess(avatarUrl));
  } catch (e) {
    yield put(categoryActions.getSelectedImageFailure(e));
  }
}

export function* download() {
  try {
    const userID = localStorage.getItem('userID');
    const params = new URLSearchParams();
    params.append('id', userID);
    const response = yield call(instance.get, `${BASEURL}/categories?${params.toString()}`);
    yield put(categoryActions.downloadSuccess(response.data));
  } catch (e) {
    yield put(categoryActions.downloadFailure(e));
  }
}

export function* watchGetCategoryList() {
  yield takeLatest(`category/getCategories`, getCategories);
}

export function* watchGetCategory() {
  yield takeLatest(`category/getCategory`, getCategory);
}

export function* watchGetItemsForCategory() {
  yield takeLatest(`category/getItemsForCategory`, getItemsForCategory);
}

export function* watchCreateCategory() {
  yield takeLatest(`category/createCategory`, createCategory);
}

export function* watchUpdateCategory() {
  yield takeLatest(`category/updateCategory`, updateCategory);
}

export function* watchRemoveCategory() {
  yield takeLatest(`category/removeCategory`, removeCategory);
}

export function* watchFetchAddItemsInCategory() {
  yield takeLatest(`category/addItemsInCategory`, fetchAddItemsInCategory);
}

export function* watchUploadImage() {
  yield takeLatest(`category/uploadImage`, uploadImage);
}

export function* watchGetSelectedImage() {
  yield takeLatest(`category/getSelectedImage`, getSelectedImage);
}

export function* watchDownload() {
  yield takeLatest(`category/download`, download);
}

export default [
  watchGetCategoryList,
  watchGetCategory,
  watchDownload,
  watchGetItemsForCategory,
  watchCreateCategory,
  watchUpdateCategory,
  watchRemoveCategory,
  watchFetchAddItemsInCategory,
  watchUploadImage,
  watchGetSelectedImage,
];
