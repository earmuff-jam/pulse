import { useEffect, useState } from 'react';
import { Autocomplete, IconButton, Stack, TextField } from '@mui/material';
import {
  CheckRounded,
  CloseRounded,
  EditRounded,
  GridViewRounded,
  SearchRounded,
  ViewListRounded,
} from '@mui/icons-material';
import RowHeader from '../../utils/RowHeader';
import SimpleModal from '@common/SimpleModal/SimpleModal';
import { ConfirmationBoxModal, generateTitleColor } from '../../utils/utils';
import TableComponent from './TableComponent';
import GridComponent from './GridComponent';
import { VIEW_INVENTORY_LIST_HEADERS } from './constants';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AddInventoryDetail from './AddInventory/AddInventoryDetail';
import VerticalMenu from './AddInventory/VerticalMenu';
import { inventoryActions } from './inventorySlice';
import AddBulkUploadInventory from './AddInventory/AddBulkUploadInventory';
import ViewItemDetails from './ViewItemDetails/ViewItemDetails';

const MODAL_STATE = {
  NONE: 'none',
  ADD_ITEM: 'item',
  BULK_ITEM: 'bulk',
  MORE_DETAILS: 'more',
  ASSIGN_CATEGORY: 'assign_category',
  ASSIGN_MAINTENANCE_PLAN: 'assign_maintenance_plan',
};

const InventoryList = ({ hideActionMenu = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, inventories } = useSelector((state) => state.inventory);

  const [showSearch, setShowSearch] = useState(false);
  const [options, setOptions] = useState([]);
  const [inputColumn, setInputColumn] = useState('');
  const [editLineItem, setEditLineItem] = useState({ editItem: false, rowID: -1, column: '' });
  const [selectedRow, setSelectedRow] = useState([]); // to display more details
  const [rowSelected, setRowSelected] = useState([]); // this is for checkbox and associated events
  const [gridMode, setGridMode] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [idToDelete, setIdToDelete] = useState(-1);
  const [modalState, setModalState] = useState(MODAL_STATE.NONE);

  const handleCloseModal = () => setModalState(MODAL_STATE.NONE);
  const handleAddInventory = () => setModalState(MODAL_STATE.ADD_ITEM);
  const handleBulkInventory = () => setModalState(MODAL_STATE.BULK_ITEM);

  // checkbox actions
  const handleRowSelection = (_, id) => {
    if (id === 'all') {
      if (rowSelected.length === 0) {
        setRowSelected(inventories.map((v) => v.id));
      } else {
        setRowSelected([]);
      }
    } else {
      const selectedIndex = rowSelected.indexOf(id);
      let draftSelected = [];
      if (selectedIndex === -1) {
        draftSelected = draftSelected.concat(rowSelected, id);
      } else if (selectedIndex === 0) {
        draftSelected = draftSelected.concat(rowSelected.slice(1));
      } else if (selectedIndex === rowSelected.length - 1) {
        draftSelected = draftSelected.concat(rowSelected.slice(0, -1));
      } else if (selectedIndex > 0) {
        draftSelected = draftSelected.concat(rowSelected.slice(0, selectedIndex), rowSelected.slice(selectedIndex + 1));
      }
      setRowSelected(draftSelected);
    }
  };

  const updateSelectedCol = (rowID, columnName, inputColumn) => {
    dispatch(inventoryActions.updateAssetCol({ assetID: rowID, columnName, inputColumn }));
  };

  const populateIcon = (editLineItem, row, column, inputColumn, setInputColumn) => {
    if (editLineItem.editItem && editLineItem.rowID === row.id && editLineItem.column === column && inputColumn) {
      return (
        <CheckRounded
          sx={{ height: '1rem', width: '1rem', marginLeft: '0.5rem', cursor: 'pointer' }}
          color="primary"
          onClick={() => {
            updateSelectedCol(row.id, editLineItem.column, inputColumn);
            setInputColumn('');
            setEditLineItem({ editItem: false, rowID: -1, column: '' });
          }}
        />
      );
    } else if (editLineItem.editItem && editLineItem.rowID === row.id && editLineItem.column === column) {
      return (
        <CloseRounded
          sx={{ height: '1rem', width: '1rem', marginLeft: '0.5rem', cursor: 'pointer' }}
          onClick={() => setEditLineItem({ editItem: false, rowID: -1, column: '' })}
        />
      );
    } else {
      return (
        <EditRounded
          sx={{ height: '1rem', width: '1rem', marginLeft: '0.5rem', cursor: 'pointer' }}
          onClick={() => setEditLineItem({ editItem: true, rowID: row.id, column: column })}
        />
      );
    }
  };

  const rowFormatter = (row, columnName, columnData) => {
    const handleInputChange = (ev) => {
      const value = ev.target.value;
      if (!(isNaN(value) || parseInt(value) <= 0)) {
        // only +ve numbers
        setInputColumn(value);
      }
    };

    if (['price', 'quantity'].includes(columnName)) {
      return (
        <Stack direction="row" alignItems="center">
          {editLineItem.editItem && editLineItem.rowID === row.id && editLineItem.column === columnName ? (
            <TextField variant="standard" label={row[columnName]} value={inputColumn} onChange={handleInputChange} />
          ) : row[columnName] <= 0 ? (
            '-'
          ) : (
            row[columnName]
          )}
          {populateIcon(editLineItem, row, columnName, inputColumn, setInputColumn)}
        </Stack>
      );
    } else if (columnData.modifier) {
      return columnData.modifier(row[columnName] || '-');
    } else {
      return row[columnName] || '-';
    }
  };

  const onRowSelect = (row) => {
    setModalState(MODAL_STATE.MORE_DETAILS);
    setSelectedRow(row);
  };

  const resetSelection = () => {
    handleCloseModal();
  };

  const handleRemoveInventory = () => {
    setOpenDialog(true);
    setIdToDelete(rowSelected);
  };

  const reset = () => {
    setOpenDialog(false);
    setRowSelected([]);
    setIdToDelete(-1);
  };

  const confirmDelete = (id) => {
    if (id === -1) {
      return;
    }
    dispatch(inventoryActions.removeInventoryRows(rowSelected));
    reset();
  };

  const handleEdit = (itemID) => {
    navigate(`/inventories/${itemID}/update`);
  };

  useEffect(() => {
    if (Array.isArray(inventories)) {
      setOptions(inventories);
    }
  }, [loading]);

  useEffect(() => {
    dispatch(inventoryActions.getAllInventoriesForUser());
  }, []);

  return (
    <Stack flexGrow="1" spacing={2}>
      <Stack direction="row" justifyContent="space-between">
        <RowHeader title="Assets" caption={`Viewing ${options.length || 0} asset detail(s)`} />
        <Stack direction="row" alignItems="center">
          {showSearch ? (
            <Autocomplete
              sx={{ minWidth: '15rem' }}
              id="inventory-items-autocomplete"
              options={options}
              autoHighlight
              forcePopupIcon
              getOptionLabel={(option) => option.name}
              onChange={(_, newValue) => {
                if (newValue) {
                  setOptions(inventories.filter((option) => option.id === newValue.id));
                } else {
                  setOptions(inventories);
                }
              }}
              renderInput={(params) => <TextField variant="standard" {...params} label="Search ..." />}
            />
          ) : (
            <IconButton onClick={() => setShowSearch(!showSearch)}>
              <SearchRounded />
            </IconButton>
          )}
          <IconButton size="small" onClick={() => setGridMode(!gridMode)}>
            {!gridMode ? (
              <GridViewRounded color="primary" fontSize="small" />
            ) : (
              <ViewListRounded color="primary" fontSize="small" />
            )}
          </IconButton>
          <VerticalMenu
            rowSelected={rowSelected}
            handleAddInventory={handleAddInventory}
            handleBulkInventory={handleBulkInventory}
            handleRemoveInventory={handleRemoveInventory}
          />
        </Stack>
      </Stack>
      <Stack>
        {gridMode ? (
          <GridComponent
            isLoading={loading}
            data={options}
            rowSelected={rowSelected}
            handleRowSelection={handleRowSelection}
          />
        ) : (
          <TableComponent
            isLoading={loading}
            hideActionMenu={hideActionMenu}
            data={options}
            columns={Object.values(VIEW_INVENTORY_LIST_HEADERS).filter((v) => v.displayConcise)}
            rowFormatter={rowFormatter}
            generateTitleColor={generateTitleColor}
            rowSelected={rowSelected}
            onRowSelect={onRowSelect}
            handleRowSelection={handleRowSelection}
            handleEdit={handleEdit}
          />
        )}
      </Stack>
      {modalState === MODAL_STATE.ADD_ITEM && (
        <SimpleModal title="Add New Item" handleClose={handleCloseModal} maxSize="sm">
          <AddInventoryDetail handleClose={handleCloseModal} />
        </SimpleModal>
      )}
      {modalState === MODAL_STATE.BULK_ITEM && (
        <SimpleModal title="Add Bulk Item" handleClose={handleCloseModal} maxSize="sm">
          <AddBulkUploadInventory handleClose={handleCloseModal} />
        </SimpleModal>
      )}
      {modalState === MODAL_STATE.MORE_DETAILS && (
        <ViewItemDetails
          columns={Object.values(VIEW_INVENTORY_LIST_HEADERS)}
          resetSelection={resetSelection}
          title="View Item Details"
          selectedRow={selectedRow}
        />
      )}
      <ConfirmationBoxModal
        openDialog={openDialog}
        title="Confirm deletion"
        text="Delete this item?"
        textVariant="body2"
        handleClose={reset}
        maxSize="xs"
        deleteID={idToDelete}
        confirmDelete={confirmDelete}
      />
    </Stack>
  );
};

export default InventoryList;
