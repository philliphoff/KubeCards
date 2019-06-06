import React from 'react';
import { connect } from 'react-redux';
import { WithStyles, withStyles, Theme, StyleRulesCallback } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { userAuthMsalLogin, userAuthMsalLogout } from './actions/UserAuthActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import { bindPopper, bindToggle, usePopupState } from 'material-ui-popup-state/hooks';
import { Popper, Typography, Paper, Fade, IconButton, DialogActions, DialogContent, Grid } from '@material-ui/core';

const styles: StyleRulesCallback = (theme: Theme) => ({
    bigAvatar: {
        height: 80,
        marginRight: 8,
        width: 80
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative'
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12
    }
});

interface Props extends WithStyles<typeof styles> {
    email: string;
    givenName: string;
    onLogin: () => void;
    onLogout: () => void;
    state: 'loggedOut' | 'loggingIn' | 'loggedIn';
    userInitials: string | undefined;
};

const KubeCardsAuth: React.FunctionComponent<Props> = props => {
    const { state } = props;
    const popupState = usePopupState({ variant: 'popper', popupId: 'user-auth-popper'});

    if (state === 'loggedIn') {
        const { classes, email, givenName, onLogout, userInitials } = props;
        return (
            <div>
                <IconButton variant='contained' {...bindToggle(popupState)}>
                    <Avatar>{userInitials}</Avatar>
                </IconButton>
                <Popper {...bindPopper(popupState)} placement='bottom' transition modifiers={{ arrow: { enabled: true }}}>
                    {({ TransitionProps }: {TransitionProps: any}) => (
                        <Fade {...TransitionProps} timout={350}>
                            <Paper>
                                <DialogContent>
                                    <Grid alignItems='center' container direction='row'>
                                        <Avatar className={classes.bigAvatar}>{userInitials}</Avatar>
                                        <Grid container direction='column'>
                                            <Typography variant='h6'>{givenName}</Typography>
                                            <Typography variant='body1'>{email}</Typography>
                                        </Grid>
                                    </Grid>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={onLogout}>Sign Out</Button>
                                </DialogActions>
                            </Paper>
                        </Fade>
                    )}
                </Popper>
            </div>
        );
    }
    else {
        const { classes, onLogin } = props;

        return (
            <div className={classes.wrapper}>
                <Button color="inherit" onClick={onLogin}>Login</Button>
                { state === 'loggingIn' && <CircularProgress size={24} className={classes.buttonProgress} /> }
            </div>
        );
    }
};

function generateInitials(name: string | undefined): string | undefined {
    if (name) {
        return name.split(' ').map(namePart => namePart[0]).map(initial => initial.toLocaleUpperCase()).join('');
    }

    return undefined;
}

function mapStateToProps(state: any) {
    return {
        email: state.userAuth.emails && state.userAuth.emails[0],
        givenName: state.userAuth.givenName,
        state: state.userAuth.state,
        userInitials: generateInitials(state.userAuth.givenName)
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        onLogin: () => {
            dispatch(userAuthMsalLogin());
        },
        onLogout: () => {
            dispatch(userAuthMsalLogout());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(KubeCardsAuth));
