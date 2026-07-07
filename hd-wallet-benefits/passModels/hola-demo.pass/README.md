# hola-demo.pass

Este folder es el modelo base del pass.

Para que Apple Wallet acepte el pass real, este modelo necesita imagenes validas.

Agrega minimo:

```text
icon.png
icon@2x.png
```

Opcionalmente puedes agregar:

```text
logo.png
logo@2x.png
strip.png
strip@2x.png
thumbnail.png
thumbnail@2x.png
```

Notas:

- `icon.png` es obligatorio para que el pass funcione correctamente en iPhone.
- El `pass.json` trae valores demo, pero el script `generate-pass.js` sobreescribe los datos criticos desde `.env`.
- No agregues `manifest.json` ni `signature`; la libreria los genera automaticamente.
