import { useEffect, useRef, useState } from 'react';
import useReveal from '../hooks/useReveal';
import { profile } from '../content';
import './contact.css';

const socials = [
  { id: 'github', label: 'GitHub', href: profile.github },
  { id: 'linkedin', label: 'LinkedIn', href: profile.linkedin },
];

export default function Contact() {
  const ref = useReveal();
  const magneticOk = useRef(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      magneticOk.current = finePointer.matches && !reducedMotion.matches;
    };
    update();
    finePointer.addEventListener('change', update);
    reducedMotion.addEventListener('change', update);
    return () => {
      finePointer.removeEventListener('change', update);
      reducedMotion.removeEventListener('change', update);
    };
  }, []);

  const onMagnetMove = (e) => {
    if (!magneticOk.current) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.3;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.3;
    el.style.transition = 'transform 0.1s linear';
    el.style.transform = `translate(${x}px, ${y}px)`;
  };

  const onMagnetLeave = (e) => {
    const el = e.currentTarget;
    el.style.transition = 'transform 0.4s var(--ease-out-expo)';
    el.style.transform = 'translate(0, 0)';
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // No form-backend key configured → fall back to the visitor's mail app.
    if (!profile.web3formsKey) {
      const subject = encodeURIComponent(form.subject || `Portfolio message from ${form.name}`);
      const body = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
      );
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: profile.web3formsKey,
          name: form.name,
          email: form.email,
          subject: form.subject || `Portfolio message from ${form.name}`,
          message: form.message,
          from_name: 'Portfolio Contact Form',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('sent');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const submitLabel =
    status === 'sending' ? 'Sending…' : status === 'sent' ? 'Message sent ✓' : './send.sh';

  return (
    <section className="section contact" id="contact" ref={ref}>
      <div className="container">
        <p className="section__index"><span className="prompt">$</span> ./contact.sh --now</p>

        <h2 className="contact__headline">
          <span className="contact__line reveal">GOT AN IDEA?</span>
          <span className="contact__line reveal" style={{ '--reveal-delay': '0.12s' }}>
            <span className="stroke">PING</span> <span className="accent">ME</span>
          </span>
        </h2>

        <div className="contact__grid">
          <div className="contact__info">
            <p className="contact__invite reveal">
              Have a project, a role, or a question? Mail me &mdash; I usually
              reply within a day.
            </p>

            <div className="contact__rows">
              <div className="contact__row reveal" style={{ '--reveal-delay': '0.08s' }}>
                <span className="mono-label">Mail</span>
                <a className="contact__link" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
              </div>
              <div className="contact__row reveal" style={{ '--reveal-delay': '0.16s' }}>
                <span className="mono-label">Location</span>
                <span className="contact__link contact__link--static">
                  {profile.location}
                </span>
              </div>
            </div>

            <div className="contact__socials reveal" style={{ '--reveal-delay': '0.3s' }}>
              {socials.map((s) => (
                <a
                  key={s.id}
                  className="contact__social"
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  onMouseMove={onMagnetMove}
                  onMouseLeave={onMagnetLeave}
                >
                  {s.label} <span aria-hidden="true">&#8599;</span>
                </a>
              ))}
            </div>
          </div>

          <form className="contact__form reveal" onSubmit={onSubmit} style={{ '--reveal-delay': '0.15s' }}>
            <div className="contact__form-row">
              <div className="contact__field">
                <label className="mono-label" htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Jane Doe"
                  aria-label="Your name"
                  required
                />
              </div>
              <div className="contact__field">
                <label className="mono-label" htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="jane@example.com"
                  aria-label="Your email address"
                  required
                />
              </div>
            </div>

            <div className="contact__field">
              <label className="mono-label" htmlFor="contact-subject">Subject</label>
              <input
                id="contact-subject"
                type="text"
                name="subject"
                value={form.subject}
                onChange={onChange}
                placeholder="What's this about?"
                aria-label="Message subject"
              />
            </div>

            <div className="contact__field">
              <label className="mono-label" htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows="5"
                value={form.message}
                onChange={onChange}
                placeholder="Tell me about your idea..."
                aria-label="Your message"
                required
              />
            </div>

            <button
              type="submit"
              className="btn contact__submit"
              disabled={status === 'sending'}
              onMouseMove={onMagnetMove}
              onMouseLeave={onMagnetLeave}
            >
              {submitLabel} {status === 'idle' && <span aria-hidden="true">&#8599;</span>}
            </button>

            {status === 'error' && (
              <p className="contact__status mono-label" role="alert">
                Something went wrong — mail me directly at {profile.email}
              </p>
            )}
            {status === 'sent' && (
              <p className="contact__status contact__status--ok mono-label" role="status">
                Thanks! I&rsquo;ll get back to you soon.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
