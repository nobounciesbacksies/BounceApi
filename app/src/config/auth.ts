import * as fs from 'fs';
import { join } from 'path';
import * as sha1 from 'sha1';

export default {
  privateKey:
    fs.readFileSync(join(__dirname, '..', '..', 'keys', 'bounceapi.key'), 'utf8') ||
    'privateKey',
  publicKey:
    fs.readFileSync(join(__dirname, '..', '..', 'keys', 'bounceapi.key.pub'), 'utf8') ||
    'publicKey',
  kid: sha1(
    fs.readFileSync(join(__dirname, '..', '..', 'keys', 'bounceapi.key'), 'utf8') ||
      12345,
  ),
  algo: 'RS256',
  audience: 'blacklist-api',
  issuer: 'healthemail.io',
  clockTolerance: 5,
};
