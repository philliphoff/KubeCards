import React from 'react';
import { Route, HashRouter as Router, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';

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
        <Router>
            <Switch>
                <Route exact path='/'>
                    <Paper className={classes.root}>
                        <Typography variant="h5">Let's play a game!</Typography>
                        <Typography>Login to start playing.</Typography>
                    </Paper>
                </Route>
                <Route path='/play'>
                    <Paper className={classes.root}>
                        <Typography variant="h5">Let's begin a game!</Typography>
                    </Paper>
                </Route>
            </Switch>
        </Router>
    );
};

KubeCardsContent.propTypes = {
    classes: PropTypes.object.isRequired,
} as any;

export default withStyles(styles)(KubeCardsContent);
