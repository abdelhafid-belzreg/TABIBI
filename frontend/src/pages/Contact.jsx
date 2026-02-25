import { useState, useEffect, useRef } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, ArrowRight } from "lucide-react";
import api from "@/lib/api";

const contactInfo = [
  { icon: Mail,   title: "Email",   value: "noreply.tabibi@gmail.com",        color: "primary", href: "mailto:noreply.tabibi@gmail.com" },
  { icon: Phone,  title: "Phone",   value: "+212 7 6786 4261",                color: "success", href: "tel:+21276864261"                },
  { icon: MapPin, title: "Address", value: "Salé, Rabat-Salé-Kénitra, Maroc", color: "danger",  href: null                             },
  { icon: Clock,  title: "Hours",   value: "Mon-Fri: 8AM - 6PM",              color: "warning", href: null                             },
];

const faqs = [
  { q: "How do I book an appointment?", a: "Search for a doctor, select an available time slot, and confirm your booking."         },
  { q: "Can I cancel my appointment?",  a: "Yes, you can cancel or reschedule from your dashboard up to 2 hours before."           },
  { q: "How do I join as a doctor?",    a: "Sign up as a doctor and our team will verify your credentials within 24-48 hours."     },
  { q: "Is my data secure?",           a: "Absolutely. All data is encrypted and stored securely following industry standards."    },
];

const initialForm = { name: "", email: "", subject: "", message: "" };

// ── Scroll-triggered fade-in hook ────────────────────────
function useFadeIn(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

// ── FadeIn wrapper ────────────────────────────────────────
function FadeIn({ children, delay = 0, direction = "up", className = "" }) {
  const [ref, visible] = useFadeIn();

  const translate = direction === "up"    ? "translateY(40px)"
                  : direction === "down"  ? "translateY(-40px)"
                  : direction === "left"  ? "translateX(40px)"
                  : direction === "right" ? "translateX(-40px)"
                  : "translateY(40px)";

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? "translate(0)" : translate,
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────
export default function Contact() {
  const [form,    setForm]    = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors,  setErrors]  = useState({});
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess(false);

    try {
      await api.post("/contact", form);
      setSuccess(true);
      setForm(initialForm);
    } catch (err) {
      if (err.response?.status === 422) {
        const laravelErrors = err.response.data.errors;
        const mapped = {};
        Object.keys(laravelErrors).forEach((key) => {
          mapped[key] = laravelErrors[key][0];
        });
        setErrors(mapped);
      } else {
        setErrors({ general: "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-body">

      {/* Hero */}
      <section className="py-5">
        <div className="container text-center">

          <FadeIn delay={0}>
            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1 mb-3">
              <MessageSquare size={13} /> Get in Touch
            </span>
          </FadeIn>

          <FadeIn delay={100}>
            <h1 className="display-5 fw-bold mb-3">
              Contact <span className="text-primary">Us</span>
            </h1>
          </FadeIn>

          <FadeIn delay={200}>
            <p className="lead text-secondary mx-auto mb-0" style={{ maxWidth: 600 }}>
              Have questions? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
            </p>
          </FadeIn>

        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="pb-4">
        <div className="container">
          <div className="row row-cols-2 row-cols-md-4 g-3">
            {contactInfo.map((info, i) => (
              <div className="col" key={info.title}>
                <FadeIn delay={i * 100} direction="up">
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
                </FadeIn>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + FAQ */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">

            {/* Contact Form */}
            <div className="col-lg-7">
              <FadeIn direction="right">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-body-secondary py-3 d-flex align-items-center gap-2">
                    <Send size={15} className="text-secondary" />
                    <strong className="small text-uppercase text-secondary">Send us a Message</strong>
                  </div>
                  <div className="card-body p-4">

                    {success && (
                      <div className="alert alert-success d-flex align-items-center gap-2 mb-4">
                        <Mail size={16} />
                        <span>Message sent! We'll get back to you within 24 hours.</span>
                      </div>
                    )}

                    {errors.general && (
                      <div className="alert alert-danger py-2 small mb-3">{errors.general}</div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                      <div className="row g-3 mb-3">
                        <div className="col-sm-6">
                          <label htmlFor="name" className="form-label small fw-semibold">Full Name</label>
                          <input
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className={`form-control ${errors.name ? "is-invalid" : ""}`}
                            placeholder="John Doe"
                            required
                          />
                          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>
                        <div className="col-sm-6">
                          <label htmlFor="email" className="form-label small fw-semibold">Email</label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                            placeholder="example@example.com"
                            required
                          />
                          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="subject" className="form-label small fw-semibold">Subject</label>
                        <input
                          id="subject"
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          className={`form-control ${errors.subject ? "is-invalid" : ""}`}
                          placeholder="How can we help?"
                          required
                        />
                        {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="message" className="form-label small fw-semibold">Message</label>
                        <textarea
                          id="message"
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          className={`form-control ${errors.message ? "is-invalid" : ""}`}
                          placeholder="Tell us more about your question..."
                          rows={5}
                          required
                        />
                        {errors.message && <div className="invalid-feedback">{errors.message}</div>}
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
              </FadeIn>
            </div>

            {/* FAQ */}
            <div className="col-lg-5">
              <FadeIn direction="left" delay={100}>
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
              </FadeIn>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5">
        <div className="container">
          <FadeIn direction="up">
            <div className="card border-0 shadow-sm bg-primary text-white text-center p-5">
              <Mail size={36} className="mx-auto mb-3 opacity-75" />
              <h2 className="fw-bold mb-3">Still Have Questions?</h2>
              <p className="opacity-75 lead mb-4 mx-auto" style={{ maxWidth: 500 }}>
                Our support team is available Monday to Friday, 8AM to 6PM.
                We usually respond within a few hours.
              </p>
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                <a
                  href="mailto:noreply.tabibi@gmail.com"
                  className="btn btn-light btn-lg fw-semibold d-inline-flex align-items-center gap-2 justify-content-center"
                >
                  Email Us <ArrowRight size={18} />
                </a>
                <a href="tel:+21276864261" className="btn btn-outline-light btn-lg">
                  Call Us
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}