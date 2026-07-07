# HD Wallet Benefits Starter

Starter local para probar Apple Wallet passes con `passkit-generator` antes de construir la plataforma multimarca de Hola Digital.

## Objetivo

Validar primero lo mas importante:

1. Generar un `.pkpass` real.
2. Firmarlo con certificados Apple Wallet.
3. Abrirlo en iPhone.
4. Probar una tarjeta tipo beneficios con QR unico.

Todavia no incluye panel, Supabase, multi-tenant ni scanner. Eso va despues de confirmar que el pass funciona en Apple Wallet.

## Estructura

```text
hd-wallet-benefits/
├── package.json
├── generate-pass.js
├── .env.example
├── certs/
│   └── .gitkeep
├── output/
│   └── .gitkeep
└── passModels/
    └── hola-demo.pass/
        ├── pass.json
        └── README.md
```

## Instalacion local

Desde la raiz del repo:

```bash
cd hd-wallet-benefits
npm install
cp .env.example .env
```

Despues agrega tus certificados reales en:

```text
certs/wwdr.pem
certs/signerCert.pem
certs/signerKey.pem
```

Y configura `.env` con:

```text
PASSKIT_TEAM_IDENTIFIER=
PASSKIT_PASS_TYPE_IDENTIFIER=
PASSKIT_SIGNER_KEY_PASSPHRASE=
```

## Generar pass

```bash
npm run generate
```

Si todo esta correcto, se genera:

```text
output/hola-benefits-demo.pkpass
```

Ese archivo se puede probar en iPhone por AirDrop, Mail, WhatsApp o desde un link HTTPS.

## Importante

No subas certificados reales a GitHub.

Los archivos dentro de `certs/` y `output/` estan ignorados por seguridad.

## Siguiente paso despues de validar

Cuando el `.pkpass` funcione en iPhone, el siguiente paso es crear una app propia:

```text
Next.js + Supabase + passkit-generator
```

con modulos para:

- marcas/clientes;
- templates por marca;
- miembros;
- beneficios;
- puntos/saldo promocional;
- redenciones;
- scanner QR;
- reportes;
- actualizacion dinamica de passes.
