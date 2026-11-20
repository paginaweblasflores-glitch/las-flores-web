# Notificaciones de reservas por WhatsApp

## Objetivo

Enviar una notificación automática al teléfono del restaurante cuando un cliente cree una reserva, aunque el panel de ventas no esté abierto.

## Enfoque aprobado

Usar WhatsApp Cloud API a través de una Supabase Edge Function activada por un Database Webhook o una función de base de datos con disparador.

No debe utilizarse WhatsApp Web personal ni automatizacion de navegador.

## Flujo

1. El cliente completa el formulario de reservas.
2. La aplicacion guarda el registro en `public.reservations`.
3. Supabase ejecuta el webhook despues del `INSERT`.
4. La Edge Function valida el evento y genera el mensaje.
5. WhatsApp Cloud API envia el mensaje a uno o varios destinatarios configurados.
6. La reserva permanece guardada aun si el proveedor de WhatsApp falla temporalmente.

## Contenido del mensaje

La alerta debe incluir:

- Nombre del cliente.
- Numero de telefono del cliente.
- Fecha de la reserva.
- Hora de la reserva.
- Numero de personas.
- Salon seleccionado, si existe.
- Codigo o identificador de la reserva.
- Estado inicial de la reserva.

## Configuracion

Los siguientes datos deben almacenarse como secretos de Supabase, nunca en el codigo fuente:

- Token de WhatsApp Cloud API.
- Identificador del numero telefonico comercial.
- Identificador de la plantilla aprobada por WhatsApp.
- Lista o numero del equipo que recibira las alertas.

El destinatario inicial sera Mariaanella, Area de Ventas. Su numero quedara pendiente hasta que se proporcione con codigo de pais.

El template aprobado debe reservar una variable por cada dato enviado. Una plantilla simple puede usar variables para nombre, fecha, hora, personas y codigo.

## Fiabilidad

- Registrar reservas notificadas para evitar duplicados ante reintentos.
- Usar el identificador de la reserva como clave de idempotencia.
- Registrar intentos fallidos y respuestas del proveedor.
- No mostrar al cliente un error de guardado si falla la notificacion.
- Permitir reenvio manual desde el panel de ventas si fuera necesario.

## Seguridad

- Validar que el webhook proviene de Supabase.
- Usar un secreto compartido o firma configurada para el webhook.
- No exponer tokens de WhatsApp al navegador.
- Limitar el contenido enviado a los datos necesarios.

## Fuera de alcance

- Mensajes interactivos desde WhatsApp.
- Confirmacion automatica de la reserva por WhatsApp.
- Aplicacion movil nativa.
- Integraciones con SMS o push PWA.

## Prerequisitos para implementacion

- Numero registrado en WhatsApp Business.
- Cuenta Meta Business y WhatsApp Cloud API configurados.
- Plantilla de alerta aprobada.
- Destinatarios configurados.
- Permisos de Supabase para desplegar Edge Functions y secretos.
