import React from 'react';
import { connect } from 'react-redux';
import { WithStyles, withStyles, Theme, StyleRulesCallback } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { userAuthMsalLogin } from './actions/UserAuthActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import { bindPopper, bindToggle, usePopupState } from 'material-ui-popup-state/hooks';
import { Popper, Typography, Paper, Fade, IconButton } from '@material-ui/core';

const styles: StyleRulesCallback = (theme: Theme) => ({
    wrapper: {
        margin: theme.spacing.unit,
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
    onLogin: () => void;
    state: 'loggedOut' | 'loggingIn' | 'loggedIn';
    userInitials: string | undefined;
};

const KubeCardsAuth: React.FunctionComponent<Props> = props => {
    const { state } = props;
    const popupState = usePopupState({ variant: 'popper', popupId: 'user-auth-popper'});

    if (state === 'loggedIn') {
        const { userInitials } = props;
        return (
            <div>
                <IconButton variant='contained' {...bindToggle(popupState)}>
                    <Avatar>{userInitials}</Avatar>
                </IconButton>
                <Popper {...bindPopper(popupState)} transition>
                    {({ TransitionProps }: {TransitionProps: any}) => (
                        <Fade {...TransitionProps} timout={350}>
                            <Paper>
                                <Typography>The content of the Popper.</Typography>
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
        state: state.userAuth.state,
        userInitials: generateInitials(state.userAuth.givenName)
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        onLogin: () => {
            dispatch(userAuthMsalLogin());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(KubeCardsAuth));
