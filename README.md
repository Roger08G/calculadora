# Calculadora

Una calculadora web sencilla, adaptable y sin dependencias de producción.

## Funciones

- Operaciones de suma, resta, multiplicación y división.
- Decimales, porcentajes, cambio de signo y retroceso.
- Evaluación encadenada y repetición de la última operación con `=`.
- Control mediante ratón, pantalla táctil o teclado físico.
- Historial de las ocho operaciones más recientes.
- Mensaje controlado para divisiones entre cero.
- Interfaz accesible y adaptable a pantallas pequeñas.

## Atajos de teclado

- Números y operadores: `0-9`, `+`, `-`, `*` y `/`.
- Resultado: `Intro` o `=`.
- Decimal: `.` o `,`.
- Limpiar: `Escape` o `C`.
- Borrar el último dígito: `Retroceso`.

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
