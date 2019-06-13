import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import Typography from '@material-ui/core/Typography';
import { IKubeCardsStore } from '../../KubeCardsStore';
import { connect } from 'react-redux';
import { IPlayer } from '../../Models';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowFowardIcon from '@material-ui/icons/ArrowForward';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import { playSetCardId, playCard, playCompleteGame } from '../../actions/PlayActions';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { StyleRulesCallback } from '@material-ui/core/styles';
import { WithStyles, withStyles } from '@material-ui/styles';
import { KubeCardsPlayState } from '../../reducers/PlayReducer';
import DoneIcon from '@material-ui/icons/Done';

const styles: StyleRulesCallback = (theme: any) => ({
    button: {
        marginLeft: 'auto'
    }
});

interface CardProps extends WithStyles<typeof styles>{
    cardId: string;
    cardValue: number;
    isChosen: boolean;
    isPlayed: boolean;
    onChooseCard: (cardId: string) => void;
}

interface PlayerProps {
    cards: Omit<CardProps, 'classes' | 'onChooseCard'>[];
    isNext: boolean;
    label: string;
    score: number;
}

interface KubeCardPlayGameProps {
    chosenCardId: string | undefined;
    isEnded: boolean,
    onCompleteGame: () => void;
    onChooseCard: (cardId: string) => void;
    onPlayCard: () => void;
    player1: PlayerProps;
    player2: PlayerProps;
}

class KubeCardsCard extends React.Component<CardProps> {
    constructor(props: CardProps) {
        super(props);

        this.onCardClick = this.onCardClick.bind(this);
    }

    render() {
        const { cardId, cardValue, classes, isChosen, isPlayed } = this.props;

        return (
            <Card>
                <CardContent>
                    <Container>
                        <Typography color={isPlayed ? 'secondary' : 'primary'} variant='h4'>{cardValue}</Typography>
                    </Container>
                </CardContent>
                <CardActions>
                    <IconButton className={classes.button} disabled={isPlayed} id={cardId} onClick={this.onCardClick}>
                        {isChosen ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
                    </IconButton>
                </CardActions>
            </Card>
            );
    }

    private onCardClick(event: React.MouseEvent) {
        const { onChooseCard } = this.props;

        if (onChooseCard) {
            onChooseCard(event.currentTarget.id);
        }
    }
}

const KubeCardsCardWithStyles = withStyles(styles)(KubeCardsCard);

const KubeCardsTurnIndicator = (props: { isEnded: boolean, isPlayer1Next: boolean}) => (
    <Container>
        {
            !props.isEnded
                ? props.isPlayer1Next
                    ? <ArrowBackIcon color='primary' fontSize='large' />
                    : <ArrowFowardIcon color='primary' fontSize='large' />
                : <DoneIcon />
        }
    </Container>
);

class KubeCardsPlayGame extends React.Component<KubeCardPlayGameProps> {
    constructor(props: KubeCardPlayGameProps) {
        super(props);

        this.onCardClick = this.onCardClick.bind(this);
    }

    render() {
        const { isEnded } = this.props;

        return (
            <Grid alignItems='center' container direction='column' spacing={2}>
                <Grid item>
                    { this.renderScore() }
                </Grid>
                <Grid item>
                    { isEnded ? this.renderEnded() : this.renderHand() }
                </Grid>
            </Grid>
        );
    }

    private renderScore() {
        const { isEnded, player1, player2 } = this.props;

        return (
            <Grid alignItems='center' container direction='row' spacing={2}>
                <Grid item>
                    <Card>
                        <CardContent>
                            <Grid alignItems='center' container direction='row' spacing={8}>
                                <Grid item>
                                    <Grid alignItems='flex-start' container direction='column' spacing={1}>
                                        <Grid item>
                                            <Avatar>
                                                <PermIdentityIcon />
                                            </Avatar>
                                        </Grid>
                                        <Grid item>
                                            <Typography>{player1.label}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Typography variant='h3'>{player1.score}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                    <KubeCardsTurnIndicator isEnded={isEnded} isPlayer1Next={player1.isNext} />
                </Grid>
                <Grid item>
                    <Card>
                        <CardContent>
                            <Grid alignItems='center' container spacing={8}>
                                <Grid item>
                                    <Typography variant='h3'>{player2.score}</Typography>
                                </Grid>
                                <Grid item>
                                    <Grid alignItems='flex-end' container direction='column' spacing={1}>
                                        <Grid item>
                                            <Avatar>
                                                <PermIdentityIcon />
                                            </Avatar>
                                        </Grid>
                                        <Grid item>
                                            <Typography>{player2.label}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        );
    }

    private renderEnded() {
        const { onCompleteGame } = this.props;

        return (
            <Container>
                <Grid alignItems='center' container direction='column' spacing={2}>
                    <Grid item>
                        <Typography variant='h4'>This game is done!</Typography>
                    </Grid>
                    <Grid item>
                        <Button color='primary' onClick={onCompleteGame} variant='contained'>Complete Game</Button>
                    </Grid>
                </Grid>
            </Container>
        );
    }

    private renderHand() {
        const { chosenCardId, onChooseCard, onPlayCard, player1 } = this.props;
        const { cards } = player1;

        return (
            <Grid alignItems='center' container direction='column' spacing={2}>
                <Grid item>
                    <Grid container spacing={2}>
                        {
                            cards.map(card => (
                                <Grid item key={card.cardId}>
                                    <KubeCardsCardWithStyles {...card} onChooseCard={onChooseCard} />
                                </Grid>
                            ))
                        }
                    </Grid>
                </Grid>
                <Grid item>
                    <Button color='primary' disabled={!chosenCardId} onClick={onPlayCard} variant='contained'>Play Card</Button>
                </Grid>
            </Grid>
        );
    }

    private onCardClick(event: React.MouseEvent) {
        const { onChooseCard } = this.props;

        if (onChooseCard) {
            onChooseCard(event.currentTarget.id);
        }
    }
};

function createPlayer(player: IPlayer, nextPlayerUserId: string, chosenCardId: string | undefined): PlayerProps {
    const unplayedCards = (player.handCards || []).map(card => ({ cardId: card.cardId, cardValue: card.cardValue, isChosen: card.cardId === chosenCardId, isPlayed: false }));
    const playedCards = (player.playedCards || []).map(card => ({ cardId: card.cardId, cardValue: card.cardValue, isChosen: card.cardId === chosenCardId, isPlayed: true }));
    const cards = unplayedCards.concat(playedCards);
    
    cards.sort((card1, card2) => {
        if (card1.cardValue < card2.cardValue) {
            return -1;
        }

        if (card1.cardValue > card2.cardValue) {
            return 1;
        }

        if (card1.cardId < card2.cardId) {
            return -1;
        }

        if (card1.cardId > card2.cardId) {
            return 1;
        }

        return 0;
    });

    return {
        cards,
        isNext: player.userId === nextPlayerUserId,
        label: player.displayName,
        score: (player.playedCards || []).reduce((total, card) => total + card.cardValue, 0)
    };
}

function mapStateToProps(state: IKubeCardsStore) {
    const { cardId, gameId } = state.play;

    if (!gameId) {
        throw new Error('Cannot play a game without a valid game ID.');
    }

    const game = state.games.existing[gameId];

    return {
        chosenCardId: state.play.cardId,
        isEnded: state.play.state === KubeCardsPlayState.Ended,
        player1: createPlayer(game.player1, game.nextPlayerUserId, cardId),
        player2: createPlayer(game.player2, game.nextPlayerUserId, cardId)
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        onChooseCard: (cardId: string) => {
            dispatch(playSetCardId(cardId));
        },
        onCompleteGame: () => {
            dispatch(playCompleteGame());
        },
        onPlayCard: () => {
            dispatch(playCard());
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(KubeCardsPlayGame);
