import React from 'react';
import { IKubeCardsStore } from '../../KubeCardsStore';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { KubeCardsPlayOpponentType } from '../../reducers/PlayReducer';

interface IKubeCardsPlayConfirmationProps {
    deckLabel: string;
    opponentLabel: string;
}

const KubeCardsPlayConfirmation = (props: IKubeCardsPlayConfirmationProps) => {
    const { deckLabel, opponentLabel } = props;

    return (
        <div>
            <TextField label='Opponent' value={opponentLabel} InputProps={{ readOnly: true }} />
            <TextField label='Deck' value={deckLabel} InputProps={{ readOnly: true }} />
        </div>
    );
};

function getLabelForOpponent(opponentType: KubeCardsPlayOpponentType | undefined, opponentId: string | undefined) {
    switch (opponentType) {
        case KubeCardsPlayOpponentType.Computer: return 'Computer';
        case KubeCardsPlayOpponentType.Player: return opponentId || 'Unknown';
    }

    return 'Unknown';
}

function mapStateToProps(state: IKubeCardsStore) {
    return {
        deckLabel: state.play.deckId || 'Unknown',
        opponentLabel: getLabelForOpponent(state.play.opponentType, state.play.opponentId)
    };
}

export default connect(mapStateToProps)(KubeCardsPlayConfirmation);
