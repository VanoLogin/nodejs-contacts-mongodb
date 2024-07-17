import 'dotenv/config';
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { getAllContacts, getContactById } from './services/contacts.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { Contact } from './db/modals/contacts.js';

const PORT = 3040;

const app = express();

app.use(express.json());
app.use(cors());

app.use(
  pino({
    transport: {
      target: 'pino-pretty',
    },
  }),
);

function setupServer() {
  app.listen(PORT, async () => {
    await initMongoConnection();
    console.log(`Server is running on port ${PORT}`);
  });

  app.use((req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
  });

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello world!',
    });
  });

  app.use('*', (err, req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
    next(err);
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
    next();
  });

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();
    res.status(200).json({
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.post('/contacts', async (req, res) => {
    const contact = new Contact({
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      isFavourite: req.body.isFavourite,
      contactType: req.body.contactType,
      createdAt: req.body.createdAt,
      updatedAt: req.body.updatedAt,
    });
    try {
      const newContact = await contact.save();
      res.status(201).json(newContact);
    } catch (err) {
      res.status(400).json(err);
    }
  });

  app.get('/contacts/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const contact = await getContactById(id);

      if (!contact) {
        return res.status(404).json({
          status: 404,
          message: `Not Found`,
        });
      }

      res.status(200).json({
        message: `Successfully found contact with id ${id}!`,
        data: contact,
      });
    } catch (error) {
      console.error('Error getting contact:', error);
      res.status(500).json({
        status: 500,
        message: 'Internal Server Error',
      });
    }
  });
}

// setupServer();
export { setupServer };
