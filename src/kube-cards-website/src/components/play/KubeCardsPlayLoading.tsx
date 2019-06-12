import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

const KubeCardsPlayLoading = (props: { label: string }) => (
    <Container>
        <Grid alignItems='center' container direction='column' spacing={2}>
            <Grid item>
                <CircularProgress />
            </Grid>
            <Grid item>
                <Typography>{props.label}</Typography>
            </Grid>
        </Grid>
    </Container>
);

export default KubeCardsPlayLoading;
