import { useState, FormEvent } from "react";
import { Modal } from "@/components/Modal";
import { Headline } from "@/components/Typography/Headline";
import { WEB3FORMS_ACCESS_KEY } from "@/config/constants";

type FormStatus = "idle" | "submitting" | "success" | "error";

/** Contact form modal content. */
export default function ContactForm({ onClose }: { onClose?: () => void }) {
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("access_key", WEB3FORMS_ACCESS_KEY);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <Modal modalWidth={480} width={480} height={400} onClose={onClose} label="Contact" initialFocus="first-control">
      <div className="p-6">
        {status === "success" ? (
          <Headline level={1} variant="xl" className="mb-6">
            <span className="text-white">Thankyou.</span>{" "}
            <span className="block">Message sent.</span>
          </Headline>
        ) : (
          <>
            <Headline level={1} variant="xl" className="mb-6 subpixel-fix">
              Contact
            </Headline>
            <form onSubmit={handleSubmit} autoComplete="off">
              {/* Web3Forms honeypot for spam prevention */}
              <input
                type="checkbox"
                name="botcheck"
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  name="name"
                  placeholder="NAME"
                  required
                  className="text-base rounded-none appearance-none w-full bg-white px-1"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="E-MAIL"
                  required
                  className="text-base rounded-none appearance-none w-full bg-white px-1"
                />
                <textarea
                  name="message"
                  placeholder="MESSAGE THE MAINTAINER. REACT EDITION. NOT PSYGNOSIS. NOT THE DESIGNERS REPUBLIC. NOT KLEBER."
                  required
                  rows={4}
                  className="text-base rounded-none appearance-none w-full bg-white resize-none px-1"
                />
              </div>
              {status === "error" && (
                <p className="text-white text-sm mt-2 uppercase">
                  Something went wrong. Please try again.
                </p>
              )}
              <button
                type="submit"
                disabled={status === "submitting"}
                className="block text-white font-wipeout3 text-w3-fluid-xl mt-2 disabled:opacity-50"
              >
                {status === "submitting" ? "Sending..." : "Send"}
              </button>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
}
