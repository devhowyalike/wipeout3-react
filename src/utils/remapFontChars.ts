import { isValidElement, cloneElement, Children } from "react";
import type { ReactNode } from "react";

/**
 * Replaces every "l" / "L" in a string with the WipEout 3 custom glyph \uE041.
 * The font stores a stylised "l" in the Private Use Area at U+E041.
 * Components using font-wipeout3 apply `lowercase` via CSS so both cases need substituting.
 * 
 * This is not consistently applied across the original Flash website, where different pages and menus
 * use different approaches to handling "l" / "L".
 *
 * This function is used to ensure that "l" / "L" is consistently remapped to
 * the WipEout 3 custom glyph, but it is opt-in.
 *
 * @param label - The input string to transform.
 * @param enabled - When `false`, returns `label` unchanged.
 */
export function remapL(label: string, enabled: boolean): string {
  if (!enabled) return label;
  return label.replace(/[lL]/g, "\uE041");
}

/**
 * Walks a ReactNode tree and applies remapL to every string node.
 * Use this in components like Headline that accept arbitrary children
 * but render them with font-wipeout3.
 *
 * @param node - The React node tree to traverse.
 * @param enabled - When `false`, returns `node` unchanged.
 */
export function remapLNode(node: ReactNode, enabled: boolean): ReactNode {
  if (typeof node === "string") return remapL(node, enabled);
  if (isValidElement(node)) {
    const mapped = Children.map(
      (node as React.ReactElement<{ children?: ReactNode }>).props.children,
      (child) => remapLNode(child, enabled),
    );
    return cloneElement(node as React.ReactElement<{ children?: ReactNode }>, {}, mapped);
  }
  if (Array.isArray(node)) {
    return Children.map(node, (child) => remapLNode(child, enabled));
  }
  return node;
}
