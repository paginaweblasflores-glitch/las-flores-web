# Diseno: pedidos y cuentas por mesa para el salon

**Fecha:** 2026-10-27
**Estado:** diseno funcional y tecnico aprobado; revision del documento pendiente
**Alcance:** modulo interno de pedidos en salon para Restaurante Las Flores

## Objetivo

Crear un flujo interno, independiente del checkout de delivery y recojo, para
que el personal tome pedidos por mesa, envie comandas diferenciadas a cocina y
bar, y permita que caja consulte, cobre y cierre cualquier mesa.

El cliente paga presencialmente con efectivo o el POS fisico del restaurante.
Los pagos en linea de delivery mediante Culqi y las cuentas Yape de delivery no
son parte de este flujo.

## Usuarios y permisos

- **Mozo:** inicia sesion con su cuenta individual actual del personal; crea y
  amplia cuentas abiertas, consulta las mesas y envia comandas en nombre propio.
- **Caja/cajera:** inicia sesion con su cuenta actual; puede consultar todas
  las mesas y cuentas abiertas, registrar el cobro presencial y cerrar cuentas.
- No se crea un segundo mecanismo de contrasenas ni una cuenta compartida de
  mozo.
- La interfaz muestra solo las operaciones permitidas por el rol. La
  autorizacion se verifica tambien en la base de datos, no solo en el cliente.

## Flujo aprobado

### Seleccion y pedido

1. El personal abre la pagina interna `/salon`.
2. La vista de trabajo A muestra, en una misma pantalla:
   - botones de los salones configurados, sin fotografias;
   - las mesas de cada salon, diferenciadas claramente como libres u ocupadas;
   - busqueda inmediata de platos en el menu disponible;
   - personalizaciones, productos seleccionados y resumen de la cuenta.
3. La disponibilidad se deriva de las cuentas abiertas guardadas en el
   servidor. El numero de mesas se obtiene de la configuracion existente de
   salones.
4. Seleccionar una mesa ocupada abre su cuenta actual. Los pedidos adicionales
   se agregan a una unica cuenta abierta por mesa.
5. El mozo anade productos del catalogo en vivo, incluidos sus precios y
   personalizaciones vigentes, y envia una comanda con su identidad asociada.
   El ticket identifica salon, mesa, fecha, mozo y productos.
6. El sistema enruta automaticamente los productos de categorias de bebidas a
   bar y los demas productos a cocina. Si un producto de bebida no puede
   clasificarse con las categorias disponibles, el error de clasificacion debe
   mostrarse; no se envia silenciosamente a una estacion incorrecta.
7. El sistema persiste la cuenta, sus articulos y las comandas dirigidas a
   cada estacion. Una confirmacion de exito significa que estos datos quedaron
   guardados.

### Caja, cobro y cierre

1. Caja puede abrir la vista de todas las mesas y entrar a cualquier cuenta
   activa, independientemente de quien haya registrado la comanda.
2. Caja ve el detalle de la cuenta, los articulos, las comandas y los mozos
   responsables.
3. La cajera registra que recibio el pago en efectivo o en POS fisico. Este
   registro no cobra la tarjeta por internet ni se envia a Culqi.
4. Al registrar exitosamente el cobro, la cuenta se cierra y la mesa vuelve a
   aparecer libre.
5. Caja selecciona boleta o factura e ingresa los datos necesarios para
   solicitar su emision.
6. La emision electronica real depende del facturador utilizado por el
   restaurante, aun no identificado. Hasta instalar y configurar una
   integracion verificada, el sistema muestra y conserva el comprobante como
   pendiente de emision y nunca afirma que ya fue emitido. El estado del cobro
   y el estado del comprobante son independientes.

## Arquitectura

- Anadir un modulo interno, accesible mediante la ruta `/salon`, sin reemplazar
  ni ampliar el modelo `orders`/`order_items` ni el checkout de delivery.
- Reutilizar la autenticacion del personal, el catalogo de productos, las
  categorias, los precios vigentes y las personalizaciones ya utilizadas por
  la carta.
- Mantener estado, carrito y resumen del salon separados del carrito de
  delivery para evitar que una operacion mezcle items o metodos de pago.
- Almacenar las cuentas del salon y sus articulos, comandas y cobros en
  entidades propias de la base de datos. Los nombres finales de las tablas y
  RPC se definiran durante la planificacion.
- Una operacion transaccional del lado del servidor crea la cuenta o agrega
  articulos y crea las comandas de estacion. Otra operacion valida y registra
  el cobro y cierra la cuenta. Las restricciones del servidor impiden dos
  cuentas activas para el mismo salon y mesa y protegen de envios o cobros
  concurrentes.
- Los permisos de base de datos limitan la creacion de comandas al personal y
  el cobro/cierre a caja y administracion.
- Cada solicitud de impresion se conserva en una cola persistente con estado,
  estacion, errores y reintentos/idempotencia. La cola permite conectar las
  comandas al puente que imprime en las termicas de cocina y bar.
- La emision de comprobantes se conecta mediante un adaptador al facturador
  del restaurante. La integracion final requiere conocer el proveedor y sus
  credenciales y entorno.

## Dependencias para la puesta en marcha

El restaurante pidio impresion automatica en impresoras termicas y emision de
boletas/facturas. El repositorio no identifica un puente, sistema operativo,
modelo o protocolo de conexion de las impresoras, ni identifica el facturador
electronico actual. Culqi en este proyecto procesa cobros web, pero no es
evidencia de que emita comprobantes electronicos para este restaurante.

Por lo tanto, el desarrollo inicial puede cubrir el flujo del salon, la
persistencia de comandas y cobros, y los adaptadores/estados necesarios, pero
**no se considerara listo para operar en el restaurante** hasta identificar y
configurar:

1. el puente local o servicio de impresion, las impresoras de cada estacion y
   la asociacion de cocina/bar a sus destinos;
2. el proveedor de facturacion electronica y sus requisitos de API,
   autenticacion y datos del cliente.

No se sustituye la impresion automatica por un dialogo del navegador y no se
emite un comprobante ficticio. Si cualquiera de los servicios falla, el pedido
o cobro conserva su resultado real y la tarea externa se senala
explícitamente como pendiente o fallida.

## Manejo de errores

- Mostrar y registrar los errores de lectura de salones, menu y disponibilidad;
  no mostrar una lista vacia como si no hubiera mesas ni productos cuando la
  consulta falla.
- No perder una comanda si falla el envio a una impresora: conservarla y
  mostrar el estado de impresion y el error a personal autorizado.
- No confirmar el envio si falla la transaccion que persiste los articulos o
  tickets.
- No liberar una mesa si falla la transaccion del cobro/cierre.
- Si la emision del comprobante falla o no esta configurada, guardar el estado
  pendiente/fallido, mostrar la causa disponible y no presentar el documento
  como emitido.
- Las transiciones de cuenta, cobro, impresion y comprobante deben ser
  idempotentes frente a reintentos de red.

## Pruebas y criterios de aceptacion

- El menu `/salon` solo admite cuentas autorizadas del personal; las acciones
  de caja requieren un rol autorizado para cobrar.
- Los salones y cantidades de mesa reflejan la configuracion vigente, sin
  imagenes; cada mesa refleja correctamente su disponibilidad.
- La busqueda encuentra rapidamente platos por nombre y filtra la carta sin
  cambiar los productos, precios o personalizaciones existentes.
- Dos mozos que trabajen en una mesa ocupada agregan sus comandas a una sola
  cuenta, y cada comanda identifica al mozo que la envio.
- Las categorias de bebidas generan tickets para bar y las demas categorias
  generan tickets para cocina, sin duplicacion ni perdida de articulos.
- Dos envios concurrentes no crean dos cuentas abiertas para la misma mesa;
  dos intentos concurrentes de cobro no generan cierres o cobros duplicados.
- Caja puede consultar todas las mesas, revisar su cuenta y registrar efectivo
  o POS fisico. Tras un cobro confirmado, la cuenta se cierra y libera la mesa.
- Una falla o ausencia del puente de impresoras deja el ticket visible como
  pendiente/fallido; nunca se confirma una impresion que no ocurrio.
- Una falla o ausencia del facturador deja la emision marcada como pendiente o
  fallida; nunca se afirma una emision electronica que no ocurrio.
- Las pruebas de no regresion verifican que el carrito y checkout de delivery
  y recojo, Culqi y las funciones de caja existentes mantienen su
  comportamiento.

## Fuera de alcance

- Cambios a los pedidos existentes de delivery y recojo, a sus precios de envio
  o a su proceso de pago en linea.
- Pedidos publicos desde QR y gestion de reservas.
- Integrar cobros con Culqi: la cajera registra pagos de un POS fisico o en
  efectivo.
- Dividir cuentas, cobrar parcialmente una mesa, propinas, anulaciones,
  devoluciones e inventario, salvo que se acuerden en una especificacion
  posterior.
- Elegir unilateralmente un proveedor de comprobantes o un modelo de impresora
  sin conocer los sistemas instalados en el restaurante.
