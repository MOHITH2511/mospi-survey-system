import React, { useCallback, useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface UploadSectionProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onUpload, isLoading }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onUpload(e.dataTransfer.files[0]);
      }
    },
    [onUpload]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        textAlign: 'center',
        border: dragOver ? '2px dashed #1976d2' : '2px dashed #ccc',
        backgroundColor: dragOver ? '#f3f8ff' : '#fafafa',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      <input
        type="file"
        id="file-upload"
        accept="application/pdf"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <CloudUploadIcon sx={{ fontSize: 60, color: dragOver ? '#1976d2' : '#9e9e9e', mb: 2 }} />
      <Typography variant="h6" color="textSecondary" gutterBottom>
        {isLoading ? 'Parsing PDF...' : 'Drag & Drop PDF Survey Here'}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        or click to browse
      </Typography>
      <Button variant="contained" component="span" disabled={isLoading}>
        Select File
      </Button>
    </Paper>
  );
};
