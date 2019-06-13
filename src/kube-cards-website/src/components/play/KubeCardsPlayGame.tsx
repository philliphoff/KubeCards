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
import { playSetCardId, playCard } from '../../actions/PlayActions';
import Button from '@material-ui/core/Button';

interface CardProps {
    cardId: string;
    cardValue: number;
    isPlayed: boolean;
}

interface PlayerProps {
    cards: CardProps[];
    isNext: boolean;
    label: string;
    score: number;
}

interface KubeCardPlayGameProps {
    chosenCardId: string | undefined;
    onChooseCard: (cardId: string) => void;
    onPlayCard: () => void;
    player1: PlayerProps;
    player2: PlayerProps;
}

class KubeCardsPlayGame extends React.Component<KubeCardPlayGameProps> {
    constructor(props: KubeCardPlayGameProps) {
        super(props);

        this.onCardClick = this.onCardClick.bind(this);
    }

    render() {
        return (
            <Grid container direction='column' spacing={2}>
                <Grid item>
                    { this.renderScore() }
                </Grid>
                <Grid item>
                    { this.renderHand() }
                </Grid>
            </Grid>
        );
    }

    private renderScore() {
        const { player1, player2 } = this.props;

        return (
            <Grid alignItems='center' container direction='row' spacing={2}>
                <Grid item>
                    <Card>
                        <CardContent>
                            <Grid alignItems='center' container direction='row'>
                                <Grid item>
                                    <Grid alignItems='flex-start' container direction='column'>
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
                    {
                        player1.isNext
                            ? <ArrowBackIcon color='primary' fontSize='large' />
                            : <ArrowFowardIcon color='primary' fontSize='large' />
                    }
                </Grid>
                <Grid item>
                    <Card>
                        <CardContent>
                            <Grid alignItems='center' container>
                                <Grid item>
                                    <Typography variant='h3'>{player2.score}</Typography>
                                </Grid>
                                <Grid item>
                                    <Grid alignItems='flex-end' container direction='column'>
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

    private renderHand() {
        const { chosenCardId, onPlayCard, player1 } = this.props;
        const { cards } = player1;

        return (
            <Grid alignItems='center' container direction='column' spacing={2}>
                <Grid item>
                    <Grid container spacing={2}>
                        {
                            cards.map(card => (
                                <Grid item key={card.cardId}>
                                    <Card>
                                        <CardContent>
                                            <Typography>{card.cardValue}</Typography>
                                        </CardContent>
                                        <CardActions>
                                            <IconButton disabled={card.isPlayed} id={card.cardId} onClick={this.onCardClick}>
                                                {card.cardId === chosenCardId ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
                                            </IconButton>
                                        </CardActions>
                                    </Card>
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

function createPlayer(player: IPlayer, nextPlayerUserId: string): PlayerProps {
    const unplayedCards = (player.handCards || []).map(card => ({ cardId: card.cardId, cardValue: card.cardValue, isPlayed: false }));
    const playedCards = (player.playedCards || []).map(card => ({ cardId: card.cardId, cardValue: card.cardValue, isPlayed: true }));
    const cards = unplayedCards.concat(playedCards);
    
    cards.sort((card1, card2) => card1.cardValue - card2.cardValue);

    return {
        cards,
        isNext: player.userId === nextPlayerUserId,
        label: player.displayName,
        score: (player.playedCards || []).reduce((total, card) => total + card.cardValue, 0)
    };
}

function mapStateToProps(state: IKubeCardsStore) {
    const gameId = state.play.gameId;

    if (!gameId) {
        throw new Error('Cannot play a game without a valid game ID.');
    }

    const game = state.games.existing[gameId];

    return {
        chosenCardId: state.play.cardId,
        player1: createPlayer(game.player1, game.nextPlayerUserId),
        player2: createPlayer(game.player2, game.nextPlayerUserId)
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        onChooseCard: (cardId: string) => {
            dispatch(playSetCardId(cardId));
        },
        onPlayCard: () => {
            dispatch(playCard());
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(KubeCardsPlayGame);
