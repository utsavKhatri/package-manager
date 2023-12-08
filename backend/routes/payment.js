import { Router } from 'express';
import { checkOutSession, createCheckout } from '../controllers/payment.js';

const paymentRouter = Router();

paymentRouter.get('/session', checkOutSession);
paymentRouter.post('/checkout', createCheckout);

export default paymentRouter;