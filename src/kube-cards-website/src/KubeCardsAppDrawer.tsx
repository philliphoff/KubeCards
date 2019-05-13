import React from 'react';
import PropTypes from 'prop-types';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { openAppDrawer } from './actions/AppDrawerActions';
import { Dispatch } from 'redux';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

const styles = createStyles({
    drawer: {
        flexShrink: 0
    },
    drawerPaper: {
    }    
});

export interface Props extends WithStyles<typeof styles> {
    onClose: () => void;
    open: boolean;
};

function KubeCardsAppDrawer(props: Props) {
    const { classes, open } = props;

    return (
        <Drawer anchor="left" classes={{ paper: classes.drawerPaper }} className={classes.drawer} open={open} variant="persistent">
            <IconButton>
                <ChevronLeftIcon />
            </IconButton>
            <Divider />
            <List>
            </List>
        </Drawer>
    );
};

KubeCardsAppDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func
} as any;

function mapStateToProps(state: any) {
    return {
        open: state.appDrawer
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        onClose: () => {
            dispatch(openAppDrawer(false));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(KubeCardsAppDrawer));
