import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';

import KubeCardsPlay from './KubeCardsPlay';

const styles = (theme: any) => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    }
  });

export interface Props extends WithStyles<typeof styles> {
};

function KubeCardsContent(props: Props) {
    const { classes } = props;

    return (
        <Switch>
            <Route exact path='/'>
                <Paper className={classes.root}>
                    <Typography variant="h5">Let's play a game!</Typography>
                    <Typography>Login to start playing.</Typography>
                </Paper>
            </Route>
            <Route path='/play'>
                <KubeCardsPlay />
            </Route>
        </Switch>
    );
};

KubeCardsContent.propTypes = {
    classes: PropTypes.object.isRequired,
} as any;

export default withStyles(styles)(KubeCardsContent);
