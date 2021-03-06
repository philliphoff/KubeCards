import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { playMoveNext, playCreateGame } from '../../actions/PlayActions';
import { IPlayStore, KubeCardsPlayOpponentType, KubeCardsPlayState } from '../../reducers/PlayReducer';
import KubeCardsPlayOpponentChoice from './KubeCardsPlayOpponentChoice';
import { IKubeCardsStore } from '../../KubeCardsStore';
import KubeCardsPlayDeckChoice from './KubeCardsPlayDeckChoice';
import KubeCardsPlayConfirmation from './KubeCardsPlayConfirmation';
import Box from '@material-ui/core/Box';
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles';

const styles: StyleRulesCallback = (theme: any) => ({
    stepBox: {
        margin: theme.spacing(2)
    }
});

interface PlayStep {
    finalState?: KubeCardsPlayState;
    key: string;
    label: string;
    render: () => any;
    state: KubeCardsPlayState;
}

const steps: PlayStep[] = [
    {
        key: 'chooseOpponent',
        label: 'Choose an opponent',
        state: KubeCardsPlayState.ChooseOpponent,
        render: () => <KubeCardsPlayOpponentChoice />
    },
    {
        key: 'chooseDeck',
        label: 'Choose a deck',
        state: KubeCardsPlayState.ChooseDeck,
        render: () => <KubeCardsPlayDeckChoice />
    },
    {
        key: 'confirmPlay',
        label: 'Confirm play',
        state: KubeCardsPlayState.ConfirmPlay,
        render: () => <KubeCardsPlayConfirmation />,
        finalState: KubeCardsPlayState.Creating
    }
];

interface KubeCardsPlayGameCreationProps extends WithStyles<typeof styles> {
    canMoveNext: boolean;
    currentStep: number;
    onMoveToState: (currentState: KubeCardsPlayState) => void;
    steps: PlayStep[];
}

class KubeCardsPlayGameCreation extends React.Component<KubeCardsPlayGameCreationProps> {
    constructor(props: KubeCardsPlayGameCreationProps) {
        super(props);

        this.onMoveBackClick = this.onMoveBackClick.bind(this);
        this.onMoveNextClick = this.onMoveNextClick.bind(this);
    }

    render() {
        const { canMoveNext, classes, currentStep, steps } = this.props;
        return (
            <div>
                <Stepper activeStep={currentStep}>
                    {
                        steps.map(step => (
                            <Step key={step.key}>
                                <StepLabel>{step.label}</StepLabel>
                            </Step>
                        ))
                    }
                </Stepper>
                <Box className={classes.stepBox}>
                    { steps[currentStep].render() }
                </Box>
                <div>
                    <Button disabled={currentStep === 0} onClick={this.onMoveBackClick}>Back</Button>
                    <Button disabled={!canMoveNext} color='primary' onClick={this.onMoveNextClick} variant='contained'>{currentStep === steps.length - 1 ? 'Play' : 'Next' }</Button>
                </div>
            </div>
        );
    }

    private onMoveBackClick() {
        const { currentStep, onMoveToState, steps } = this.props;

        if (currentStep > 0 && onMoveToState) {
            onMoveToState(steps[currentStep - 1].state);
        }
    }

    private onMoveNextClick() {
        const { currentStep, onMoveToState, steps } = this.props;

        if (onMoveToState) {
            if (currentStep < steps.length - 1) {
                onMoveToState(steps[currentStep + 1].state);
            }
            else {
                const finalState = steps[currentStep].finalState;

                if (finalState !== undefined) {
                    onMoveToState(finalState);
                }
            }
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

function getCurrentStep(state: KubeCardsPlayState): number {
    switch (state) {
        case KubeCardsPlayState.ChooseDeck: return 1;
        case KubeCardsPlayState.ConfirmPlay: return 2;
        default: return 0;
    }
}

function mapStateToProps(state: IKubeCardsStore) {
    return {
        canMoveNext: canMoveNext(state.play),
        currentStep: getCurrentStep(state.play.state),
        steps,
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        onMoveToState: (nextState: KubeCardsPlayState) => {
            dispatch(playMoveNext(nextState));

            if (nextState === KubeCardsPlayState.Creating) {
                dispatch(playCreateGame());
            }
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(KubeCardsPlayGameCreation));
