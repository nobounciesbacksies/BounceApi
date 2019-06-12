import * as fs from 'fs';
import { join } from 'path';
import * as sha1 from 'sha1';

export default {
  privateKey:
    fs.readFileSync(join(__dirname, '..', '..', 'keys', 'unsubscribe.key'), 'utf8') ||
    'privateKey',
  publicKey:
    fs.readFileSync(join(__dirname, '..', '..', 'keys', 'unsubscribe.key.pub'), 'utf8') ||
    'publicKey',
  kid: sha1(
    fs.readFileSync(join(__dirname, '..', '..', 'keys', 'unsubscribe.key'), 'utf8') ||
      12345,
  ),
  signOptions: {
    issuer: 'healthemail.io',
    audience: 'blacklist-api',
    algorithm: 'RS256',
  },
  apiUrl: 'www.healthemail.io/api/v1/unsub/',
};