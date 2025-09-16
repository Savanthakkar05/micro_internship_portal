import exress, { Router } from 'express';
import { authValidation, authController } from '../auth';
import { validate } from '../validate/validate';
const router: Router = exress.Router();

router
    .route('/register')
    .post(validate(authValidation.regsterBody), authController.signup);

router
    .route('/login')
    .post(validate(authValidation.loginBody), authController.login);

router
    .route('/refreshtoken')
    .post(validate(authValidation.refreshTokenBody), authController.refreshAccessToken);

export default router;