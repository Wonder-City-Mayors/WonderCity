export default interface PermissionInterface {
    id: number;
    type: string;
    operation?: string;
    target?: string;
}
