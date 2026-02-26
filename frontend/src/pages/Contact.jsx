import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, ArrowRight } from "lucide-react";
import api from "@/lib/api";

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

function FadeIn({ children, delay = 0, direction = "up", className = "" }) {
  const [ref, visible] = useFadeIn();
  const translate = direction === "up" ? "translateY(40px)" : direction === "down" ? "translateY(-40px)" : direction === "left" ? "translateX(40px)" : "translateX(-40px)";
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translate(0)" : translate, transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

const initialForm = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const { t } = useTranslation();
  const [form,    setForm]    = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors,  setErrors]  = useState({});
  const [openFaq, setOpenFaq] = useState(null);

  const contactInfo = [
    { icon: Mail,   title: t("contact.email_title"),   value: "noreply.tabibi@gmail.com",      color: "primary", href: "mailto:noreply.tabibi@gmail.com" },
    { icon: Phone,  title: t("contact.phone_title"),   value: "+212 7 6786 4261",              color: "success", href: "tel:+21276864261"                },
    { icon: MapPin, title: t("contact.address_title"), value: t("contact.address_value"),      color: "danger",  href: null                             },
    { icon: Clock,  title: t("contact.hours_title"),   value: t("contact.hours_value"),        color: "warning", href: null                             },
  ];

  const faqs = [
    { q: t("contact.faq1_q"), a: t("contact.faq1_a") },
    { q: t("contact.faq2_q"), a: t("contact.faq2_a") },
    { q: t("contact.faq3_q"), a: t("contact.faq3_a") },
    { q: t("contact.faq4_q"), a: t("contact.faq4_a") },
  ];

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
        const mapped = {};
        Object.keys(err.response.data.errors).forEach((key) => {
          mapped[key] = err.response.data.errors[key][0];
        });
        setErrors(mapped);
      } else {
        setErrors({ general: t("contact.error") });
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
              <MessageSquare size={13} /> {t("contact.badge")}
            </span>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="display-5 fw-bold mb-3">
              {t("contact.title")} <span className="text-primary">{t("contact.title_highlight")}</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="lead text-secondary mx-auto mb-0" style={{ maxWidth: 600 }}>{t("contact.subtitle")}</p>
          </FadeIn>
        </div>
      </section>

      {/* Info Cards */}
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

            {/* Form */}
            <div className="col-lg-7">
              <FadeIn direction="right">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-body-secondary py-3 d-flex align-items-center gap-2">
                    <Send size={15} className="text-secondary" />
                    <strong className="small text-uppercase text-secondary">{t("contact.form_header")}</strong>
                  </div>
                  <div className="card-body p-4">
                    {success && (
                      <div className="alert alert-success d-flex align-items-center gap-2 mb-4">
                        <Mail size={16} /> <span>{t("contact.success")}</span>
                      </div>
                    )}
                    {errors.general && (
                      <div className="alert alert-danger py-2 small mb-3">{errors.general}</div>
                    )}
                    <form onSubmit={handleSubmit} noValidate>
                      <div className="row g-3 mb-3">
                        <div className="col-sm-6">
                          <label htmlFor="name" className="form-label small fw-semibold">{t("contact.name")}</label>
                          <input id="name" name="name" value={form.name} onChange={handleChange} className={`form-control ${errors.name ? "is-invalid" : ""}`} placeholder={t("contact.name_placeholder")} required />
                          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>
                        <div className="col-sm-6">
                          <label htmlFor="email" className="form-label small fw-semibold">{t("contact.email")}</label>
                          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className={`form-control ${errors.email ? "is-invalid" : ""}`} placeholder={t("contact.email_placeholder")} required />
                          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="subject" className="form-label small fw-semibold">{t("contact.subject")}</label>
                        <input id="subject" name="subject" value={form.subject} onChange={handleChange} className={`form-control ${errors.subject ? "is-invalid" : ""}`} placeholder={t("contact.subject_placeholder")} required />
                        {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                      </div>
                      <div className="mb-4">
                        <label htmlFor="message" className="form-label small fw-semibold">{t("contact.message")}</label>
                        <textarea id="message" name="message" value={form.message} onChange={handleChange} className={`form-control ${errors.message ? "is-invalid" : ""}`} placeholder={t("contact.message_placeholder")} rows={5} required />
                        {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                      </div>
                      <button type="submit" className="btn btn-primary d-flex align-items-center gap-2" disabled={loading}>
                        {loading
                          ? <><span className="spinner-border spinner-border-sm" /> {t("contact.sending")}</>
                          : <><Send size={15} /> {t("contact.send")}</>}
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
                    <strong className="small text-uppercase text-secondary">{t("contact.faq_header")}</strong>
                  </div>
                  <div className="card-body p-0">
                    <div className="accordion accordion-flush">
                      {faqs.map((faq, i) => (
                        <div className="accordion-item border-0 border-bottom" key={i}>
                          <h2 className="accordion-header">
                            <button className={`accordion-button small fw-semibold py-3 ${openFaq !== i ? "collapsed" : ""}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                              {faq.q}
                            </button>
                          </h2>
                          <div className={`accordion-collapse collapse ${openFaq === i ? "show" : ""}`}>
                            <div className="accordion-body py-2 text-secondary small">{faq.a}</div>
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
              <h2 className="fw-bold mb-3">{t("contact.cta_title")}</h2>
              <p className="opacity-75 lead mb-4 mx-auto" style={{ maxWidth: 500 }}>{t("contact.cta_subtitle")}</p>
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                <a href="mailto:noreply.tabibi@gmail.com" className="btn btn-light btn-lg fw-semibold d-inline-flex align-items-center gap-2 justify-content-center">
                  {t("contact.email_us")} <ArrowRight size={18} />
                </a>
                <a href="tel:+21276864261" className="btn btn-outline-light btn-lg">{t("contact.call_us")}</a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}