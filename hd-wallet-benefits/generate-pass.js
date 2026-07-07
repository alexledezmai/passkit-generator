import 'dotenv/config';
import { PKPass } from 'passkit-generator';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const requiredEnv = [
  'PASSKIT_TEAM_IDENTIFIER',
  'PASSKIT_PASS_TYPE_IDENTIFIER',
  'PASSKIT_SIGNER_KEY_PASSPHRASE'
];

for (const key of requiredEnv) {
  if (!process.env[key] || process.env[key].startsWith('YOUR_')) {
    throw new Error(`Missing required env value: ${key}. Copy .env.example to .env and configure it.`);
  }
}

const certsPath = path.join(__dirname, 'certs');
const outputPath = path.join(__dirname, 'output');
const modelPath = path.join(__dirname, 'passModels', 'hola-demo.pass');

const certFiles = {
  wwdr: path.join(certsPath, 'wwdr.pem'),
  signerCert: path.join(certsPath, 'signerCert.pem'),
  signerKey: path.join(certsPath, 'signerKey.pem')
};

for (const [label, filePath] of Object.entries(certFiles)) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing certificate file for ${label}: ${filePath}`);
  }
}

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const certificates = {
  wwdr: fs.readFileSync(certFiles.wwdr),
  signerCert: fs.readFileSync(certFiles.signerCert),
  signerKey: fs.readFileSync(certFiles.signerKey),
  signerKeyPassphrase: process.env.PASSKIT_SIGNER_KEY_PASSPHRASE
};

const serialNumber = process.env.PASSKIT_SERIAL_NUMBER || `HD-${Date.now()}`;
const memberName = process.env.PASSKIT_MEMBER_NAME || 'Cliente Demo';
const memberLevel = process.env.PASSKIT_MEMBER_LEVEL || 'VIP';
const memberPoints = process.env.PASSKIT_MEMBER_POINTS || '0';
const memberBenefit = process.env.PASSKIT_MEMBER_BENEFIT || 'Beneficio activo';
const validationUrl = process.env.PASSKIT_VALIDATION_URL || `https://holadigital.mx/wallet/validate/${serialNumber}`;

const pass = await PKPass.from(
  {
    model: modelPath,
    certificates
  },
  {
    serialNumber,
    teamIdentifier: process.env.PASSKIT_TEAM_IDENTIFIER,
    passTypeIdentifier: process.env.PASSKIT_PASS_TYPE_IDENTIFIER,
    organizationName: process.env.PASSKIT_ORGANIZATION_NAME || 'Hola Digital'
  }
);

pass.primaryFields.push({
  key: 'member',
  label: 'MIEMBRO',
  value: memberName
});

pass.secondaryFields.push(
  {
    key: 'points',
    label: 'PUNTOS',
    value: memberPoints
  },
  {
    key: 'level',
    label: 'NIVEL',
    value: memberLevel
  }
);

pass.auxiliaryFields.push({
  key: 'benefit',
  label: 'BENEFICIO',
  value: memberBenefit
});

pass.backFields.push(
  {
    key: 'terms',
    label: 'Terminos',
    value: 'Beneficio sujeto a reglas, vigencia y validacion de la marca emisora.'
  },
  {
    key: 'validation_url',
    label: 'Validacion',
    value: validationUrl
  }
);

pass.setBarcodes({
  message: validationUrl,
  format: 'PKBarcodeFormatQR',
  messageEncoding: 'iso-8859-1'
});

const buffer = pass.getAsBuffer();
const outputFile = path.join(outputPath, 'hola-benefits-demo.pkpass');
fs.writeFileSync(outputFile, buffer);

console.log(`Pass generated: ${outputFile}`);
console.log('Send this .pkpass to an iPhone through AirDrop, Mail, WhatsApp, or host it behind HTTPS.');
