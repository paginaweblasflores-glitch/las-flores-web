import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const cartaSource = readFileSync(resolve(process.cwd(), "src/routes/carta.tsx"), "utf8");
const deliverySource = readFileSync(resolve(process.cwd(), "src/components/MenuModal.tsx"), "utf8");

describe("single-price dish card layout", () => {
  it("places the Carta single price after the description and aligned to the left", () => {
    const cardStart = cartaSource.indexOf('<div className="p-5 flex flex-col flex-1">');
    const cardEnd = cartaSource.indexOf(
      "\n                  </div>\n                </div>",
      cardStart,
    );
    const cardContent = cartaSource.slice(cardStart, cardEnd);

    expect(cardContent.indexOf("{dish.description}")).toBeGreaterThanOrEqual(0);
    expect(cardContent.indexOf("{displayPrice}")).toBeGreaterThan(
      cardContent.indexOf("{dish.description}"),
    );
    expect(cardContent).toContain('className="self-start');
  });

  it("places the Delivery price after the description and before the add button", () => {
    const cardContent =
      deliverySource
        .split('<div className="px-5 pb-5 pt-3 flex flex-col flex-1">')[1]
        ?.split("\n      </div>\n    </div>")[0] ?? "";

    expect(cardContent.indexOf("{dish.description}")).toBeGreaterThanOrEqual(0);
    expect(cardContent.indexOf("{dish.price}")).toBeGreaterThan(
      cardContent.indexOf("{dish.description}"),
    );
    expect(cardContent.indexOf("<button")).toBeGreaterThan(cardContent.indexOf("{dish.price}"));
    expect(cardContent).toContain('className="self-start');
  });
});
