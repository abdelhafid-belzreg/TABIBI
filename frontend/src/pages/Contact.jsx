import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const contactInfo = [
  { icon: Mail,   title: "Email",   value: "contact@tabibi.com",          color: "primary", href: "mailto:contact@tabibi.com"  },
  { icon: Phone,  title: "Phone",   value: "+212 7 7777 7777",            color: "success", href: "tel:+212777777777"           },
  { icon: MapPin, title: "Address", value: "Salé, Rabat-Salé-Kénitra, Maroc", color: "danger",  href: null                     },
  { icon: Clock,  title: "Hours",   value: "Mon-Fri: 8AM - 6PM",          color: "warning", href: null                         },
];

const faqs = [
  { q: "How do I book an appointment?",     a: "Search for a doctor, select an available time slot, and confirm your booking." },
  { q: "Can I cancel my appointment?",      a: "Yes, you can cancel or reschedule from your dashboard up to 2 hours before." },
  { q: "How do I join as a doctor?",        a: "Sign up as a doctor and our team will verify your credentials within 24-48 hours." },
  { q: "Is my data secure?",               a: "Absolutely. All data is encrypted and stored securely following industry standards." },
];

export default function Contact() {
  const [loading, setLoading]   = useState(false);
  const [openFaq, setOpenFaq]   = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Message Sent!", "We'll get back to you within 24 hours.");
      setLoading(false);
      e.target.reset();
    }, 1000);
  };

  return (
    <div className="bg-body">

      {/* ── Hero ── */}
      <section className="py-5">
        <div className="container text-center">
          <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1 mb-3">
            <MessageSquare size={13} /> Get in Touch
          </span>
          <h1 className="display-5 fw-bold mb-3">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="lead text-secondary mx-auto mb-0" style={{ maxWidth: 600 }}>
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* ── Contact Info Cards ── */}
      <section className="pb-4">
        <div className="container">
          <div className="row row-cols-2 row-cols-md-4 g-3">
            {contactInfo.map((info) => (
              <div className="col" key={info.title}>
                <div className="card border-0 shadow-sm bg-body-secondary text-center h-100 card-hover">
                  <div className="card-body py-4">
                    <div className={`rounded-circle bg-${info.color} bg-opacity-10 d-inline-flex p-3 mb-2`}>
                      <info.icon className={`text-${info.color}`} size={22} />
                    </div>
                    <div className="fw-semibold small mb-1">{info.title}</div>
                    {info.href
                      ? <a href={info.href} className={`text-${info.color} small text-decoration-none`}>{info.value}</a>
                      : <div className="text-secondary small">{info.value}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form + FAQ ── */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">

            {/* ── Contact Form ── */}
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-body-secondary py-3 d-flex align-items-center gap-2">
                  <Send size={15} className="text-secondary" />
                  <strong className="small text-uppercase text-secondary">Send us a Message</strong>
                </div>
                <div className="card-body p-4">
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3 mb-3">
                      <div className="col-sm-6">
                        <label htmlFor="name" className="form-label small fw-semibold">
                          Full Name
                        </label>
                        <input
                          id="name"
                          className="form-control"
                          placeholder="Hafid Blz"
                          required
                        />
                      </div>
                      <div className="col-sm-6">
                        <label htmlFor="email" className="form-label small fw-semibold">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          className="form-control"
                          placeholder="hafid@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="subject" className="form-label small fw-semibold">
                        Subject
                      </label>
                      <input
                        id="subject"
                        className="form-control"
                        placeholder="How can we help?"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="message" className="form-label small fw-semibold">
                        Message
                      </label>
                      <textarea
                        id="message"
                        className="form-control"
                        placeholder="Tell us more about your question..."
                        rows={5}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary d-flex align-items-center gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <><span className="spinner-border spinner-border-sm" /> Sending...</>
                      ) : (
                        <><Send size={15} /> Send Message</>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* ── FAQ ── */}
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-body-secondary py-3 d-flex align-items-center gap-2">
                  <MessageSquare size={15} className="text-secondary" />
                  <strong className="small text-uppercase text-secondary">Frequently Asked</strong>
                </div>
                <div className="card-body p-0">
                  <div className="accordion accordion-flush">
                    {faqs.map((faq, i) => (
                      <div className="accordion-item border-0 border-bottom" key={i}>
                        <h2 className="accordion-header">
                          <button
                            className={`accordion-button small fw-semibold py-3 ${openFaq !== i ? "collapsed" : ""}`}
                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          >
                            {faq.q}
                          </button>
                        </h2>
                        <div className={`accordion-collapse collapse ${openFaq === i ? "show" : ""}`}>
                          <div className="accordion-body py-2 text-secondary small">
                            {faq.a}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-5">
        <div className="container">
          <div className="card border-0 shadow-sm bg-primary text-white text-center p-5">
            <Mail size={36} className="mx-auto mb-3 opacity-75" />
            <h2 className="fw-bold mb-3">Still Have Questions?</h2>
            <p className="opacity-75 lead mb-4 mx-auto" style={{ maxWidth: 500 }}>
              Our support team is available Monday to Friday, 8AM to 6PM.
              We usually respond within a few hours.
            </p>
            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
              <a href="mailto:contact@tabibi.com" className="btn btn-light btn-lg fw-semibold d-inline-flex align-items-center gap-2 justify-content-center">
                Email Us <ArrowRight size={18} />
              </a>
              <a href="tel:+212777777777" className="btn btn-outline-light btn-lg">
                Call Us
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}