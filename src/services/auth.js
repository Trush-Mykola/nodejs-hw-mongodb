import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import Handlebars from 'handlebars';
import jwt from 'jsonwebtoken';
import fs from 'node:fs/promises';
import path from 'node:path';
import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';
import { createSession } from '../utils/createSession.js';
import { env } from '../utils/env.js';
import { sendMail } from '../utils/sendMails.js';

export const createUser = async (payload) => {
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await User.findOne({ email: payload.email });

  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  return await User.create({ ...payload, password: hashedPassword });
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'Unauthorize, email or password are wrong!');
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password);

  if (!isCorrectPassword) {
    throw createHttpError(401, 'Unauthorize, email or password are wrong!');
  }

  await Session.deleteOne({ userId: user._id });

  return await Session.create({
    userId: user._id,
    ...createSession(),
  });
};

export const logoutUser = async ({ sessionId, sessionToken }) => {
  return await Session.deleteOne({
    _id: sessionId,
    refreshToken: sessionToken,
  });
};

export const refreshToken = async ({ sessionId, sessionToken }) => {
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken: sessionToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found!');
  }
  if (new Date() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Session is expired!');
  }

  await Session.deleteOne({ _id: sessionId });

  return await Session.create({
    userId: session._id,
    ...createSession(),
  });
};

export const sendResetPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const token = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  const templateSource = await fs.readFile(
    path.join(process.cwd(), 'src', 'templates', 'reset-password-email.html'),
    'utf-8',
  );

  const template = Handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${token}`,
  });

  try {
    await sendMail({
      html,
      to: email,
      from: env('SMTP_FROM'),
      subject: 'Reset your password!',
    });
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async ({ token, password }) => {
  let tokenPayload;

  try {
    tokenPayload = jwt.verify(token, env('JWT_SECRET'));
  } catch (error) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await User.findOne({
    email: tokenPayload.email,
    _id: tokenPayload.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.findByIdAndUpdate(
    { _id: tokenPayload.sub, email: tokenPayload.email },
    { password: hashedPassword },
  );
};
