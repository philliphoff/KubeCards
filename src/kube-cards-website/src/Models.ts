export interface ICard {
    cardId: string;
    cardValue: number;
}

export interface IDeck {    
    cards: ICard[];
    id?: string;
}
