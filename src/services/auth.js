import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
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
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  console.log(`Generated token for ${email}: ${token}`);

  try {
    await sendMail({
      html: `
        <h1>Hello user</h1>
        <p>Here your reset <a href='${env(
          'APP_DOMAIN',
        )}/reset-password?token=${token}'>link</a>
        </p>
      `,
      to: email,
      from: env('SMTP_FROM'),
      subject: 'Reset your password!',
    });

    console.log(`Reset password email sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};
