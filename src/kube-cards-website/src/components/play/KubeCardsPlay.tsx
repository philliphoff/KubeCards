import React from 'react';
import { connect } from 'react-redux';
import { KubeCardsPlayState } from '../../reducers/PlayReducer';
import { IKubeCardsStore } from '../../KubeCardsStore';
import KubeCardsPlayGameCreation from './KubeCardsPlayGameCreation';
import KubeCardsPlayGame from './KubeCardsPlayGame';
import KubeCardsPlayLoading from './KubeCardsPlayLoading';
import { playResumeGame } from '../../actions/PlayActions';

interface KubeCardsPlayProps {
    isLoggedIn: boolean;
    onResumeGame: () => void;
    state: KubeCardsPlayState;
}

class KubeCardsPlay extends React.Component<KubeCardsPlayProps> {
    constructor(props: KubeCardsPlayProps) {
        super(props);
    }

    componentDidMount() {
        this.resumeIfNecessary();
    }

    componentDidUpdate() {
        this.resumeIfNecessary();
    }

    render() {
        const { isLoggedIn, state } = this.props;

        if (!isLoggedIn) {
            return <KubeCardsPlayLoading label='Waiting for you to login...' />;
        }

        switch (state) {
            case KubeCardsPlayState.Resuming:
                return <KubeCardsPlayLoading label='Resuming the current game (if any)...' />;

            case KubeCardsPlayState.Creating:
                return <KubeCardsPlayLoading label='Starting game...' />;
                    
            case KubeCardsPlayState.Playing:
            case KubeCardsPlayState.Ended:
                return <KubeCardsPlayGame />;

            default:
                return <KubeCardsPlayGameCreation />;
        }
    }

    private resumeIfNecessary() {
        const { onResumeGame, state } = this.props;

        if (state === KubeCardsPlayState.Resuming && onResumeGame) {
            onResumeGame();
        }
    }
}

function mapStateToProps(state: IKubeCardsStore) {
    return {
        isLoggedIn: state.userAuth.state === 'loggedIn',
        state: state.play.state
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        onResumeGame: () => {
            dispatch(playResumeGame());
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(KubeCardsPlay);
