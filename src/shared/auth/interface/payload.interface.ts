export interface Payload {
  sub: string;
  context: {
    username: string;
    extra: number;
    type: string;
  };
}
