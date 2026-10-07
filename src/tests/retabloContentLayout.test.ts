import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as ts from "typescript";
import { describe, expect, it } from "vitest";

const routeSource = readFileSync(resolve(process.cwd(), "src/routes/index.tsx"), "utf8");
const wrapperSource = readFileSync(resolve(process.cwd(), "src/components/RetabloWrapper.tsx"), "utf8");
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
  return ts.isIdentifier(element.openingElement.tagName)
    ? element.openingElement.tagName.text
    : "";
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
  it("adds enough desktop bottom space for the open doors to remain visible", () => {
    const section = jsxDescendants(routeAst).find(
      (element) =>
        tagName(element) === "section" && element.getText().includes("<RetabloWrapper"),
    );

    expect(section).toBeDefined();
    if (!section) throw new Error("Retablo section not found");
    expect(attribute(section, "className")).toContain("lg:pb-40");
  });

  it("allows the panel content to fill the central panel", () => {
    expect(wrapperSource).toContain(
      'className="relative z-10 flex flex-1 h-full flex-col justify-center"',
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

  it("places the full narrative above an enlarged photo and keeps actions at the bottom", () => {
    const wrapper = findRetabloWrapper(routeAst);
    expect(wrapper).toBeDefined();
    if (!wrapper) throw new Error("RetabloWrapper not found in home route");

    const [shell] = jsxChildren(wrapper);
    expect(shell).toBeDefined();
    if (!shell) throw new Error("RetabloWrapper content shell not found");

    const [contentRow, actionRow] = jsxChildren(shell);
    expect(jsxChildren(shell)).toHaveLength(2);
    expect(contentRow).toBeDefined();
    expect(actionRow).toBeDefined();
    if (!contentRow || !actionRow) throw new Error("Expected content and action rows");

    const contentClasses = attribute(contentRow, "className") ?? "";
    const actionClasses = attribute(actionRow, "className") ?? "";
    const contentElements = jsxDescendants(contentRow);
    const actionElements = jsxDescendants(actionRow);

    expect(contentClasses).toContain("flex-col");
    expect(contentRow.getText()).toContain("src={retabloImg}");
    const heading = contentElements.find((element) => tagName(element) === "h2");
    const paragraph = contentElements.find((element) => tagName(element) === "p");
    expect(heading).toBeDefined();
    expect(paragraph).toBeDefined();
    if (!heading || !paragraph) throw new Error("Expected narrative elements");
    const imagePosition = routeSource.indexOf("src={retabloImg}", contentRow.pos);
    expect(paragraph.end).toBeLessThan(imagePosition);
    expect(contentRow.getText()).toContain("max-w-[240px]");
    expect(contentRow.getText()).toContain("lg:max-w-[320px]");
    expect(contentElements.filter((element) => tagName(element) === "a")).toHaveLength(0);
    expect(actionClasses).toContain("mt-auto");
    expect(actionClasses).toContain("pt-4");
    expect(actionClasses).toContain("justify-center");
    expect(
      actionElements
        .filter((element) => tagName(element) === "a")
        .map((element) => attribute(element, "href"))
        .sort(),
    ).toEqual(["/carta", "/restaurante"]);
  });
});
