export class APIError {
    Success: boolean;
    Type: string;
    Message: string;

    constructor(Type: string, Message: string) {
        this.Success = false;
        this.Type = Type;
        this.Message = Message;
    }
}
