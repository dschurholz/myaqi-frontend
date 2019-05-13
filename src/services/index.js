import FireService from './FireService';
import SettingsService from './SettingsService';
import UserService from './UserService';
import storageFactory from "./StorageFactory";

const localStore = storageFactory(localStorage);
const sessionStore = storageFactory(sessionStorage);

export {
    FireService,
    SettingsService,
    UserService,
    localStore,
    sessionStore
};