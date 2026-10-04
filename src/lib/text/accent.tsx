import React from "react";

const MARKER = /\[\[([^\[\]]+)\]\]/g;

export function renderAccent(text: string, accentClass: string): React.ReactNode {
  if (!text.includes("[[")) return text;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  MARKER.lastIndex = 0;
  while ((match = MARKER.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    nodes.push(
      <span key={key++} className={accentClass}>
        {match[1]}
      </span>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

type AccentTextProps = {
  text: string;
  className?: string;
  accentClassName?: string;
  as?: React.ElementType;
};

export function AccentText({
  text,
  className,
  accentClassName = "italic font-serif text-secondary",
  as: Tag = "span",
}: AccentTextProps) {
  return <Tag className={className}>{renderAccent(text, accentClassName)}</Tag>;
}
