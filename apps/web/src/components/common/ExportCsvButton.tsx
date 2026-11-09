import React, { useState } from "react";
import { Download } from "lucide-react";
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
        onClick={handleClick}
        disabled={disabled}
        className="gap-2"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        {copy.exportCsv.button}
      </Button>
      <span aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </div>
  );
}
