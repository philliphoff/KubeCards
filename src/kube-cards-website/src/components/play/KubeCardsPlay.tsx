import React from 'react';
import { connect } from 'react-redux';
import { KubeCardsPlayState } from '../../reducers/PlayReducer';
import { IKubeCardsStore } from '../../KubeCardsStore';
import KubeCardsPlayGameCreation from './KubeCardsPlayGameCreation';
import KubeCardsPlayGame from './KubeCardsPlayGame';
import KubeCardsPlayLoading from './KubeCardsPlayLoading';

interface KubeCardsPlayProps {
    state: KubeCardsPlayState
}

class KubeCardsPlay extends React.Component<KubeCardsPlayProps> {
    constructor(props: KubeCardsPlayProps) {
        super(props);
    }

    render() {
        const { state } = this.props;

        switch (state) {
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

export default connect(mapStateToProps)(KubeCardsPlay);
