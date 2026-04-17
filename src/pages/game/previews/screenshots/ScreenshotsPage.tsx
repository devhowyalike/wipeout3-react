import { useRef } from "react";
import { Modal } from "@/components/Modal";
import ScreenshotGallery from "@/components/Screenshots/ScreenshotGallery";

interface ScreenshotsPageProps {
  onClose?: () => void;
}

const HEADING_ID = "screenshots-dialog-heading";

/** Screenshots gallery page. */
export default function ScreenshotsPage({ onClose }: ScreenshotsPageProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  return (
    <Modal
      width={320}
      height={341}
      onClose={onClose}
      labelledBy={HEADING_ID}
      initialFocusRef={headingRef}
    >
      <h2 ref={headingRef} id={HEADING_ID} className="sr-only">
        Screenshots
      </h2>
      <ScreenshotGallery />
    </Modal>
  );
}
