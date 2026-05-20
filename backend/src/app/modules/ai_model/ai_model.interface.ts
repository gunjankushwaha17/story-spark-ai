export interface IAIModel {
  prompt: string;
  wordLength: number;
  numStories: number
}

export interface IStory {
  title: string;
  content: string;
  tag: string;
  imageURL?: string;
}
