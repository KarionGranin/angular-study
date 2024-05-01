export type WordleLetterType = 'has' | 'hasnt' | 'hasbut' | 'unknown';

export interface WordleLetter {
  letter: string;
  type: WordleLetterType;
}

export type WordleWord = WordleLetter[];

export interface WordCollection {
  [key: number]: string[];
}

export type WordleGameOverType = 'win' | 'lose' | 'unknown';

export interface WordleGameOverModalData {
  gameoverType: WordleGameOverType;
  secretWord: string;
}
