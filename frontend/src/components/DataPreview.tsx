import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Checkbox, FormControlLabel, FormGroup, Popover, IconButton, CircularProgress } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

interface DataPreviewProps {
  setUploadedData: (data: any[]) => void;
  setUploadedHeaders: (headers: string[]) => void;
  setUploadedFilename: (filename: string) => void;
  uploadedData: any[];
  uploadedHeaders: string[];
  uploadedFilename: string;
}

const ROWS_PER_PAGE = 5; // Display 5 rows at a time
const MAX_COL_LENGTH = 50; // Max characters for column display

const DataPreview: React.FC<DataPreviewProps> = ({ setUploadedData, setUploadedHeaders, setUploadedFilename, uploadedData, uploadedHeaders, uploadedFilename }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set());
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    // Load visible columns from local storage on mount
    const savedVisibleColumns = localStorage.getItem('visibleColumns');
    if (savedVisibleColumns) {
      setVisibleColumns(new Set(JSON.parse(savedVisibleColumns)));
    }
  }, []);

  useEffect(() => {
    // Save visible columns to local storage whenever they change
    localStorage.setItem('visibleColumns', JSON.stringify(Array.from(visibleColumns)));
  }, [visibleColumns]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('/api/upload_csv', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setUploadedFilename(file.name);
        setUploadedHeaders(response.data.headers);
        // setHeadersState(response.data.headers); // This state is no longer needed, using headers directly
        setUploadedData(response.data.allData);
        setUploadedData(response.data.allData.slice(0, ROWS_PER_PAGE)); // Initial sample for LiveTestWindow

        // Initialize visible columns: if nothing saved, show all
        if (visibleColumns.size === 0) {
          setVisibleColumns(new Set(response.data.headers));
        }
        setCurrentPage(0);
      } catch (error) {
        console.error("Error uploading file:", error);
        // Handle error display in UI
      }
    }
  };

  const handleNextPage = () => {
    const newPage = currentPage + 1;
    if (newPage * ROWS_PER_PAGE < uploadedData.length) {
      setCurrentPage(newPage);
      setUploadedData(uploadedData.slice(newPage * ROWS_PER_PAGE, (newPage + 1) * ROWS_PER_PAGE));
    }
  };

  const handlePrevPage = () => {
    const newPage = currentPage - 1;
    if (newPage >= 0) {
      setCurrentPage(newPage);
      setUploadedData(uploadedData.slice(newPage * ROWS_PER_PAGE, (newPage + 1) * ROWS_PER_PAGE));
    }
  };

  const handleColumnVisibilityChange = (column: string) => {
    const newVisibleColumns = new Set(visibleColumns);
    if (newVisibleColumns.has(column)) {
      newVisibleColumns.delete(column);
    } else {
      newVisibleColumns.add(column);
    }
    setVisibleColumns(newVisibleColumns);
  };

  const handleShowAllColumns = () => {
    setVisibleColumns(new Set(uploadedHeaders));
  };

  const handleHideAllColumns = () => {
    setVisibleColumns(new Set());
  };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'column-visibility-popover' : undefined;

  const truncateText = (text: string | number | boolean) => {
    const str = String(text);
    if (str.length > MAX_COL_LENGTH) {
      return str.substring(0, MAX_COL_LENGTH - 3) + '...';
    }
    return str;
  };

  const displayedHeaders = uploadedHeaders.filter((header: string) => visibleColumns.has(header));
  const displayedRows = uploadedData && Array.isArray(uploadedData) ? uploadedData.slice(currentPage * ROWS_PER_PAGE, (currentPage + 1) * ROWS_PER_PAGE) : [];

  return (
    <Paper sx={{ p: 2, border: '1px solid #e0e0e0' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Data Preview</Typography>
        <Box>
          <Button variant="contained" component="label" sx={{ mr: 1 }} disabled={uploading}>
            {uploading ? <CircularProgress size={24} /> : 'Load CSV'}
            <input type="file" hidden onChange={handleFileChange} accept=".csv" />
          </Button>
          <IconButton onClick={handlePopoverOpen} aria-describedby={id}>
            {visibleColumns.size === uploadedHeaders.length && uploadedHeaders.length > 0 ? <Visibility /> : <VisibilityOff />}
          </IconButton>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Column Visibility</Typography>
              <Button onClick={handleShowAllColumns} size="small">Show All</Button>
              <Button onClick={handleHideAllColumns} size="small">Hide All</Button>
              <FormGroup>
                {uploadedHeaders.map((header: string) => (
                  <FormControlLabel
                    key={header}
                    control={
                      <Checkbox
                        checked={visibleColumns.has(header)}
                        onChange={() => handleColumnVisibilityChange(header)}
                      />
                    }
                    label={header}
                  />
                ))}
              </FormGroup>
            </Box>
          </Popover>
        </Box>
      </Box>
      {uploadedFilename && <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>File: {uploadedFilename} ({uploadedData.length} rows)</Typography>}
      
      <TableContainer sx={{ maxHeight: 440, border: '1px solid #f0f0f0' }}>
        <Table stickyHeader size="small" sx={{ '& .MuiTableCell-root': { border: '1px solid #e0e0e0' } }}>
          <TableHead>
            <TableRow>
              {displayedHeaders.map((header: string) => (
                <TableCell key={header} sx={{ fontWeight: 'bold' }}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedRows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {displayedHeaders.map((header: string) => (
                  <TableCell key={header}>{truncateText(row[header])}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <IconButton onClick={handlePrevPage} disabled={currentPage === 0}>
          <ArrowBackIos />
        </IconButton>
        <Typography variant="body2" sx={{ mx: 2, alignSelf: 'center' }}>
          Page {currentPage + 1} of {Math.ceil(uploadedData.length / ROWS_PER_PAGE)}
        </Typography>
        <IconButton onClick={handleNextPage} disabled={(currentPage + 1) * ROWS_PER_PAGE >= uploadedData.length}>
          <ArrowForwardIos />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default DataPreview;