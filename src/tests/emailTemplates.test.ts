import { describe, expect, it } from "vitest";
import { renderTransactionalEmail } from "../../api/_lib/emailTemplates";

const internal = "contacto@restaurantelasflores.com";

const templateCases = [
  {
    template: "order",
    data: {
      audience: "internal",
      customerEmail: "customer@example.com",
      orderId: "order-123",
      customerName: "Ana",
      orderType: "delivery",
      items: [{ name: "Papas", quantity: 1, price: 10 }],
      subtotal: 10,
      deliveryFee: 5,
      totalAmount: 15,
      paymentMethod: "culqi",
      address: "Jr. Olaya 106",
    },
  },
  {
    template: "reservation",
    data: {
      audience: "internal",
      customerEmail: "customer@example.com",
      name: "Ana",
      reservationDate: "2026-10-24",
      reservationTime: "19:00",
      guests: 2,
      phone: "999111222",
      zone: "Terraza",
    },
  },
  {
    template: "contact",
    data: { name: "Ana", email: "ana@example.com", phone: "", message: "Hola" },
  },
  {
    template: "eventQuote",
    data: {
      name: "Ana",
      email: "ana@example.com",
      phone: "999111222",
      guests: 20,
      eventType: "Cumpleaños",
      eventDate: "2026-12-01",
      message: "Consulta",
    },
  },
  {
    template: "complaint",
    data: {
      audience: "internal",
      code: "LR-123",
      fullName: "Ana",
      email: "ana@example.com",
      docType: "DNI",
      docNumber: "12345678",
      phone: "999111222",
      address: "Jr. Olaya 106",
      isMinor: false,
      claimedType: "producto",
      claimedDescription: "Almuerzo",
      claimType: "reclamo",
      detail: "Detalle",
      consumerRequest: "Solicitud",
    },
  },
  {
    template: "complaintResponse",
    data: {
      code: "LR-123",
      fullName: "Ana",
      email: "ana@example.com",
      claimType: "reclamo",
      statusLabel: "Respondido",
      adminResponse: "Respuesta",
    },
  },
  {
    template: "reviewRequest",
    data: { name: "Ana", email: "ana@example.com" },
  },
] as const;

describe("renderTransactionalEmail", () => {
  it.each(templateCases)("renders the $template template", ({ template, data }) => {
    const rendered = renderTransactionalEmail(template, data);

    expect(rendered.subject).toBeTruthy();
    expect(rendered.html).toContain("<");
    expect(rendered.from).toContain("@restaurantelasflores.com");
  });

  it("rejects unknown template names", () => {
    expect(() => renderTransactionalEmail("arbitrary", {})).toThrow(/template/i);
  });

  it.each([
    ["order", "totalAmount"],
    ["reservation", "name"],
    ["contact", "message"],
    ["eventQuote", "email"],
    ["complaint", "code"],
    ["complaintResponse", "adminResponse"],
    ["reviewRequest", "email"],
  ])("rejects missing required data for %s", (template, requiredField) => {
    const testCase = templateCases.find((candidate) => candidate.template === template)!;
    const data = { ...testCase.data } as Record<string, unknown>;
    delete data[requiredField];

    expect(() => renderTransactionalEmail(template, data)).toThrow(new RegExp(requiredField, "i"));
  });

  it("routes internal notifications only to the fixed restaurant address", () => {
    for (const { template, data } of templateCases) {
      if (
        template === "contact" ||
        template === "eventQuote" ||
        template === "order" ||
        template === "reservation" ||
        template === "complaint"
      ) {
        expect(renderTransactionalEmail(template, data).to).toBe(internal);
      }
    }
  });

  it("routes customer mail only to a validated customer address", () => {
    const rendered = renderTransactionalEmail("reviewRequest", {
      name: "Ana",
      email: "ana@example.com",
    });

    expect(rendered.to).toBe("ana@example.com");
    expect(() =>
      renderTransactionalEmail("reviewRequest", { name: "Ana", email: "not-an-email" }),
    ).toThrow(/email/i);
    expect(() =>
      renderTransactionalEmail("reviewRequest", {
        name: "Ana",
        email: "ana@example.com,attacker@example.com",
      }),
    ).toThrow(/email/i);
  });

  it.each([
    [
      "order",
      {
        ...templateCases[0].data,
        audience: "customer",
      },
    ],
    [
      "reservation",
      {
        ...templateCases[1].data,
        audience: "customer",
      },
    ],
    [
      "complaint",
      {
        ...templateCases[4].data,
        audience: "customer",
      },
    ],
  ])("routes valid %s customer notifications to the operation email", (template, data) => {
    expect(renderTransactionalEmail(template, data).to).toBe(
      template === "complaint" ? "ana@example.com" : "customer@example.com",
    );
  });

  it("escapes HTML metacharacters in interpolated text", () => {
    const rendered = renderTransactionalEmail("contact", {
      name: `<script>&"'`,
      email: "ana@example.com",
      message: `<script>&"'`,
    });

    expect(rendered.html).toContain("&lt;script&gt;&amp;&quot;&#39;");
    expect(rendered.html).not.toContain("<script>");
  });

  it("rejects caller-supplied destinations and markup", () => {
    expect(() =>
      renderTransactionalEmail("contact", {
        name: "Ana",
        email: "ana@example.com",
        message: "Hola",
        to: "attacker@example.com",
        html: "<script>",
        from: "attacker@example.com",
      }),
    ).toThrow(/unexpected|not allowed/i);
  });
});
