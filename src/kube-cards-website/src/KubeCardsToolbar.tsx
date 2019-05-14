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
    loggedIn: boolean;
    onLogin: () => void;
    onOpen: () => void;
    open: boolean;
};

class KubeCardsToolbar extends React.PureComponent<Props> {
    constructor(props: Props) {
        super(props);

        this.onMenuButtonClick = this.onMenuButtonClick.bind(this);
        this.onLoginButtonClick = this.onLoginButtonClick.bind(this);
    }

    render() {
        const { classes, loggedIn, onOpen, open } = this.props;

        return (
            <div className={classes.grow}>
                <Toolbar disableGutters={!open}>
                    <IconButton className={classNames(classes.menuButton, open && classes.hide)} color="inherit" onClick={this.onMenuButtonClick}>
                        <MenuIcon />
                    </IconButton>
                    <Typography className={classes.grow} color="inherit" variant="h6">
                        Kube Cards
                    </Typography>
                    <Button className={classNames(loggedIn && classes.hide)} color="inherit" onClick={this.onLoginButtonClick}>Login</Button>
                </Toolbar>
            </div>
        );
    }

    private onMenuButtonClick() {
        const { onOpen } = this.props;

        onOpen();
    }

    private onLoginButtonClick() {
        const { onLogin } = this.props;

        onLogin();
    }
}

function mapStateToProps(state: any) {
    return {
        loggedIn: state.userAuth,
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
