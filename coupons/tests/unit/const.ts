import {
    ValidatorOptions,
} from 'class-validator';

export const validateOptions: ValidatorOptions = {
    forbidNonWhitelisted: true,
    whitelist: true,
};
