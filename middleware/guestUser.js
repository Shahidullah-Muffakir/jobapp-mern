import { BadRequestError } from '../errors/index.js';

const guestUser = (req, res, next) => {
  if (req.user.guestUser) {
    throw new BadRequestError('Test User. Read Only!');
  }
  next();
};

export default guestUser;