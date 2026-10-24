import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as ts from "typescript";
import { describe, expect, it } from "vitest";

const routeSource = readFileSync(resolve(process.cwd(), "src/routes/index.tsx"), "utf8");
const wrapperSource = readFileSync(
  resolve(process.cwd(), "src/components/RetabloWrapper.tsx"),
  "utf8",
);
const hasExcessiveFixedVerticalPadding = (classes: string) => {
  const spacingClasses = [...classes.matchAll(/(?:^|\s)lg:(?:p|py|pt|pb)-([^\s]+)/g)].map(
    ([, spacing]) => spacing,
  );

  return spacingClasses.some((spacing) => {
    if (/(?:dvh|svh|lvh|vh)/i.test(spacing)) return false;
    if (spacing === "px") return false;

    const value = spacing.match(/^(?:\[([^\]]+)\]|(\d+(?:\.\d+)?))$/);
    if (!value) return true;

    const [, arbitraryValue, spacingScale] = value;
    if (spacingScale) return Number(spacingScale) > 8;

    const length = arbitraryValue.match(/^(\d+(?:\.\d+)?)(px|rem|mm|cm)$/);
    if (!length) return true;

    const [, amount, unit] = length;
    if (unit === "px") return Number(amount) > 32;
    if (unit === "mm") return Number(amount) > 2;
    if (unit === "cm") return Number(amount) > 2.3;
    return Number(amount) > 2;
  });
};
const routeAst = ts.createSourceFile(
  "index.tsx",
  routeSource,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);

function jsxChildren(element: ts.JsxElement): ts.JsxElement[] {
  return element.children.filter(ts.isJsxElement);
}

function jsxDescendants(node: ts.Node): ts.JsxElement[] {
  const result: ts.JsxElement[] = [];
  const visit = (child: ts.Node) => {
    if (ts.isJsxElement(child)) result.push(child);
    ts.forEachChild(child, visit);
  };
  visit(node);
  return result;
}

function tagName(element: ts.JsxElement): string {
  return ts.isIdentifier(element.openingElement.tagName) ? element.openingElement.tagName.text : "";
}

function attribute(element: ts.JsxElement, name: string): string | undefined {
  const property = element.openingElement.attributes.properties.find(
    (item): item is ts.JsxAttribute =>
      ts.isJsxAttribute(item) && ts.isIdentifier(item.name) && item.name.text === name,
  );
  return property && property.initializer && ts.isStringLiteral(property.initializer)
    ? property.initializer.text
    : undefined;
}

function findRetabloWrapper(node: ts.Node): ts.JsxElement | undefined {
  if (ts.isJsxElement(node) && tagName(node) === "RetabloWrapper") return node;
  let found: ts.JsxElement | undefined;
  ts.forEachChild(node, (child) => {
    found ??= findRetabloWrapper(child);
  });
  return found;
}

describe("home retablo content layout", () => {
  it("does not render action buttons beneath the retablo", () => {
    const actionRows = jsxDescendants(routeAst).filter((element) =>
      (attribute(element, "className") ?? "").includes("retablo-actions"),
    );

    expect(actionRows).toHaveLength(0);
    expect(routeSource).not.toContain('href="/carta"');
  });

  it("budgets the open-door frame below the fixed header on shorter desktops", () => {
    expect(routeSource).toContain("flex flex-col justify-center items-center");
    expect(routeSource).toContain("lg:pt-[2.3cm]");
    expect(routeSource).toContain("height: min(900px, calc(100dvh - 10rem), 80dvh)");
    expect(routeSource).toContain("height: min(900px, 74dvh)");
  });

  it("leaves only a 2.3cm gap above the retablo within its section", () => {
    const section = jsxDescendants(routeAst).find(
      (element) => tagName(element) === "section" && element.getText().includes("<RetabloWrapper"),
    );
    const sectionClasses = section ? (attribute(section, "className") ?? "") : "";

    expect(sectionClasses).toContain("lg:pt-[2.3cm]");
    expect(wrapperSource).toContain("lg:mt-0");
  });

  it("removes mobile section padding so the retablo reaches the viewport edges", () => {
    const section = jsxDescendants(routeAst).find(
      (element) => tagName(element) === "section" && element.getText().includes("<RetabloWrapper"),
    );

    expect(section).toBeDefined();
    if (!section) throw new Error("Retablo section not found");

    expect(attribute(section, "className")).toContain("relative py-0");
  });

  it("removes the mobile top padding from the section immediately after the retablo", () => {
    const section = jsxDescendants(routeAst).find(
      (element) =>
        tagName(element) === "section" && attribute(element, "id") === "lugares-para-visitar",
    );

    expect(section).toBeDefined();
    if (!section) throw new Error("Places section not found");

    const sectionClasses = attribute(section, "className") ?? "";
    expect(sectionClasses).toContain("pt-0");
    expect(sectionClasses).toContain("pb-16");
    expect(sectionClasses).toContain("md:py-32");
  });

  it("uses viewport-responsive desktop bottom spacing for the open doors", () => {
    const section = jsxDescendants(routeAst).find(
      (element) => tagName(element) === "section" && element.getText().includes("<RetabloWrapper"),
    );

    expect(section).toBeDefined();
    if (!section) throw new Error("Retablo section not found");
    const sectionClasses = attribute(section, "className") ?? "";
    const desktopVerticalPaddingClasses =
      sectionClasses.match(/(?:^|\s)lg:(?:p|py|pt|pb)-[^\s]+/g) ?? [];

    expect(hasExcessiveFixedVerticalPadding(sectionClasses)).toBe(false);
    expect(
      desktopVerticalPaddingClasses.some((classes) => /(?:dvh|svh|lvh|vh)/i.test(classes)),
    ).toBe(true);
  });

  it("adds 4rem below the retablo doors on desktop", () => {
    const section = jsxDescendants(routeAst).find(
      (element) => tagName(element) === "section" && element.getText().includes("<RetabloWrapper"),
    );

    expect(section).toBeDefined();
    if (!section) throw new Error("Retablo section not found");

    expect(attribute(section, "className")).toContain("lg:pb-[calc(min(2.5rem,3dvh)_+_4rem)]");
  });

  it("removes the eyebrow without shifting the title out of the panel", () => {
    const wrapper = findRetabloWrapper(routeAst);
    expect(wrapper).toBeDefined();
    if (!wrapper) throw new Error("RetabloWrapper not found in home route");

    const [shell] = jsxChildren(wrapper);
    expect(shell).toBeDefined();
    if (!shell) throw new Error("Retablo content shell not found");

    const [contentStack] = jsxChildren(shell);
    expect(contentStack).toBeDefined();
    if (!contentStack) throw new Error("Retablo content stack not found");

    const narrative = jsxDescendants(contentStack).find((element) =>
      (attribute(element, "className") ?? "").includes("retablo-content-narrative"),
    );
    expect(narrative).toBeDefined();
    if (!narrative) throw new Error("Retablo narrative not found");

    const narrativeClasses = attribute(narrative, "className") ?? "";
    expect(narrativeClasses).not.toMatch(/(?:^|\s)-translate-y-/);
    expect(narrative.getText()).not.toContain("Cultura y Tradición");
  });

  it("rejects excessive fixed desktop padding even alongside viewport padding", () => {
    expect(hasExcessiveFixedVerticalPadding("lg:pb-[10vh] lg:pb-48")).toBe(true);
    expect(hasExcessiveFixedVerticalPadding("lg:py-40 lg:pb-[10vh]")).toBe(true);
    expect(hasExcessiveFixedVerticalPadding("lg:p-40 lg:pb-[10vh]")).toBe(true);
    expect(hasExcessiveFixedVerticalPadding("lg:pt-6 lg:pb-[10vh]")).toBe(false);
    expect(hasExcessiveFixedVerticalPadding("lg:py-px lg:pb-[10vh]")).toBe(false);
  });

  it("allows the panel content to fill the central panel", () => {
    expect(wrapperSource).toContain(
      'className="relative z-10 min-h-0 flex flex-1 h-full flex-col justify-center"',
    );
  });

  it("centers the ornamental flower and extends its lines across the title width", () => {
    const wrapper = findRetabloWrapper(routeAst);
    expect(wrapper).toBeDefined();
    if (!wrapper) throw new Error("RetabloWrapper not found in home route");

    const divider = jsxDescendants(wrapper).find(
      (element) =>
        tagName(element) === "div" &&
        (attribute(element, "className") ?? "").includes("gap-2") &&
        element.getText().includes("<AyacuchoFlowerInline"),
    );
    expect(divider).toBeDefined();
    if (!divider) throw new Error("Ornamental divider not found");

    const dividerClasses = attribute(divider, "className") ?? "";
    const lineClasses = [...divider.getText().matchAll(/<span className="([^"]+)"/g)].map(
      ([, classes]) => classes ?? "",
    );

    expect(dividerClasses).toContain("w-full");
    expect(dividerClasses).toContain("justify-center");
    expect(dividerClasses).not.toContain("lg:justify-start");
    expect(lineClasses).toHaveLength(2);
    expect(lineClasses.every((classes) => classes.includes("flex-1"))).toBe(true);
  });

  it("keeps the enlarged photo inside the retablo", () => {
    const wrapper = findRetabloWrapper(routeAst);
    expect(wrapper).toBeDefined();
    if (!wrapper) throw new Error("RetabloWrapper not found in home route");

    const [shell] = jsxChildren(wrapper);
    expect(shell).toBeDefined();
    if (!shell) throw new Error("RetabloWrapper content shell not found");

    const [contentRow] = jsxChildren(shell);
    expect(contentRow).toBeDefined();
    if (!contentRow) throw new Error("Retablo content row not found");

    const contentClasses = attribute(contentRow, "className") ?? "";
    const contentElements = jsxDescendants(contentRow);

    expect(contentClasses).toContain("flex-col");
    expect(contentRow.getText()).toContain("src={retabloImg}");
    const heading = contentElements.find((element) => tagName(element) === "h2");
    const paragraph = contentElements.find((element) => tagName(element) === "p");
    expect(heading).toBeDefined();
    expect(paragraph).toBeDefined();
    if (!heading || !paragraph) throw new Error("Expected narrative elements");
    const imagePosition = routeSource.indexOf("src={retabloImg}", contentRow.pos);
    expect(paragraph.end).toBeLessThan(imagePosition);
    expect(routeSource).toContain("width: calc(100% - min(6cm, 4vw))");
    expect(routeSource).toContain("max-width: 340px");
    const imageContainer = contentElements.find((element) =>
      (attribute(element, "className") ?? "").includes("retablo-content-image"),
    );
    expect(imageContainer).toBeDefined();
    if (!imageContainer) throw new Error("Retablo image container not found");
    expect(attribute(imageContainer, "className")).toContain("mb-8");
    expect(contentRow.getText()).toContain(
      'className="relative aspect-[4/3] -translate-y-[3mm] border-x-[6px] border-t-[6px] border-b-[10px] border-[#8f1d35] p-[3px] shadow-md"',
    );
    expect(contentRow.getText()).toContain(
      'className="relative h-full w-full overflow-hidden border border-[#d4a373]"',
    );
    expect(contentRow.getText()).not.toContain("linear-gradient(135deg, #5D2E0C");
    expect(contentRow.getText()).toContain(
      'className="absolute inset-0 z-10 w-full max-w-none aspect-[4/3] object-cover"',
    );
  });

  it("keeps the image responsive without viewport-height width caps", () => {
    expect(routeSource).toContain("max-width: 340px");
    expect(routeSource).not.toContain("max-width: min(320px, 20dvh)");
    expect(routeSource).not.toContain("max-width: min(320px, 18dvh)");
    expect(routeSource).not.toContain("max-width: min(320px, 22dvh)");
    expect(routeSource).not.toContain("max-width: min(240px, 16dvh)");
    expect(routeSource).not.toContain("45.36px");
    expect(wrapperSource).toContain("w-screen");
    expect(routeSource).not.toContain("onDoorsOpened");
  });
});
