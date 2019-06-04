import React from 'react'
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import { KubeCardsPlayOpponentType } from '../../reducers/PlayReducer';
import TextField from '@material-ui/core/TextField';
import { IKubeCardsStore } from '../../KubeCardsStore';
import { connect } from 'react-redux';
import { playChooseOpponent } from '../../actions/PlayActions';

interface KubeCardsPlayOpponentChoiceProps {
    onChooseComputer: () => void;
    onChoosePlayer: () => void;
    opponentId: string | undefined;
    opponentType: KubeCardsPlayOpponentType | undefined;
}

class KubeCardsPlayOpponentChoice extends React.Component<KubeCardsPlayOpponentChoiceProps> {
    constructor(props: KubeCardsPlayOpponentChoiceProps) {
        super(props);

        this.onChooseComputerChanged = this.onChooseComputerChanged.bind(this);
        this.onChoosePlayerChanged = this.onChoosePlayerChanged.bind(this);
    }

    render() {
        const { opponentId, opponentType } = this.props;

        return (
            <div>
                <FormControl>
                    <FormLabel>Opponent</FormLabel>
                    <RadioGroup value={opponentType !== undefined ? opponentType.toString() : ''}>
                        <FormControlLabel control={<Radio />} label="Computer" onChange={this.onChooseComputerChanged} value={KubeCardsPlayOpponentType.Computer.toString()} />
                        <FormControlLabel control={<Radio />} label="Player" onChange={this.onChoosePlayerChanged} value={KubeCardsPlayOpponentType.Player.toString()} />
                    </RadioGroup>
                    <TextField disabled={opponentType !== KubeCardsPlayOpponentType.Player} label='Player Name' value={opponentId} />
                </FormControl>
            </div>
        );
    }

    private onChooseComputerChanged(event: object, checked: boolean) {
        if (checked) {
            const { onChooseComputer } = this.props;
            
            if (onChooseComputer) {
                onChooseComputer();
            }
        }
    }

    private onChoosePlayerChanged(event: object, checked: boolean) {
        if (checked) {
            const { onChoosePlayer } = this.props;
            
            if (onChoosePlayer) {
                onChoosePlayer();
            }
        }
    }
}

function mapStateToProps(state: IKubeCardsStore) {
    return {
        opponentId: state.play.opponentId,
        opponentType: state.play.opponentType
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        onChooseComputer: () => {
            dispatch(playChooseOpponent(KubeCardsPlayOpponentType.Computer));
        },
        onChoosePlayer: () => {
            dispatch(playChooseOpponent(KubeCardsPlayOpponentType.Player))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(KubeCardsPlayOpponentChoice);
