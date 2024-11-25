import { takeLatest, put, call } from 'redux-saga/effects';
import { REACT_APP_LOCALHOST_URL } from '../../utils/Common';
import { maintenancePlanActions } from './maintenanceSlice';
import instance from '@utils/Instances';

const DEFAULT_LIMIT = 10;
const MAINTENANCE_STATUS_OPTION_TYPE = 'maintenance';
const BASEURL = `${REACT_APP_LOCALHOST_URL}/api/v1`;

export function* getPlans(action) {
  try {
    const userID = localStorage.getItem('userID');
    const params = new URLSearchParams();
    params.append('id', userID);
    if (action.payload) {
      params.append('limit', action.payload);
    } else {
      params.append('limit', DEFAULT_LIMIT);
    }
    const response = yield call(instance.get, `${BASEURL}/maintenance-plans?${params.toString()}`);
    const data = Array.isArray(response.data) ? response.data : [];
    yield put(maintenancePlanActions.getPlansSuccess(data));
  } catch (e) {
    yield put(maintenancePlanActions.getPlansFailure(e));
  }
}

export function* getStatusOptions() {
  try {
    const userID = localStorage.getItem('userID');
    const params = new URLSearchParams();
    params.append('id', userID);
    params.append('type', MAINTENANCE_STATUS_OPTION_TYPE);
    const response = yield call(instance.get, `${BASEURL}/status/list?${params.toString()}`);
    yield put(maintenancePlanActions.getStatusOptionsSuccess(response.data));
  } catch (e) {
    yield put(maintenancePlanActions.getStatusOptionsFailure(e));
  }
}

export function* createPlan(action) {
  try {
    const userID = localStorage.getItem('userID');
    const response = yield call(instance.post, `${BASEURL}/plan`, { ...action.payload, created_by: userID });
    yield put(maintenancePlanActions.createPlanSuccess(response.data));
  } catch (e) {
    yield put(maintenancePlanActions.createPlanFailure(e));
  }
}

export function* updatePlan(action) {
  try {
    const { id } = action.payload;
    const userID = localStorage.getItem('userID');
    const response = yield call(instance.put, `${BASEURL}/plan/${id}`, { ...action.payload, updated_by: userID });
    yield put(maintenancePlanActions.updatePlanSuccess(response.data));
  } catch (e) {
    yield put(maintenancePlanActions.updatePlanFailure(e));
  }
}

export function* removePlan(action) {
  try {
    const response = yield call(instance.delete, `${BASEURL}/plan/${action.payload}`);
    yield put(maintenancePlanActions.removePlanSuccess(response.data));
  } catch (e) {
    yield put(maintenancePlanActions.removePlanFailure(e));
  }
}

export function* getSelectedMaintenancePlan(action) {
  try {
    const mID = action.payload;
    const userID = localStorage.getItem('userID');
    const params = new URLSearchParams();
    params.append('id', userID);
    params.append('mID', mID);
    const response = yield call(instance.get, `${BASEURL}/plan?${params.toString()}`);
    yield put(maintenancePlanActions.getSelectedMaintenancePlanSuccess(response.data));
  } catch (e) {
    yield put(maintenancePlanActions.getSelectedMaintenancePlanFailure(e));
  }
}

export function* getItemsInMaintenancePlan(action) {
  try {
    const mID = action.payload;
    const userID = localStorage.getItem('userID');
    const params = new URLSearchParams();
    params.append('id', userID);
    params.append('mID', mID);
    params.append('limit', DEFAULT_LIMIT);
    const response = yield call(instance.get, `${BASEURL}/plans/items?${params.toString()}`);
    yield put(maintenancePlanActions.getItemsInMaintenancePlanSuccess(response.data));
  } catch (e) {
    yield put(maintenancePlanActions.getItemsInMaintenancePlanFailure(e));
  }
}

export function* fetchAddItemsInPlan(action) {
  try {
    const userID = localStorage.getItem('userID');
    const { id, rowSelected, collaborators } = action.payload;
    const response = yield call(instance.post, `${BASEURL}/plans/items`, {
      id,
      userID,
      assetIDs: rowSelected,
      collaborators: collaborators,
    });
    yield put(maintenancePlanActions.addItemsInPlanSuccess(response.data));
  } catch (e) {
    yield put(maintenancePlanActions.addItemsInPlanFailure(e));
  }
}

export function* download() {
  try {
    const userID = localStorage.getItem('userID');
    const params = new URLSearchParams();
    params.append('id', userID);
    const response = yield call(instance.get, `${BASEURL}/maintenance-plans?${params.toString()}`);
    yield put(maintenancePlanActions.downloadSuccess(response.data));
  } catch (e) {
    yield put(maintenancePlanActions.downloadFailure(e));
  }
}

export function* uploadImage(action) {
  try {
    const { id, selectedImage } = action.payload;
    const formData = new FormData();
    formData.append('imageSrc', selectedImage);
    const response = yield call(instance.post, `${BASEURL}/${id}/uploadImage`, formData);
    yield put(maintenancePlanActions.uploadImageSuccess(response.data));
  } catch (e) {
    yield put(maintenancePlanActions.uploadImageFailure(e));
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
    yield put(maintenancePlanActions.getSelectedImageSuccess(avatarUrl));
  } catch (e) {
    yield put(maintenancePlanActions.getSelectedImageFailure(e));
  }
}

export function* watchGetPlanList() {
  yield takeLatest(`maintenancePlan/getPlans`, getPlans);
}

export function* watchGetStatusOptions() {
  yield takeLatest(`maintenancePlan/getStatusOptions`, getStatusOptions);
}

export function* watchCreatePlan() {
  yield takeLatest(`maintenancePlan/createPlan`, createPlan);
}

export function* watchUpdatePlan() {
  yield takeLatest(`maintenancePlan/updatePlan`, updatePlan);
}

export function* watchRemovePlan() {
  yield takeLatest(`maintenancePlan/removePlan`, removePlan);
}

export function* watchGetSelectedMaintenancePlan() {
  yield takeLatest(`maintenancePlan/getSelectedMaintenancePlan`, getSelectedMaintenancePlan);
}

export function* watchGetItemsInMaintenancePlan() {
  yield takeLatest(`maintenancePlan/getItemsInMaintenancePlan`, getItemsInMaintenancePlan);
}

export function* watchFetchAddItemsInPlan() {
  yield takeLatest(`maintenancePlan/addItemsInPlan`, fetchAddItemsInPlan);
}

export function* watchDownload() {
  yield takeLatest(`maintenancePlan/download`, download);
}

export function* watchUploadImage() {
  yield takeLatest(`maintenancePlan/uploadImage`, uploadImage);
}

export function* watchGetSelectedImage() {
  yield takeLatest(`maintenancePlan/getSelectedImage`, getSelectedImage);
}


export default [
  watchGetPlanList,
  watchGetStatusOptions,
  watchCreatePlan,
  watchDownload,
  watchUpdatePlan,
  watchRemovePlan,
  watchFetchAddItemsInPlan,
  watchGetItemsInMaintenancePlan,
  watchGetSelectedMaintenancePlan,
  watchGetSelectedImage,
  watchUploadImage,
];
