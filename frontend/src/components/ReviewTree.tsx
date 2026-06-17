import React from 'react';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import type { SurveyNode } from '../types';
import { Box, Typography } from '@mui/material';

interface ReviewTreeProps {
  nodes: SurveyNode[];
  onNodeSelect: (node: SurveyNode) => void;
}

export const ReviewTree: React.FC<ReviewTreeProps> = React.memo(({ nodes, onNodeSelect }) => {
  const renderTree = (nodes: SurveyNode[]) => {
    return nodes.map((node) => {
      const displayText = node.title || node.label || `[${node.type}]`;
      
      return (
        <TreeItem
          key={node.id}
          itemId={node.id}
          onClick={(e) => {
             e.stopPropagation();
             onNodeSelect(node);
          }}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                {displayText}
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                ({node.sectionType || node.type})
              </Typography>
            </Box>
          }
        >
          {Array.isArray(node.children) && node.children.length > 0 ? renderTree(node.children) : null}
        </TreeItem>
      );
    });
  };

  return (
    <Box sx={{ minHeight: 200, flexGrow: 1, overflowY: 'auto' }}>
      <SimpleTreeView>
        {renderTree(nodes)}
      </SimpleTreeView>
    </Box>
  );
});
