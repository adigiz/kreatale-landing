"use client";

import { useEffect } from "react";

const MATERIAL_ICON_URL =
  "https://fonts.googleapis.com/icon?family=Material+Icons";
const MATERIAL_SYMBOLS_URL =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";

function appendStylesheetOnce(id: string, href: string) {
  if (document.getElementById(id)) {
    return;
  }

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

export default function MaterialIconStyles() {
  useEffect(() => {
    appendStylesheetOnce("material-icons-font-css", MATERIAL_ICON_URL);
    appendStylesheetOnce("material-symbols-font-css", MATERIAL_SYMBOLS_URL);
  }, []);

  return null;
}
