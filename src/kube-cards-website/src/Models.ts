export interface ICard {
    cardId: string;
    cardValue: number;
}

export interface IDeck {    
    cards: ICard[];
    displayName?: string;
    id?: string;
}

export interface IPlayer {
    completed: boolean;
    deckDisplayName?: string;
    displayName: string;
    userId: string;
    handCards: ICard[] | null;
    playedCards: ICard[] | null;
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