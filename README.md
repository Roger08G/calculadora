# Calculadora

Una calculadora web sencilla, adaptable y sin dependencias de producción.

## Funciones

- Operaciones de suma, resta, multiplicación y división.
- Decimales, porcentajes, cambio de signo y retroceso.
- Evaluación encadenada y repetición de la última operación con `=`.
- Mensaje controlado para divisiones entre cero.
- Interfaz accesible y adaptable a pantallas pequeñas.

## Ejecutar en local

Sirve el directorio con cualquier servidor HTTP estático. Por ejemplo:

```console
python -m http.server 8000
```

Después abre `http://localhost:8000`.

## Pruebas

Las pruebas usan el runner incluido en Node.js y no requieren instalar paquetes:

```console
npm test
```

Se requiere Node.js 20 o posterior.
