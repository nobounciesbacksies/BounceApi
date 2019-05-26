import * as fs from 'fs';
import { join } from 'path';
import * as sha1 from 'sha1';

export default {
    privateKey: fs.readFileSync(join(__dirname, '..', '..', 'keys', 'bounceapi.key')) || 'privateKey',
    publicKey: fs.readFileSync(join(__dirname, '..', '..', 'keys', 'bounceapi.key.pub')) || 'publicKey',
    kid: sha1(fs.readFileSync(join(__dirname, '..', '..', 'keys', 'bounceapi.key')) || 12345),
};