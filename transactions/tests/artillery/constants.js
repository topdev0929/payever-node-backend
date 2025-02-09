const RULES = {
    ruleId: 'b3afade0-abdd-4c3f-93c8-c4a11b4660e4'
}

const USER = {
    userId: 'e6c9e071-c354-4112-b625-676b24231f14',
    uuid: '144c6450-94d0-4132-929d-0991bac27f44'
}

const BUSINESS = {
    reference: 'dasd',
    originalId: '5c264a87ccb0de00115d2d1d',
    uuid: '144c6450-94d0-4132-929d-0991bac27f44',
    action: 'string',
    pdf: 'test.pdf',
    name: 'test.pdf',
    paymentId: '144c6450-94d0-4132-929d-0991bac27f44'
}

const FOLDERS_USER = {
    folderId: '24fd7e13-8e65-4751-9c45-3ccb5c11c8c6',
    documentId: '24fd7e13-8e65-4751-9c45-3ccb5c11c8c6',
    locationId: '24fd7e13-8e65-4751-9c45-3ccb5c11c8c6',
    userId: 'bdc683d8-e28f-4e40-a742-28fb510454cb',
}

const FOLDER_DATA = {
    parentFolderId: '79b3c988-3921-48c8-8850-68b4837337a1',
    isHeadline: true,
    image: 'ic.png',
    name: 'folder name',
    description: 'folder description',
    isProtected: true,
    position: 0
}

const FOLDERS_BUSINESS = {
    folderId: 'cabf6916-594b-4b49-bff3-02253d4fdfab',
    documentId: '157e2b4b-b280-4b49-a7b9-6bb37786001d',
    locationId: 'cabf6916-594b-4b49-bff3-02253d4fdfab',
}

const FOLDERS_ADMIN = {
    folderId: 'c09bbd46-9a12-4848-b54a-345516a08a3f'
}

const LEGACY_API = {
    originalId: '72aee86f0d46505752d79fc5d4544c97'
}

const SCHEDULE = {
    scheduleId: 'e6f79984-3f60-4924-ada4-55d88ae2a887'
}

const INTEGRATION = {
    name: 'bxvdtfdnzveizkar'
}

const ADMIN = {
    uuid: '81712c14-0894-4829-ba84-72150dae1217',
    reference: 'taest'
}

const CONFIG = {
    target: 'https://transactions-backend.test.devpayever.com',
    variables: {
        authUrl: 'https://auth.test.devpayever.com',
        email: 'artillery@payever.de',
        plainPassword: 'Payever123!',
        businessId: '205954e0-4641-41fa-b6ca-6d0d83b37fad',
    },
    http: {
        timeout: 15,
    }
};
module.exports = {
    CONFIG,
    ADMIN,
    INTEGRATION,
    SCHEDULE,
    LEGACY_API,
    FOLDERS_ADMIN,
    FOLDERS_BUSINESS,
    FOLDERS_USER,
    BUSINESS,
    USER,
    RULES,
    FOLDER_DATA
}