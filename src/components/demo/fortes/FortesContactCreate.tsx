"use client";

import type { FormEvent } from "react";
import { toast } from "sonner";

import { FORTES_CONTACT_TITLE_SPLIT } from "./fortes-data";
import { FortesSplitText } from "./FortesSplitText";

export function FortesContactCreate() {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Thanks — this is a static demo (no data sent).");
  };

  return (
    <section className="contact-create" id="contact" aria-labelledby="fortes-contact-create-title">
      <div className="contact-create__container">
        <div className="contact-create__wrapper">
          <h2
            id="fortes-contact-create-title"
            className="contact-create__title split-anim-title"
            data-aos="text-anim"
          >
            <FortesSplitText text={FORTES_CONTACT_TITLE_SPLIT} />
          </h2>
          <form className="contact-create__form" onSubmit={onSubmit}>
            <input
              type="text"
              required
              name="name"
              placeholder="Name"
              data-aos="show-contact"
              data-aos-delay="100"
              autoComplete="name"
            />
            <input
              type="email"
              required
              name="email"
              placeholder="Email"
              data-aos="show-contact"
              data-aos-delay="200"
              autoComplete="email"
            />
            <input
              type="tel"
              required
              name="phone"
              placeholder="Your contact phone number"
              data-aos="show-contact"
              data-aos-delay="300"
              autoComplete="tel"
            />
            <textarea
              name="msg"
              required
              placeholder="Message"
              data-aos="show-contact"
              data-aos-delay="400"
            />
            <button type="submit" className="submit_btn">
              Send
            </button>
            <div className="contact-create__note-text">
              *By providing your email address, <span>you agree to our privacy policy.</span>
              <div />
              *We do not forward your contact data to 3rd parties
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
