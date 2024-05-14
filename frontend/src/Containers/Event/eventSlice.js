import { produce } from 'immer';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  error: '',
  loading: false,
  items: [],
  reports: [],
  expenses: [],
  categories: [],
  selectedEvent: {},
  storageLocations: [],
  volunteeringActivities: [],
  collaboratorListForSelectEvent: [],
  inventoriesAssociatedWithSelectedEvent: [],
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    getSelectedEvent: (state) => {
      state.loading = true;
      state.error = '';
      state.selectedEvent = {};
    },
    getSelectedEventSuccess: (state, action) => {
      state.selectedEvent = action.payload;
      state.loading = false;
      state.error = '';
    },
    getSelectedEventFailure: (state) => {
      state.loading = false;
      state.error = '';
      state.selectedEvent = {};
    },
    getCollaboratorListForSelectedEvent: (state) => {
      state.loading = true;
      state.error = '';
      state.collaboratorListForSelectEvent = [];
    },
    getCollaboratorListForSelectedEventSuccess: (state, action) => {
      state.collaboratorListForSelectEvent = action.payload;
      state.loading = false;
      state.error = '';
    },
    getCollaboratorListForSelectedEventFailure: (state) => {
      state.loading = false;
      state.error = '';
      state.collaboratorListForSelectEvent = [];
    },
    getReportsForSelectedEvent: (state) => {
      state.loading = true;
      state.error = '';
      state.reports = [];
    },
    getReportsForSelectedEventSuccess: (state, action) => {
      state.reports = action.payload;
      state.loading = false;
      state.error = '';
    },
    getReportsForSelectedEventFailure: (state) => {
      state.loading = false;
      state.error = '';
      state.reports = [];
    },
    updateItemDetails: (state) => {
      state.loading = true;
      state.error = '';
    },
    updateItemDetailsSuccess: (state, action) => {
      const updatedItem = action.payload;
      const filterdItemList = state.items.filter((v) => v.id !== updatedItem.id);
      state.loading = false;
      state.error = '';
      state.items = [...filterdItemList, updatedItem];
    },
    updateItemDetailsFailure: (state) => {
      state.loading = false;
      state.error = '';
    },
    updateEventImage: (state) => {
      state.loading = true;
      state.error = '';
    },
    updateEventImageSuccess: (state, action) => {
      const { image_url } = action.payload;
      return produce(state, (draftState) => {
        draftState.loading = false;
        draftState.error = '';
        draftState.selectedEvent.image_url = image_url;
      });
    },
    updateEventImageFailure: (state) => {
      state.loading = false;
      state.error = '';
    },
    getVolunteeringActivities: (state) => {
      state.loading = true;
      state.error = '';
      state.volunteeringActivities = [];
    },
    getVolunteeringActivitiesSuccess: (state, action) => {
      state.volunteeringActivities = action.payload;
      state.loading = false;
      state.error = '';
    },
    getVolunteeringActivitiesFailure: (state) => {
      state.loading = false;
      state.error = '';
      state.volunteeringActivities = [];
    },
    addVolunteeringHours: (state) => {
      state.loading = true;
      state.error = '';
    },
    addVolunteeringHoursSuccess: (state, action) => {
      state.volunteeringActivities = [...state.volunteeringActivities, action.payload];
      state.loading = false;
      state.error = '';
    },
    addVolunteeringHoursFailure: (state) => {
      state.loading = false;
      state.error = '';
    },
    createNewReportAgainstEvent: (state) => {
      state.loading = true;
      state.error = '';
    },
    createNewReportAgainstEventSuccess: (state, action) => {
      state.reports = [...state.reports, action.payload];
      state.loading = false;
      state.error = '';
    },
    createNewReportAgainstEventFailure: (state) => {
      state.loading = false;
      state.error = '';
    },
    getExpenseList: (state) => {
      state.loading = true;
      state.error = '';
      state.expenses = [];
    },
    getExpenseListSuccess: (state, action) => {
      state.expenses = action.payload;
      state.loading = false;
      state.error = '';
    },
    getExpenseListFailure: (state) => {
      state.loading = false;
      state.error = '';
      state.expenses = [];
    },
    addExpenseList: (state) => {
      state.expenses = [];
      state.error = '';
      state.loading = true;
    },
    addExpenseListSuccess: (state, action) => {
      state.expenses = [...state.expenses, action.payload];
      state.loading = false;
      state.error = '';
    },
    addExpenseListFailure: (state) => {
      state.loading = false;
      state.error = '';
    },
    getCategoryList: (state) => {
      state.loading = true;
      state.error = '';
      state.categories = [];
    },
    getCategoryListSuccess: (state, action) => {
      state.categories = action.payload;
      state.loading = false;
      state.error = '';
    },
    getCategoryListFailure: (state) => {
      state.loading = false;
      state.error = '';
      state.categories = [];
    },
    getItemList: (state) => {
      state.loading = true;
      state.error = '';
      state.items = [];
    },
    getItemListSuccess: (state, action) => {
      state.items = action.payload;
      state.loading = false;
      state.error = '';
    },
    getItemListFailure: (state) => {
      state.loading = false;
      state.error = '';
      state.items = [];
    },
    addItem: (state) => {
      state.loading = true;
      state.error = '';
      state.items = [];
    },
    addItemSuccess: (state, action) => {
      state.items = [...state.items, action.payload];
      state.loading = false;
      state.error = '';
    },
    addItemFailure: (state) => {
      state.loading = false;
      state.error = '';
    },
    getStorageLocations: (state) => {
      state.loading = true;
      state.error = '';
      state.storageLocations = [];
    },
    getStorageLocationsSuccess: (state, action) => {
      state.storageLocations = action.payload;
      state.loading = false;
      state.error = '';
    },
    getStorageLocationsFailure: (state) => {
      state.loading = false;
      state.error = '';
      state.storageLocations = [];
    },
    getAllInventoriesAssociatedWithEvent: (state) => {
      state.error = '';
      state.loading = true;
    },
    getAllInventoriesAssociatedWithEventSuccess: (state, action) => {
      state.error = '';
      state.loading = false;
      state.inventoriesAssociatedWithSelectedEvent = action.payload;
    },
    getAllInventoriesAssociatedWithEventFailure: (state) => {
      state.error = '';
      state.loading = false;
      state.inventoriesAssociatedWithSelectedEvent = [];
    },
    // flushUpdate fn is used to only update the reducer
    // no saga action is involved
    flushUpdate: (state, action) => {
      const { attendees, sharable_groups, updated_by } = action.payload;
      state.selectedEvent = {
        ...state.selectedEvent,
        attendees,
        sharable_groups,
        updated_by,
      };
    },
    // flushGeneralEventDetails fn is used to only update the reducer
    // no saga action is involved
    flushGeneralEventDetails: (state, action) => {
      const { title, deactivated, comments, max_attendees, updated_by } = action.payload;
      state.selectedEvent = {
        ...state.selectedEvent,
        title,
        deactivated,
        comments,
        max_attendees,
        updated_by,
      };
    },
  },
});

export const { actions: eventActions } = eventSlice;
export default eventSlice.reducer;
