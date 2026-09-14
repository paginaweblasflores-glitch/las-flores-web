// Utilidades compartidas para imprimir tickets térmicos (80mm) en una ventana
// aislada — sin el resto de la app en el documento — para que Chrome no
// cuente el alto invisible del fondo y genere páginas extra en blanco.

// Abre una ventana en blanco. Debe llamarse de forma síncrona, en el mismo
// evento de clic del usuario (sin ningún "await" antes) — si no, Chrome ya
// no lo reconoce como un gesto directo del usuario y bloquea el popup.
export const openBlankWindow = () => window.open("", "_blank", "width=350,height=600");

// Escribe el ticket en una ventana ya abierta e imprime desde ahí.
export const writeTicketAndPrint = (win: Window, bodyHtml: string, title = "Ticket") => {
  win.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <style>
          @page { size: 80mm auto; margin: 3mm; }
          * { box-sizing: border-box; }
          body {
            font-family: "Courier New", monospace;
            font-weight: bold;
            font-size: 11px;
            line-height: 1.3;
            color: #000;
            width: 72mm;
            margin: 0;
            padding: 0;
          }
          p { margin: 0; }
          .center { text-align: center; }
          .row { display: flex; justify-content: space-between; }
          hr { border: none; border-top: 1px solid #000; margin: 4px 0; }
        </style>
      </head>
      <body>${bodyHtml}</body>
    </html>
  `);
  win.document.close();
  win.focus();
  win.onafterprint = () => win.close();
  setTimeout(() => {
    win.print();
  }, 200);
};

// Abre e imprime en un solo paso (para casos donde no hace falta await
// entre el clic y el contenido, como la comanda de cocina).
export const printTicket = (bodyHtml: string, title = "Ticket") => {
  const win = openBlankWindow();
  if (win) writeTicketAndPrint(win, bodyHtml, title);
};
