export interface UserInterface {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
    password: string;
    email?: string;
    roleId?: number;
}
