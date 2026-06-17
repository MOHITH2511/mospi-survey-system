import React from 'react';
import { Box, Typography, TextField, FormControlLabel, Checkbox, Select, MenuItem, InputLabel, FormControl, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import type { SurveyNode } from '../types';

interface EditorPanelProps {
  node: SurveyNode | null;
  onUpdate: () => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = React.memo(({ node, onUpdate }) => {
  if (!node) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
        <Typography>Select a node from the tree to edit</Typography>
      </Box>
    );
  }

  const handleChange = (field: keyof SurveyNode, value: any) => {
    (node as any)[field] = value;
    onUpdate();
  };

  const isSection = node.type === 'section';
  const isTable = isSection && node.sectionType === 'TABLE';

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Edit {isSection ? 'Section' : 'Question'}
      </Typography>

      {isSection ? (
        <TextField
          fullWidth
          label="Section Title"
          value={node.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          margin="normal"
        />
      ) : (
        <TextField
          fullWidth
          label="Label"
          value={node.label || ''}
          onChange={(e) => handleChange('label', e.target.value)}
          margin="normal"
          multiline
          maxRows={4}
        />
      )}

      {!isSection && (
        <>
          <FormControl fullWidth margin="normal">
            <InputLabel>Question Type</InputLabel>
            <Select
              value={node.questionType || 'TEXT'}
              label="Question Type"
              onChange={(e) => handleChange('questionType', e.target.value)}
            >
              <MenuItem value="TEXT">Text</MenuItem>
              <MenuItem value="NUMBER">Number</MenuItem>
              <MenuItem value="SELECT">Select</MenuItem>
              <MenuItem value="RADIO">Radio</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={node.required || false}
                onChange={(e) => handleChange('required', e.target.checked)}
              />
            }
            label="Required"
          />
        </>
      )}

      {/* Dictionary Preview */}
      {node.dictionary && node.dictionary.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>Dictionary Options</Typography>
          <Paper variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Label</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {node.dictionary.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.label}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      )}

      {/* Table Preview (Columns and Rows) */}
      {isTable && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>Table Preview</Typography>
          <Paper variant="outlined" sx={{ overflowX: 'auto', maxHeight: 300 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {node.columns && node.columns.length > 0 ? (
                    node.columns.map((col, idx) => (
                      <TableCell key={idx}>{col}</TableCell>
                    ))
                  ) : (
                    <TableCell>No structured columns detected</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {node.rows && node.rows.length > 0 ? (
                  node.rows.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell colSpan={Math.max(1, node.columns?.length || 1)}>
                        {row}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={Math.max(1, node.columns?.length || 1)} sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                      [Raw table content preserved in JSON]
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      )}
    </Box>
  );
});
