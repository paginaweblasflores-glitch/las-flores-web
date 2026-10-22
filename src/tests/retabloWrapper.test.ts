import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import RetabloWrapper from "../components/RetabloWrapper";

describe("RetabloWrapper", () => {
  it("removes the decorative interior background image", () => {
    const markup = renderToStaticMarkup(
      React.createElement(RetabloWrapper, null, React.createElement("p", null, "Contenido")),
    );

    expect(markup).not.toContain("/retablo/fondo.png");
    expect(markup).toContain("#fdf8f0");
  });

  it("stretches only the image width to fill the door panel", () => {
    const markup = renderToStaticMarkup(
      React.createElement(RetabloWrapper, null, React.createElement("p", null, "Contenido")),
    );
    const outerDoorFaces = markup.match(/<div class="door-face retablo-frame[^>]*>/g) ?? [];
    const doorImages = markup.match(/<img src="\/retablo\/puerta\.png"[^>]+>/g) ?? [];

    expect(outerDoorFaces).toHaveLength(2);
    expect(
      outerDoorFaces.every((face) =>
        face.includes("background-image:url(&#x27;/retablo/entrada.png&#x27;)"),
      ),
    ).toBe(true);
    expect(outerDoorFaces.every((face) => face.includes("background-size:200% 100%"))).toBe(true);
    expect(outerDoorFaces.some((face) => face.includes("background-position:left center"))).toBe(
      true,
    );
    expect(outerDoorFaces.some((face) => face.includes("background-position:right center"))).toBe(
      true,
    );
    expect(markup.match(/class="door-inner/g)).toHaveLength(2);
    expect(doorImages).toHaveLength(2);
    expect(doorImages.every((image) => image.includes("h-full w-auto max-w-none"))).toBe(true);
    expect(doorImages.every((image) => !image.includes("object-contain"))).toBe(true);
    expect(
      doorImages.every((image) =>
        image.includes("scaleX(max(1, calc(100cqw / (100cqh * 208 / 489))))"),
      ),
    ).toBe(true);
    expect(markup.match(/container-type:size/g)).toHaveLength(2);
  });

  it("avoids inset shadows on the touching edges of the outer doors", () => {
    const markup = renderToStaticMarkup(
      React.createElement(RetabloWrapper, null, React.createElement("p", null, "Contenido")),
    );
    const outerDoorFaces = markup.match(/<div class="door-face retablo-frame[^>]*>/g) ?? [];

    expect(outerDoorFaces).toHaveLength(2);
    expect(outerDoorFaces.every((face) => !face.includes("inset 0 0 30px rgba(0,0,0,0.85)"))).toBe(
      true,
    );
    expect(outerDoorFaces[0]).toContain("inset 8px 0 18px -12px");
    expect(outerDoorFaces[1]).toContain("inset -8px 0 18px -12px");
  });

  it("uses a viewport-responsive desktop height and a capped desktop width", () => {
    const markup = renderToStaticMarkup(
      React.createElement(RetabloWrapper, null, React.createElement("p", null, "Contenido")),
    );
    const wrapper = markup.match(/<div class="[^"]*mx-auto[^"]*"[^>]*>/)?.[0] ?? "";

    expect(wrapper).toContain("lg:w-[calc(50vw_-_40px)]");
    expect(wrapper).toContain("lg:max-w-[900px]");
    expect(wrapper).toContain("min-h-[700px]");
    expect(wrapper).not.toContain("lg:min-h-[900px]");
    expect(wrapper).toMatch(
      /(?:\bmin-h-screen\b|\bmin-h-(?:dvh|svh|lvh)\b|\b(?:min-)?h-\[[^\]]*(?:dvh|svh|lvh|vh)[^\]]*\]|min-height:[^;]*(?:dvh|svh|lvh|vh))/i,
    );
  });

  it("preserves the original door perspective and full opening bounds", () => {
    const markup = renderToStaticMarkup(
      React.createElement(RetabloWrapper, null, React.createElement("p", null, "Contenido")),
    );
    const doorPanels = markup.match(/class="door-(?:left|right)[^"]*"/g) ?? [];

    expect(markup).toContain("perspective:1400px");
    expect(markup).toContain("perspective-origin:50% 40%");
    expect(markup).toContain('class="relative h-full flex flex-col overflow-visible"');
    expect(doorPanels).toHaveLength(2);
    expect(doorPanels.every((panel) => panel.includes("top-0 bottom-0"))).toBe(true);
  });

  it("uses a cochineal-red wood frame", () => {
    const markup = renderToStaticMarkup(
      React.createElement(RetabloWrapper, null, React.createElement("p", null, "Contenido")),
    );

    expect(markup).toContain("background-color: #8f1d35;");
  });
});
