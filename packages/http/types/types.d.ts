import 'express';

declare module 'express' {
    interface Request {
        user(): Record<any, any>;
        session(): Record<any, any>;
    }
}
