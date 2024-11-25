import { takeLatest, put, call, takeEvery } from 'redux-saga/effects';
import { REACT_APP_LOCALHOST_URL } from '../../utils/Common';
import { inventoryActions } from './inventorySlice';
import instance from '@utils/Instances';

const BASEURL = `${REACT_APP_LOCALHOST_URL}/api/v1/profile`;
const STORAGE_LOCATIONS_BASE_URL = `${REACT_APP_LOCALHOST_URL}/api/v1`;

export function* fetchAllInventoriesForUser(action) {
  try {
    const params = new URLSearchParams();
    const USER_ID = localStorage.getItem('userID');

    if (action.payload) {
      const { since } = action.payload;
      params.append('since', since);
    }

    const response = yield call(instance.get, `${BASEURL}/${USER_ID}/inventories?${params.toString()}`);
    yield put(inventoryActions.getAllInventoriesForUserSuccess(response.data || {}));
  } catch (e) {
    yield put(inventoryActions.getAllInventoriesForUserFailure(e));
  }
}

export function* fetchInvByID({ payload }) {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.get, `${BASEURL}/${USER_ID}/inventories/${payload}`);
    yield put(inventoryActions.getInvByIDSuccess(response.data || []));
  } catch (e) {
    yield put(inventoryActions.getInvByIDFailure(e));
  }
}

export function* fetchAddNewInventory(action) {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.post, `${BASEURL}/${USER_ID}/inventories`, {
      ...action.payload,
      created_by: USER_ID,
    });
    yield put(inventoryActions.addInventorySuccess(response.data));
  } catch (e) {
    yield put(inventoryActions.addInventoryFailure(e));
  }
}

export function* fetchAddBulkInventory(action) {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.post, `${BASEURL}/${USER_ID}/inventories/bulk`, { ...action.payload });
    yield put(inventoryActions.addBulkInventorySuccess(response.data));
  } catch (e) {
    yield put(inventoryActions.addBulkInventoryFailure(e));
  }
}

export function* fetchUpdateExistingInventoryDetails(action) {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.put, `${BASEURL}/${USER_ID}/inventories`, { ...action.payload });
    yield put(inventoryActions.updateInventorySuccess(response.data));
  } catch (e) {
    yield put(inventoryActions.updateInventoryFailure(e));
  }
}

export function* fetchUpdateAssetCol(action) {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.put, `${BASEURL}/${USER_ID}/inventories/${action.payload.assetID}`, {
      ...action.payload,
    });
    yield put(inventoryActions.updateAssetColSuccess(response.data || []));
  } catch (e) {
    yield put(inventoryActions.updateAssetColFailure(e));
  }
}

export function* fetchRemoveInventoryRows(action) {
  try {
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.post, `${BASEURL}/${USER_ID}/inventories/prune`, { ...action.payload });
    yield put(inventoryActions.removeInventoryRowsSuccess(response.data));
  } catch (e) {
    yield put(inventoryActions.removeInventoryRowsFailure(e));
  }
}

export function* fetchStorageLocations() {
  try {
    const response = yield call(instance.get, `${STORAGE_LOCATIONS_BASE_URL}/locations`);
    yield put(inventoryActions.getStorageLocationsSuccess(response.data || []));
  } catch (e) {
    yield put(inventoryActions.getStorageLocationsFailure(e));
  }
}

export function* retrieveSelectedImage(action) {
  try {
    const { assetID, filename } = action.payload;
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.get, `/filestat/view/${USER_ID}/${filename}`, { responseType: 'blob' });
    const imageUrl = URL.createObjectURL(response.data);
    yield put(inventoryActions.retrieveSelectedImageSuccess({ assetID: assetID, imageData: imageUrl || [] }));
  } catch (e) {
    yield put(inventoryActions.retrieveSelectedImageFailure(e));
  }
}

export function* createInventoryImage(action) {
  try {
    const { assetID, imageData } = action.payload;
    const USER_ID = localStorage.getItem('userID');
    const response = yield call(instance.post, `/filestat/create/${USER_ID}/A/${assetID}`, imageData);
    yield put(inventoryActions.createInventoryImageSuccess(response.data || []));
  } catch (e) {
    yield put(inventoryActions.createInventoryImageFailure(e));
  }
}

/********************************
 * WATCHER FUNCTIONS BELOW HERE
 ********************************/

export function* watchFetchAllInventoriesForUser() {
  yield takeLatest(`inventory/getAllInventoriesForUser`, fetchAllInventoriesForUser);
}

export function* watchFetchInvByID() {
  yield takeLatest(`inventory/getInvByID`, fetchInvByID);
}

export function* watchFetchAddNewInventory() {
  yield takeLatest(`inventory/addInventory`, fetchAddNewInventory);
}

export function* watchFetchAddBulkInventory() {
  yield takeLatest(`inventory/addBulkInventory`, fetchAddBulkInventory);
}

export function* watchUpdateExistingInventoryDetails() {
  yield takeLatest(`inventory/updateInventory`, fetchUpdateExistingInventoryDetails);
}

export function* watchFetchRemoveInventoryRows() {
  yield takeLatest(`inventory/removeInventoryRows`, fetchRemoveInventoryRows);
}

export function* watchFetchAllStorageLocations() {
  yield takeLatest(`inventory/getStorageLocations`, fetchStorageLocations);
}

export function* watchUpdateAssetCol() {
  yield takeLatest(`inventory/updateAssetCol`, fetchUpdateAssetCol);
}

export function* watchRetrieveSelectedImage() {
  yield takeEvery(`inventory/retrieveSelectedImage`, retrieveSelectedImage);
}

export function* watchCreateInventoryImage() {
  yield takeLatest(`inventory/createInventoryImage`, createInventoryImage);
}

export default [
  watchFetchInvByID,
  watchUpdateAssetCol,
  watchFetchAddNewInventory,
  watchRetrieveSelectedImage,
  watchCreateInventoryImage,
  watchFetchAddBulkInventory,
  watchFetchRemoveInventoryRows,
  watchFetchAllStorageLocations,
  watchFetchAllInventoriesForUser,
  watchUpdateExistingInventoryDetails,
];
