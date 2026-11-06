import React, { useState } from "react";
import { copy } from "../../content/copy.id.js";
import { Button } from "../ui/Button.js";

interface ExportCsvButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export function ExportCsvButton({ onClick, disabled }: ExportCsvButtonProps) {
  const [announcement, setAnnouncement] = useState("");

  const handleClick = () => {
    onClick();
    setAnnouncement("");
    window.setTimeout(() => setAnnouncement(copy.exportCsv.downloaded), 0);
  };

  return (
    <div>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={handleClick}
        disabled={disabled}
        className="min-h-11 min-w-11"
      >
        {copy.exportCsv.button}
      </Button>
      <span aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </div>
  );
}
