import { Modal } from "@/components/Modal";
import ScreenshotGallery from "@/components/Screenshots/ScreenshotGallery";

interface ScreenshotsPageProps {
  onClose?: () => void;
}

/** Screenshots gallery page. */
export default function ScreenshotsPage({ onClose }: ScreenshotsPageProps) {
  return (
    <Modal width={320} height={341} onClose={onClose}>
      <ScreenshotGallery />
    </Modal>
  );
}
