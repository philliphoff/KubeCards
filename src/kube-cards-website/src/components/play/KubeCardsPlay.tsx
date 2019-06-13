import React from 'react';
import { connect } from 'react-redux';
import { KubeCardsPlayState } from '../../reducers/PlayReducer';
import { IKubeCardsStore } from '../../KubeCardsStore';
import KubeCardsPlayGameCreation from './KubeCardsPlayGameCreation';
import KubeCardsPlayGame from './KubeCardsPlayGame';
import KubeCardsPlayLoading from './KubeCardsPlayLoading';
import { playResumeGame } from '../../actions/PlayActions';

interface KubeCardsPlayProps {
    onResumeGame: () => void;
    state: KubeCardsPlayState;
}

class KubeCardsPlay extends React.Component<KubeCardsPlayProps> {
    constructor(props: KubeCardsPlayProps) {
        super(props);
    }

    componentDidMount() {
        const { onResumeGame, state } = this.props;

        if (state === KubeCardsPlayState.Resuming && onResumeGame) {
            onResumeGame();
        }
    }

    render() {
        const { state } = this.props;

        switch (state) {
            case KubeCardsPlayState.Resuming: return <KubeCardsPlayLoading label='Resuming the current game (if any)...' />;
            case KubeCardsPlayState.Playing: return <KubeCardsPlayGame />;
            case KubeCardsPlayState.Creating: return <KubeCardsPlayLoading label='Starting game...' />;
            default: return <KubeCardsPlayGameCreation />;
        }
    }
}

function mapStateToProps(state: IKubeCardsStore) {
    return {
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
