import React from 'react';
import Grid from '@material-ui/core/Grid';
import KubeCardsAppBar from './KubeCardsToolbar';
import KubeCardsAppDrawer from './KubeCardsAppDrawer';

const App: React.FC = () => {
  return (
    <Grid container direction="row" wrap="nowrap">
      <KubeCardsAppDrawer />
      <Grid container direction="column">
        <KubeCardsAppBar />
      </Grid>
    </Grid>
  );
}

export default App;
