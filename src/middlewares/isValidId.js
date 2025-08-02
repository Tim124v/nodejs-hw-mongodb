import mongoose from 'mongoose';
import createError from 'http-errors';

export function isValidId(req, res, next) {
  const { contactId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createError(400, 'Invalid contact id');
  }
  next();
}