import React from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import RetabloWrapper from "../components/RetabloWrapper";

const wrapperSource = readFileSync(
  resolve(process.cwd(), "src/components/RetabloWrapper.tsx"),
  "utf8",
);
const viewportHeightRule =
  /\b(?:min-h|h)-(?:screen|dvh|svh|lvh)\b|\b(?:min-)?h-\[[^\]]*(?:dvh|svh|lvh|vh)[^\]]*\]|min-height:[^;]*(?:dvh|svh|lvh|vh)/i;

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

  it("fits the retablo height to the viewport below the sticky header", () => {
    const markup = renderToStaticMarkup(
      React.createElement(RetabloWrapper, null, React.createElement("p", null, "Contenido")),
    );
    const wrapper = markup.match(/<div class="[^"]*mx-auto[^"]*"[^>]*>/)?.[0] ?? "";

    expect(wrapper).toContain("lg:w-[calc(50vw_-_40px)]");
    expect(wrapper).toContain("lg:max-w-[900px]");
    expect(wrapper).toContain("lg:mt-0");
    expect(wrapper).toContain("lg:min-h-[min(700px,calc(100dvh_-_10rem))]");
    expect(wrapper).toContain("lg:h-[min(900px,calc(100dvh_-_10rem))]");
    expect(wrapper).not.toContain("lg:min-h-[900px]");
    expect(wrapper).toMatch(viewportHeightRule);
  });

  it("extends the retablo frame to the mobile viewport edges", () => {
    const markup = renderToStaticMarkup(
      React.createElement(RetabloWrapper, null, React.createElement("p", null, "Contenido")),
    );
    const wrapper = markup.match(/<div class="[^"]*retablo-wrapper[^"]*"[^>]*>/)?.[0] ?? "";

    expect(wrapper).toContain("w-screen");
    expect(wrapper).toContain("max-w-none");
    expect(wrapper).toContain("lg:w-[calc(50vw_-_40px)]");
    expect(wrapper).toContain("lg:max-w-[900px]");
    expect(wrapper).not.toContain("w-[90vw]");
  });

  it("does not reserve an empty lower frame area on mobile", () => {
    const markup = renderToStaticMarkup(
      React.createElement(RetabloWrapper, null, React.createElement("p", null, "Contenido")),
    );
    const wrapper = markup.match(/<div class="[^"]*retablo-wrapper[^"]*"[^>]*>/)?.[0] ?? "";

    expect(wrapper).not.toContain("min-h-[700px]");
    expect(wrapper).toContain("lg:min-h-[min(700px,calc(100dvh_-_10rem))]");
  });

  it("removes mobile gaps beneath the pediment and along the inner frame", () => {
    const markup = renderToStaticMarkup(
      React.createElement(RetabloWrapper, null, React.createElement("p", null, "Contenido")),
    );
    const contentLayer = markup.match(/<div class="relative z-10 min-h-0[^"]*"[^>]*>/)?.[0] ?? "";
    const interior = markup.match(/<div class="retablo-interior[^"]*">/)?.[0] ?? "";

    expect(contentLayer).not.toContain("pt-16");
    expect(contentLayer).toContain("lg:pt-24");
    expect(interior).not.toContain("mx-[10px]");
    expect(interior).not.toContain("mb-[10px]");
    expect(interior).toContain("lg:mx-[14px]");
    expect(interior).toContain("lg:mb-[14px]");
  });

  it.each(["h-screen", "h-dvh"])("accepts equivalent viewport height class %s", (heightClass) => {
    expect(viewportHeightRule.test(heightClass)).toBe(true);
  });

  it("preserves the original door perspective and full opening bounds", () => {
    const markup = renderToStaticMarkup(
      React.createElement(RetabloWrapper, null, React.createElement("p", null, "Contenido")),
    );
    const doorPanels = markup.match(/class="door-(?:left|right)[^"]*"/g) ?? [];

    expect(markup).toContain("perspective:1400px");
    expect(markup).toContain("perspective-origin:50% 40%");
    expect(markup).toContain("min-h-0 lg:pt-24");
    expect(markup).toContain('class="relative h-full flex flex-col overflow-visible"');
    expect(doorPanels).toHaveLength(2);
    expect(doorPanels.every((panel) => panel.includes("top-0 bottom-0"))).toBe(true);
  });

  it("preserves the automatic door opening animation", () => {
    expect(wrapperSource).toContain("const doorAngle = isOpen ? 120 : 0;");
    expect(wrapperSource).toContain("transform: `rotateY(-${doorAngle}deg)`");
    expect(wrapperSource).toContain("transform: `rotateY(${doorAngle}deg)`");
  });

  it("opens automatically without adding callbacks to the door transitions", () => {
    expect(wrapperSource).not.toContain("onDoorsOpened");
    expect(wrapperSource).not.toContain("handleDoorTransitionEnd");
    expect(wrapperSource).toContain("threshold: 0.65");
  });

  it("uses a cochineal-red wood frame", () => {
    const markup = renderToStaticMarkup(
      React.createElement(RetabloWrapper, null, React.createElement("p", null, "Contenido")),
    );

    expect(markup).toContain("background-color: #8f1d35;");
  });
});
