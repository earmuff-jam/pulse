import { takeLatest, put, call } from 'redux-saga/effects';
import { REACT_APP_LOCALHOST_URL } from '../../utils/Common';
import instance from '@utils/Instances';
import { assetSummaryActions } from './SummarySlice';

const BASEURL = `${REACT_APP_LOCALHOST_URL}/api/v1`;

export function* getAssetSummary() {
  try {
    const userID = localStorage.getItem('userID');
    const params = new URLSearchParams();
    params.append('id', userID);
    const response = yield call(instance.get, `${BASEURL}/summary?${params.toString()}`);
    yield put(assetSummaryActions.getAssetSummarySuccess(response.data));
  } catch (e) {
    yield put(assetSummaryActions.getAssetSummaryFailure(e));
  }
}

export function* watchGetAssetSummary() {
  yield takeLatest(`assetSummary/getAssetSummary`, getAssetSummary);
}

export default [watchGetAssetSummary];
