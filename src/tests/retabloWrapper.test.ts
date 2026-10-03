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
    const doorImages = markup.match(/<img src="\/retablo\/puerta\.png"[^>]+>/g) ?? [];

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

  it("uses a desktop width that caps the retablo while fitting its open doors", () => {
    const markup = renderToStaticMarkup(
      React.createElement(RetabloWrapper, null, React.createElement("p", null, "Contenido")),
    );

    expect(markup).toContain("lg:w-[calc(50vw_-_40px)]");
    expect(markup).toContain("lg:max-w-[900px]");
  });

  it("uses a cochineal-red wood frame", () => {
    const markup = renderToStaticMarkup(
      React.createElement(RetabloWrapper, null, React.createElement("p", null, "Contenido")),
    );

    expect(markup).toContain("background-color: #8f1d35;");
  });
});
