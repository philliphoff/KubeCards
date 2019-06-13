import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import Typography from '@material-ui/core/Typography';
import { IKubeCardsStore } from '../../KubeCardsStore';
import { connect } from 'react-redux';
import Divider from '@material-ui/core/Divider';
import { IPlayStore } from '../../reducers/PlayReducer';
import { IPlayer } from '../../Models';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowFowardIcon from '@material-ui/icons/ArrowForward';

interface Player {
    isNext: boolean;
    label: string;
    score: number;
}

interface KubeCardPlayGameProps {
    player1: Player;
    player2: Player;
}

const KubeCardsPlayGame = (props: KubeCardPlayGameProps) => {
    const { player1, player2 } = props;

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
                                <Typography variant='h3'>{player1.score}</Typography>
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
};

function createPlayer(player: IPlayer, nextPlayerUserId: string): Player {
    return {
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
        player1: createPlayer(game.player1, game.nextPlayerUserId),
        player2: createPlayer(game.player2, game.nextPlayerUserId)
    };
}

export default connect(mapStateToProps)(KubeCardsPlayGame);
