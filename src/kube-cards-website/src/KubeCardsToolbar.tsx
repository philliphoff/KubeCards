import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { openAppDrawer } from './actions/AppDrawerActions';
import { Dispatch } from 'redux';

const styles = createStyles({
    root: {
        flexGrow: 1
    },
    grow: {
        flexGrow: 1
    },
    hide: {
        display: 'none'
    },
    menuButton: {
        marginRight: 20
    }
});

export interface Props extends WithStyles<typeof styles> {
    onOpen: () => void;
    open: boolean;
};

function KubeCardsToolbar(props: Props) {
    const { classes, onOpen, open } = props;

    return (
        <div className={classes.root}>
            <Toolbar disableGutters={!open}>
                <IconButton className={classNames(classes.menuButton, open && classes.hide)} color="inherit" onClick={() => onOpen()}>
                    <MenuIcon />
                </IconButton>
                <Typography className={classes.grow} color="inherit" variant="h6">
                    Kube Cards
                </Typography>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </div>
    );
};

KubeCardsToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
    onOpen: PropTypes.func
} as any;

function mapStateToProps(state: any) {
    return {
        open: state.appDrawer
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        onOpen: () => {
            dispatch(openAppDrawer(true));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(KubeCardsToolbar));
