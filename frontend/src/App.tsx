import { useState, useCallback, useMemo } from 'react';
import { Container, Grid, Typography, Paper, Box, CssBaseline, ThemeProvider, createTheme, AppBar, Toolbar, Button } from '@mui/material';
import JsonView from '@uiw/react-json-view';
import { UploadSection } from './components/UploadSection';
import { ReviewTree } from './components/ReviewTree';
import { EditorPanel } from './components/EditorPanel';
import type { SurveyDto, SurveyNode } from './types';
import { uploadPdf } from './api';
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query';
import React from 'react';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const queryClient = new QueryClient();

const MemoizedJsonView = React.memo(JsonView);

function MainContent() {
  const [surveyData, setSurveyData] = useState<SurveyDto | null>(null);
  const [activeNode, setActiveNode] = useState<SurveyNode | null>(null);

  const uploadMutation = useMutation({
    mutationFn: uploadPdf,
    onSuccess: (data) => {
      setSurveyData(data);
      setActiveNode(null);
    },
    onError: (error) => {
      console.error('Upload failed:', error);
      alert('Failed to parse the PDF. Please ensure the backend is running and the file is a valid survey PDF.');
    }
  });

  const handleNodeUpdate = useCallback(() => {
    setSurveyData((prev) => prev ? { ...prev } : null);
  }, []);

  const handleNodeSelect = useCallback((node: SurveyNode) => {
    setActiveNode(node);
  }, []);

  const memoizedSections = useMemo(() => surveyData?.sections || [], [surveyData?.sections]);

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" elevation={0} sx={{ backgroundColor: '#fff', color: '#333', borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            MOSPI Survey Parser <Typography component="span" variant="caption" sx={{ ml: 1, bgcolor: '#e3f2fd', color: '#1565c0', px: 1, py: 0.5, borderRadius: 1 }}>Phase 1.2</Typography>
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        {!surveyData ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <Box sx={{ width: '100%', maxWidth: 600 }}>
              <UploadSection onUpload={(file) => uploadMutation.mutate(file)} isLoading={uploadMutation.isPending} />
            </Box>
          </Box>
        ) : (
          <Grid container spacing={2} sx={{ height: 'calc(100vh - 120px)' }}>
            <Grid item xs={12} md={3} sx={{ height: '100%' }}>
              <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} elevation={2}>
                <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 1, mb: 2 }}>
                  Structure
                </Typography>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  {surveyData.title}
                </Typography>
                <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                  <ReviewTree nodes={memoizedSections} onNodeSelect={handleNodeSelect} />
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4} sx={{ height: '100%' }}>
              <Paper sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} elevation={2}>
                <EditorPanel node={activeNode} onUpdate={handleNodeUpdate} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={5} sx={{ height: '100%' }}>
              <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#fafafa' }} elevation={2}>
                <Box sx={{ borderBottom: '1px solid #eee', pb: 1, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">
                    Live JSON
                  </Typography>
                  <Box>
                    <Button 
                      variant="contained" 
                      color="primary"
                      size="small" 
                      sx={{ mr: 1 }}
                      onClick={async () => {
                        try {
                          // Dynamic import to avoid changing top-level imports significantly for this quick fix
                          const { createSurvey } = await import('./api');
                          await createSurvey(surveyData);
                          alert('Survey saved successfully to the database!');
                        } catch (e) {
                          alert('Failed to save survey. Make sure the database and backend are running.');
                        }
                      }}
                    >
                      Save to Database
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(surveyData, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'survey_structure.json';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                    >
                      Download JSON
                    </Button>
                  </Box>
                </Box>
                <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1, backgroundColor: '#fff', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                  <MemoizedJsonView value={surveyData} displayDataTypes={false} displayObjectSize={false} collapsed={2} />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MainContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
