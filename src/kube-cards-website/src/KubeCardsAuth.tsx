import React from 'react';
import { connect } from 'react-redux';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { userAuthMsalLogin } from './actions/UserAuthActions';

const styles = createStyles({
});

interface Props extends WithStyles<typeof styles> {
    onLogin: () => void;
    state: 'loggedOut' | 'loggingIn' | 'loggedIn';
    userInitials: string | undefined;
};

const KubeCardsAuth: React.FunctionComponent<Props> = props => {
    const { state } = props;

    if (state === 'loggedIn') {
        const { userInitials } = props;

        return <Avatar>{userInitials}</Avatar>;
    }
    else {
        const { onLogin } = props;

        return (
            <div>
                <Button color="inherit" onClick={onLogin}>Login</Button>
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
