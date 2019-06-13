import gamesService from "../services/GamesService";
import { IGameState } from "../Models";

const gamesSetIsRefreshing = (isRefreshing: boolean) => ({
    type: 'KUBE_CARDS_GAMES_SET_IS_REFRESHING',
    isRefreshing
});

const gamesSetExisting = (existing: { [key: string]: IGameState }) => ({
    type: 'KUBE_CARDS_GAMES_SET_EXISTING',
    existing
});

export const gamesAddExisting = (existing: IGameState) => ({
    type: 'KUBE_CARDS_GAMES_ADD_EXISTING',
    existing
});

export const gamesGet = () => {
    return async (dispatch: any) => {
        dispatch(gamesSetIsRefreshing(true));
        
        try {
            const existingGames = await gamesService.getGames();

            const existingGamesMap = existingGames.reduce<{ [key: string]: IGameState }>(
                (games, game) => {
                    games[game.gameId] = game;

                    return games
                },
                {});

            dispatch(gamesSetExisting(existingGamesMap));
        }
        finally {
            dispatch(gamesSetIsRefreshing(false));
        }
    };
}