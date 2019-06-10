import React from 'react';
import { connect } from 'react-redux';
import { KubeCardsPlayState } from '../../reducers/PlayReducer';
import { IKubeCardsStore } from '../../KubeCardsStore';
import KubeCardsPlayGameCreation from './KubeCardsPlayGameCreation';
import KubeCardsPlayGame from './KubeCardsPlayGame';

interface KubeCardsPlayProps {
    isPlaying: boolean
}

class KubeCardsPlay extends React.Component<KubeCardsPlayProps> {
    constructor(props: KubeCardsPlayProps) {
        super(props);
    }

    render() {
        const { isPlaying } = this.props;
        return (
            <div>
                { isPlaying ? <KubeCardsPlayGame /> : <KubeCardsPlayGameCreation /> }
            </div>
        );
    }
}

function mapStateToProps(state: IKubeCardsStore) {
    return {
        isPlaying: state.play.state === KubeCardsPlayState.Playing
    };
}

export default connect(mapStateToProps)(KubeCardsPlay);
