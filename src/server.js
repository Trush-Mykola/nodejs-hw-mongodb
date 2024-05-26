import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import { getAllContacts, getContactById } from './services/contacts.js';
import mongoose from 'mongoose';
import { notFoundMiddleware } from './middlewares/notFoundMiddlware.js';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddlware.js';

export const setupServer = () => {
  const app = express();

  const PORT = Number(env('PORT', '3000'));

  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const contactId = req.params.contactId;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({
        message: 'Invalid id format',
      });
    }
    try {
      const contact = await getContactById(contactId);
      if (!contact) {
        return res.status(400).json({
          message: "Sorry, contact with this id doesn't exist",
        });
      }
      res.json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error with fetching contact data',
      });
    }
  });

  app.use(notFoundMiddleware);

  app.use(errorHandlerMiddleware);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
