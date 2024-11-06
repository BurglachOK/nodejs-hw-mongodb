import {
    createContact,
    deleteContact,
    getAllContacts,
    getContactById,
    updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloud.js';
import { env } from '../utils/env.js';

export const getAllContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const userId = req.user._id;

    const data = await getAllContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
        userId,
    });

    res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data,
    });
};

export async function getContactByIdController(req, res, next) {
    const { contactId } = req.params;
    const userId = req.user._id;
    const contact = await getContactById(userId, contactId);

    if (contact === null) {
        throw createHttpError(404, 'Contact not found');
    }
    res.json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
    });
}

export async function createContactController(req, res, next) {
    const photo = req.file;

    let photoUrl;

    if (photo) {
        if (env('ENABLE_CLOUDINARY') === 'true') {
            photoUrl = await saveFileToCloudinary(photo);
        } else {
            photoUrl = await saveFileToUploadDir(photo);
        }
    }
    const result = await createContact(req.user._id, {
        ...req.body,
        photo: photoUrl,
    });

    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: result,
    });
}

export async function updateContactController(req, res, next) {
    const { contactId } = req.params;
    const userId = req.user._id.toString();
    const photo = req.file;

    let photoUrl;

    if (photo) {
        if (env('ENABLE_CLOUDINARY') === 'true') {
            photoUrl = await saveFileToCloudinary(photo);
        } else {
            photoUrl = await saveFileToUploadDir(photo);
        }
    }

    const result = await updateContact(userId, contactId, {
        ...req.body,
        photo: photoUrl,
    });

    if (result === null) {
        throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
        status: 200,
        message: 'Successfully patched a contact!',
        data: result,
    });
}

export async function deleteContactController(req, res, next) {
    const { contactId } = req.params;
    const userId = req.user._id;
    const result = await deleteContact(userId, contactId);
    if (result === null) {
        throw createHttpError(404, 'Contact not found');
    }

    res.status(204).send();
}
