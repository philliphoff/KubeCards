import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { playMoveNext } from './actions/PlayActions';
import { IPlayStore, KubeCardsPlayOpponentType, KubeCardsPlayState } from './reducers/PlayReducer';
import KubeCardsPlayOpponentChoice from './components/play/KubeCardsPlayOpponentChoice';
import { IKubeCardsStore } from './KubeCardsStore';

interface KubeCardsPlayProps {
    canMoveNext: boolean;
    onMoveBack: (currentState: KubeCardsPlayState) => void;
    onMoveNext: (currentState: KubeCardsPlayState) => void;
    state: KubeCardsPlayState;
}

class KubeCardsPlay extends React.Component<KubeCardsPlayProps> {
    constructor(props: KubeCardsPlayProps) {
        super(props);

        this.onMoveBackClick = this.onMoveBackClick.bind(this);
        this.onMoveNextClick = this.onMoveNextClick.bind(this);
    }

    render() {
        const { canMoveNext, state } = this.props;
        const step = KubeCardsPlay.getStep(state);
        return (
            <div>
                <Stepper activeStep={step}>
                    <Step>
                        <StepLabel>Choose an opponent</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Choose a deck</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Confirm play</StepLabel>
                    </Step>
                </Stepper>
                <div>
                    { this.renderStep() }
                </div>
                <div>
                    <Button disabled={state === KubeCardsPlayState.ChooseOpponent} onClick={this.onMoveBackClick}>Back</Button>
                    <Button disabled={!canMoveNext} color='primary' onClick={this.onMoveNextClick} variant='contained'>{state === KubeCardsPlayState.ConfirmPlay ? 'Play' : 'Next' }</Button>
                </div>
            </div>
        );
    }

    private renderStep() {
        const { state } = this.props;

        switch (state) {
            case KubeCardsPlayState.ChooseOpponent: return <KubeCardsPlayOpponentChoice />;
        }

        return null;
    }

    private onMoveBackClick() {
        const { onMoveBack, state } = this.props;

        if (onMoveBack) {
            onMoveBack(state);
        }
    }

    private onMoveNextClick() {
        const { onMoveNext, state } = this.props;

        if (onMoveNext) {
            onMoveNext(state);
        }
    }

    private static getStep(state: KubeCardsPlayState): number {
        switch (state) {
            case KubeCardsPlayState.ChooseDeck: return 1;
            case KubeCardsPlayState.ConfirmPlay: return 2;
            default: return 0;
        }
    }
}

function canMoveNext(state: IPlayStore): boolean {
    switch (state.state) {
        case KubeCardsPlayState.ChooseOpponent:
            return state.opponentType === KubeCardsPlayOpponentType.Computer || state.opponentId !== undefined;

        case KubeCardsPlayState.ChooseDeck:
            return state.deckId !== undefined;

        case KubeCardsPlayState.ConfirmPlay:
            return true;

        default:
            return false;
    }
}

function getPreviousState(currentState: KubeCardsPlayState): KubeCardsPlayState {
    switch (currentState) {
        case KubeCardsPlayState.ChooseDeck: return KubeCardsPlayState.ChooseOpponent;
        case KubeCardsPlayState.ConfirmPlay: return KubeCardsPlayState.ChooseDeck;
        default: throw new Error('Cannot go back to the previous state in state: ' + currentState.toString());
    }
}

function getNextState(currentState: KubeCardsPlayState): KubeCardsPlayState {
    switch (currentState) {
        case KubeCardsPlayState.ChooseOpponent: return KubeCardsPlayState.ChooseDeck;
        case KubeCardsPlayState.ChooseDeck: return KubeCardsPlayState.ConfirmPlay;
        case KubeCardsPlayState.ConfirmPlay: return KubeCardsPlayState.Playing;
        default: throw new Error('Cannot go to the next state in state: ' + currentState.toString());
    }
}

function mapStateToProps(state: IKubeCardsStore) {
    return {
        canMoveNext: canMoveNext(state.play),
        state: state.play.state
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        onMoveBack: (currentState: KubeCardsPlayState) => {
            dispatch(playMoveNext(getPreviousState(currentState)));
        },
        onMoveNext: (currentState: KubeCardsPlayState) => {
            dispatch(playMoveNext(getNextState(currentState)));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(KubeCardsPlay);
