# Flujo Relacional de Datos (Estilo MySQL Workbench)

## Objetivo
Definir un modelo relacional posible para la plataforma, basado en el flujo funcional del frontend, para poder dibujarlo en MySQL Workbench (EER) aunque hoy el proyecto este orientado a frontend.

## 1) Vision del dominio
La plataforma conecta:
- Startups
- Aceleradoras
- Inversores
- Administradores

Con procesos de:
- Solicitudes de ingreso
- Gestion de perfiles
- Mensajeria entre actores
- Notificaciones de contacto
- Moderacion administrativa

## 2) Entidades principales

### 2.1 administradores
Representa usuarios con permisos de gestion global.

Funcion:
- Validar solicitudes
- Gestionar usuarios
- Acceder a panel administrativo

### 2.2 startups
Representa empresas emergentes dentro de la plataforma.

Funcion:
- Tener perfil publico/privado
- Aparecer en mapa
- Chatear con aceleradoras/inversores

### 2.3 aceleradoras
Representa programas o entidades que aceleran startups.

Funcion:
- Tener perfil publico/privado
- Aparecer en buscador/mapa
- Chatear con startups

### 2.4 inversores
Representa inversionistas registrados.

Funcion:
- Tener perfil publico/privado
- Chatear con startups
- Explorar oportunidades

### 2.5 solicitudes
Representa solicitudes de ingreso (flujo startup).

Funcion:
- Capturar datos previos a aprobacion
- Ser aprobada/rechazada por administracion

### 2.6 solicitudes_aceleradoras
Representa solicitudes de ingreso (flujo aceleradora).

Funcion:
- Capturar datos de aceleradoras candidatas
- Ser aprobada/rechazada por administracion

### 2.7 chats_startups_aceleradoras
Representa conversaciones entre startup y aceleradora.

Funcion:
- Mensajeria directa
- Historial por conversacion

### 2.8 chats_inversores_startups
Representa conversaciones entre inversor y startup.

Funcion:
- Mensajeria directa
- Historial por conversacion

### 2.9 mensajes_contactanos
Representa mensajes enviados desde formulario de contacto.

Funcion:
- Bandeja de entrada para administracion
- Seguimiento de consultas externas

## 3) Relaciones (cardinalidad propuesta)

### 3.1 Relacion administrativa sobre solicitudes
- `administradores (1) -> (N) solicitudes`
- `administradores (1) -> (N) solicitudes_aceleradoras`

Interpretacion:
Un administrador puede revisar muchas solicitudes; cada solicitud puede quedar asociada al administrador que la proceso.

### 3.2 Solicitud a entidad final
- `solicitudes (1) -> (0..1) startups`
- `solicitudes_aceleradoras (1) -> (0..1) aceleradoras`

Interpretacion:
Una solicitud aprobada puede convertirse en un registro activo de startup/aceleradora.

### 3.3 Conversaciones startup-aceleradora
- `startups (1) -> (N) chats_startups_aceleradoras`
- `aceleradoras (1) -> (N) chats_startups_aceleradoras`

Interpretacion:
Una startup participa en muchas conversaciones; una aceleradora tambien.

### 3.4 Conversaciones inversor-startup
- `inversores (1) -> (N) chats_inversores_startups`
- `startups (1) -> (N) chats_inversores_startups`

Interpretacion:
Un inversor puede abrir muchos chats con startups; una startup puede recibir muchos chats de inversores.

### 3.5 Contacto externo
- `mensajes_contactanos` puede mantenerse independiente o enlazarse a `administradores` mediante campo de gestion (opcional).

## 4) Tablas puente o de detalle recomendadas
Para un modelo robusto tipo Workbench, conviene separar conversacion y mensaje:

### 4.1 conversacion_startup_aceleradora
Cabecera de conversacion (participantes, estado, fecha_creacion).

### 4.2 mensaje_startup_aceleradora
Detalle de mensajes (emisor, contenido, fecha_envio, leido/no leido).

### 4.3 conversacion_inversor_startup
Cabecera de conversacion (participantes, estado, fecha_creacion).

### 4.4 mensaje_inversor_startup
Detalle de mensajes (emisor, contenido, fecha_envio, leido/no leido).

Beneficio:
- Escalabilidad
- Mejor trazabilidad
- Consultas mas limpias para inbox/historial

## 5) Flujo relacional del negocio

### 5.1 Onboarding de startup
1. Usuario completa `solicitudes`.
2. Administracion revisa (pendiente/aprobada/rechazada).
3. Si aprueba, se crea registro en `startups`.
4. Startup ya aparece en mapa, perfil y modulos de chat.

### 5.2 Onboarding de aceleradora
1. Usuario completa `solicitudes_aceleradoras`.
2. Administracion revisa.
3. Si aprueba, se crea registro en `aceleradoras`.
4. Aceleradora queda disponible en buscador, mapa y chat.

### 5.3 Descubrimiento y relacion
1. Startups/aceleradoras/inversores consultan perfiles y mapas.
2. Se inicia conversacion.
3. Los mensajes quedan persistidos en tablas de chat.

### 5.4 Contacto institucional
1. Visitante envia formulario `mensajes_contactanos`.
2. Admin visualiza y gestiona notificaciones.

## 6) Diagrama conceptual (texto)
- Administrador gestiona Solicitudes Startup
- Administrador gestiona Solicitudes Aceleradora
- Solicitud Startup aprobada genera Startup
- Solicitud Aceleradora aprobada genera Aceleradora
- Startup se relaciona con Aceleradora via Chat
- Inversor se relaciona con Startup via Chat
- Contacto externo alimenta Mensajes Contacto

## 7) Reglas de negocio sugeridas
- No crear `startup` o `aceleradora` sin solicitud aprobada.
- No permitir chat si una entidad no esta activa.
- Marcar estados estandar: `pendiente`, `aprobada`, `rechazada`.
- Usar borrado logico (`activo`, `eliminado_en`) en entidades clave.

## 8) Convencion recomendada para Workbench
- PK: `id` autoincremental.
- FK explicitas con nombre semantico (`startup_id`, `aceleradora_id`, etc.).
- Campos de auditoria en todas las tablas: `created_at`, `updated_at`.
- Indices en claves de busqueda frecuentes: nombre, sector, etapa, region.

## 9) Resultado esperado en EER
Al pasarlo a MySQL Workbench deberias ver:
- Un nucleo de entidades de usuario/actor (`startups`, `aceleradoras`, `inversores`, `administradores`).
- Un bloque de onboarding (`solicitudes`, `solicitudes_aceleradoras`).
- Un bloque de interaccion (`chats_*` o cabecera/detalle de mensajes).
- Un bloque de soporte (`mensajes_contactanos`).

Este modelo refleja de forma consistente el flujo funcional que hoy expone el frontend.
