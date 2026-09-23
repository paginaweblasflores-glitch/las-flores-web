import { describe, expect, it } from "vitest";
import { getFestividadesDestacadas } from "../lib/festividadesLayout";

describe("getFestividadesDestacadas", () => {
  it("limita la sección a solo tres tarjetas y conserva el orden original", () => {
    const festividades = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

    expect(getFestividadesDestacadas(festividades)).toHaveLength(3);
    expect(getFestividadesDestacadas(festividades).map((item) => item.id)).toEqual([1, 2, 3]);
  });
});
