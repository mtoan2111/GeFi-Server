import { Request, Response } from 'express';

interface ICRUD {
    get: (req: Request, res: Response) => void;
    create: (req: Request, res: Response) => void;
    update: (req: Request, res: Response) => void;
    delete: (req: Request, res: Response) => void;
}

export default ICRUD;
