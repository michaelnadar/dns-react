import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const columns = [
  {
    field: 'id',
    headerName: 'ID',
    width: 100,
    editable: false,
  },
  {
    field: 'ResourceRecords',
    headerName: 'Resource Records',
    width: 300,
    renderCell: (params) => (
      <div>
        {params.value.map((record, index) => (
          <div className='' key={index}>{record.Value}</div>
        ))}
      </div>
    ),
    editable: true,
  },
];

const rows = [
  { id: 1, ResourceRecords: [{ Value: '192.168.1.1' }] },
  { id: 2, ResourceRecords: [{ Value: '192.168.1.2' }] },
];

const EditableDataGrid = () => {
    const [open, setOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);
    const [editedValue, setEditedValue] = useState('');
 //   const [rows,setRows] = useState([]);
  const handleClickCell = (params) => {
    setCurrentRow(params.row);
    setOpen(true);
  };

  const handleSaveChanges = () => {
    const updatedRows = rows.map((row) =>
      row.id === currentRow.id ? { ...row, ResourceRecords: [{ Value: editedValue }] } : row
    );
    //setRows(updatedRows);
    setOpen(false);
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        editRowsModel={{}}
        onCellClick={(params) => {
          const { field } = params.colDef;
          if (field === 'ResourceRecords') {
            handleClickCell(params);
          }
        }}
      />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Resource Records</DialogTitle>
        <DialogContent>
          {currentRow && (
            <div>
              {currentRow.ResourceRecords.map((record, index) => (
                <div key={index}>
                  <input
                    type="text"
                    value={editedValue}
                    onChange={(e) => setEditedValue(e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveChanges} color="primary">
            Save Changes
          </Button>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditableDataGrid;
