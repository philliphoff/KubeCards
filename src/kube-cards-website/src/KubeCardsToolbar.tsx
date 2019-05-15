import React from 'react';
import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { openAppDrawer } from './actions/AppDrawerActions';
import { ThunkDispatch } from 'redux-thunk';
import { userAuthMsalLogin } from './actions/UserAuthActions';
import { IKubeCardsStore } from './KubeCardsStore';
import { Action } from 'redux';

const styles = createStyles({
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
    allowLogin: boolean;
    onLogin: () => void;
    onOpen: () => void;
    open: boolean;
};

class KubeCardsToolbar extends React.PureComponent<Props> {
    render() {
        const { allowLogin, classes, onLogin, onOpen, open } = this.props;

        return (
            <div className={classes.grow}>
                <Toolbar disableGutters={!open}>
                    <IconButton className={classNames(classes.menuButton, open && classes.hide)} color="inherit" onClick={onOpen}>
                        <MenuIcon />
                    </IconButton>
                    <Typography className={classes.grow} color="inherit" variant="h6">
                        Kube Cards
                    </Typography>
                    <Button className={classNames(!allowLogin && classes.hide)} color="inherit" onClick={onLogin}>Login</Button>
                </Toolbar>
            </div>
        );
    }
}

function mapStateToProps(state: any) {
    return {
        allowLogin: state.userAuth.state === 'loggedOut',
        open: state.appDrawer
    };
}

function mapDispatchToProps(dispatch: ThunkDispatch<IKubeCardsStore, void, Action>) {
    return {
        onLogin: () => {
            dispatch(userAuthMsalLogin());
        },
        onOpen: () => {
            dispatch(openAppDrawer(true));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(KubeCardsToolbar));
