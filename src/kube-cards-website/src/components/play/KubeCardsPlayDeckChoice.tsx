import React from 'react';
import { connect } from 'react-redux';
import { decksLoad } from '../../actions/DecksActions';
import { IKubeCardsStore } from '../../KubeCardsStore';
import { IDeck } from '../../Models';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles, WithStyles, StyleRulesCallback } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { playChooseDeck } from '../../actions/PlayActions';
import CardActions from '@material-ui/core/CardActions';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import IconButton from '@material-ui/core/IconButton';
import { DecksState } from '../../reducers/DecksReducer';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorIcon from '@material-ui/icons/Error';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';

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
    state: DecksState;
    onChooseDeck?: (deckId: string) => void;
    onLoad?: () => void;
}

class KubeCardsPlayDeckChoice extends React.Component<KubeCardsPlayDeckChoiceProps> {
    constructor(props: KubeCardsPlayDeckChoiceProps) {
        super(props);

        this.onClick = this.onClick.bind(this);
        this.onRetryClick = this.onRetryClick.bind(this);
    }

    componentDidMount() {
        const { onLoad } = this.props;

        if (onLoad) {
            onLoad();
        }
    }

    render() {
        const { state } = this.props;

        switch (state) {
            case DecksState.NotLoaded:
            case DecksState.Loading:

                return this.renderLoading();

            case DecksState.Loaded:

                return this.renderLoaded();

            case DecksState.Failed:

                return this.renderFailed();
        }

        return null;
    }

    private renderLoading() {
        return (
            <div>
                <CircularProgress />
                <Typography>Loading your decks...</Typography>
            </div>
        );
    }

    private renderLoaded() {
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

    private renderFailed() {
        return (
            <Container>
                <Grid alignItems='center' container>
                    <Grid item>
                        <ErrorIcon color='error' fontSize='large' />
                    </Grid>
                    <Grid item>
                        <Typography>Unable to load your decks.</Typography>
                    </Grid>
                    <Grid item>
                        <Button color='primary' onClick={this.onRetryClick}>Retry</Button>
                    </Grid>
                </Grid>
            </Container>
        );
    }

    private onClick(event: React.MouseEvent) {
        const { onChooseDeck } = this.props;

        if (onChooseDeck) {
            onChooseDeck(event.currentTarget.id);
        }
    }

    private onRetryClick() {
        const { onLoad } = this.props;

        if (onLoad) {
            onLoad();
        }
    }
}

function mapStateToProps(state: IKubeCardsStore) {
    return {
        chosenDeckId: state.play.deckId,
        decks: state.decks.decks,
        state: state.decks.state
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        onChooseDeck: (deckId: string) => {
            dispatch(playChooseDeck(deckId))
        },
        onLoad: () => {
            dispatch(decksLoad());
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(KubeCardsPlayDeckChoice));
