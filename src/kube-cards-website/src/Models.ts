export interface ICard {
    cardId: string;
    cardValue: number;
}

export interface IDeck {    
    cards: ICard[];
    id?: string;
}

export interface IPlayer {
    displayName: string;
    userId: string;
    handCards: ICard[];
    playedCards: ICard[];
}

export interface IGameAction {
    description: string;
    actionDateTimeUtc: string;
}

export interface IGameState {
    gameId: string;
    player1: IPlayer;
    player2: IPlayer;
    history: IGameAction[];
    nextPlayerUserId: string;
    lastUpdatedDateTimeUtc: string;
}