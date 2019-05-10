import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';

const styles = createStyles({
    root: {
        flexGrow: 1
    },
    grow: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: 20
    }
});

export interface Props extends WithStyles<typeof styles> {};

function KubeCardsAppBar(props: Props) {
    const { classes } = props;

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton className={classes.menuButton} color="inherit">
                        <MenuIcon />
                    </IconButton>
                    <Typography className={classes.grow} color="inherit" variant="h6">
                        Kube Cards
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
        </div>
    );
};

KubeCardsAppBar.propTypes = {
    classes: PropTypes.object.isRequired
} as any;

export default withStyles(styles)(KubeCardsAppBar);
