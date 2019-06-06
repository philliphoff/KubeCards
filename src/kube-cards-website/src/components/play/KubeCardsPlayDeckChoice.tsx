import React from 'react';
import { connect } from 'react-redux';
import { deckRefresh } from '../../actions/DeckActions';
import { IKubeCardsStore } from '../../KubeCardsStore';
import { IDeck } from '../../reducers/DeckReducer';
import GridList from '@material-ui/core/GridList';
import Typography from '@material-ui/core/Typography';
import GridListTile from '@material-ui/core/GridListTile';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles, WithStyles, StyleRulesCallback } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import { playChooseDeck } from '../../actions/PlayActions';
import CardActions from '@material-ui/core/CardActions';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import IconButton from '@material-ui/core/IconButton';

const styles: StyleRulesCallback = (theme: any) => ({
    card: {
        height: 100,
        width: 250
    },
    chosenCard: {
        border: 2,
        borderColor: 'red',
        height: 100,
        width: 250
    },
    gridList: {
        flexWrap: 'nowrap'
    }
});

interface KubeCardsPlayDeckChoiceProps extends WithStyles<typeof styles> {
    chosenDeckId: string | undefined;
    decks: IDeck[];
    isRefreshing: boolean;
    onChooseDeck?: (deckId: string) => void;
    onInitialize?: () => void;
}

class KubeCardsPlayDeckChoice extends React.Component<KubeCardsPlayDeckChoiceProps> {
    constructor(props: KubeCardsPlayDeckChoiceProps) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
        const { onInitialize } = this.props;

        if (onInitialize) {
            onInitialize();
        }
    }

    render() {
        const { chosenDeckId, classes, decks } = this.props;

        return (
            <Grid container direction='row' justify='center' spacing={2}>
                {
                    decks.map(deck => (
                        <Grid item key={deck.id}>
                            <Card className={deck.id === chosenDeckId ? classes.chosenCard : classes.card}>
                                <CardContent>
                                    <Typography>{deck.id}</Typography>
                                </CardContent>
                                <CardActions>
                                    <IconButton id={deck.id} onClick={this.onClick}>
                                        {deck.id === chosenDeckId ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                }
            </Grid>
        );
    }

    private onClick(event: React.MouseEvent) {
        const { onChooseDeck } = this.props;

        if (onChooseDeck) {
            onChooseDeck(event.currentTarget.id);
        }
    }
}

function mapStateToProps(state: IKubeCardsStore) {
    return {
        chosenDeckId: state.play.deckId,
        decks: state.deck.decks,
        isRefreshing: state.deck.isRefreshing
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        onChooseDeck: (deckId: string) => {
            dispatch(playChooseDeck(deckId))
        },
        onInitialize: () => {
            dispatch(deckRefresh());
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(KubeCardsPlayDeckChoice));
