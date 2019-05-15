import React from 'react';
import PropTypes from 'prop-types';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
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
        <Paper className={classes.root}>
            <Typography variant="h5">Let's play a game!</Typography>
            <Typography>Login to start playing.</Typography>
        </Paper>
    );
};

KubeCardsContent.propTypes = {
    classes: PropTypes.object.isRequired,
} as any;

export default withStyles(styles)(KubeCardsContent);
