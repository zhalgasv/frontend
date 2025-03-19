export interface User {
  readonly id?: number;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}
