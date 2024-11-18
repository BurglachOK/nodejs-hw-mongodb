import { ContactsCollection } from '../db/models/contacts.js';


export const getAllContacts = async ({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter = {},
    userId,
}) => {
    const skip = page > 0 ? (page - 1) * perPage : 0;

    const contactsQuery = ContactsCollection.find();

    if (filter.isFavourite !== undefined) {
        contactsQuery.where('isFavourite').equals(filter.isFavourite);
    }

    if (filter.type) {
        contactsQuery.where('contactType').equals(filter.type);
    }

    contactsQuery.where('userId').equals(userId);

    const [totalItems, contacts] = await Promise.all([
        ContactsCollection.countDocuments(contactsQuery),
        contactsQuery
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(perPage),
    ]);
    const totalPages = Math.ceil(totalItems / perPage);

    return {
        data: contacts,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: totalPages - page > 0,
    };
};

export const getContactById = async (userId, contactId) => {
    const contact = await ContactsCollection.findOne({ _id: contactId, userId });
    return contact;
};

export const createContact = async (userId, payload) => {
    const contact = await ContactsCollection.create({ ...payload, userId });
    return contact;
};

export const updateContact = async (
    userId,
    contactID,
    payload,
    options = {},
) => {
    const contact = await ContactsCollection.findOneAndUpdate(
        { _id: contactID, userId },
        payload,
        {
            new: true,
            ...options,
        },
    );

    if (!contact) return null;

    return contact;
};

export const deleteContact = async (ContactById) => {
    const contact = await ContactsCollection.findOneAndDelete(ContactById);
    return contact;
};
