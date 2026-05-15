# Diseño Técnico — Gestión de Configuración y Secretos

## Fuente de verdad

- **Local**: `backend/.env` ignorado por git; `backend/.env.example` como contrato.
- **Producción**: variables inyectadas por el orquestador; mismo esquema de nombres que el ejemplo.

## Validación al arranque

- Un solo módulo exporta `config: ConfigNexora` tipado.
- Si `NODE_ENV === 'production'`, rechazar placeholders conocidos (`cambia_este_secreto`, `tu_api_key_aqui`).

## Mobile

- Solo `EXPO_PUBLIC_API_URL`; builds deben usar HTTPS en prod.

## Relación con otros specs

- **Observabilidad**: lista deny de campos en logs.
- **IA**: keys solo servidor.

## Migración futura

- Sustituir lectura plana por cliente Vault manteniendo la interfaz `ConfigNexora` estable.
