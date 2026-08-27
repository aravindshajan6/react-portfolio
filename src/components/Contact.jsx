import { useEffect, useRef, useState } from 'react';
import { animate, createAnimatable, stagger } from 'animejs';
import useAnimeScope from '../hooks/useAnimeScope';
import useReveal from '../hooks/useReveal';
import { profile } from '../content';
import './contact.css';

const socials = [
  { id: 'github', label: 'GitHub', href: profile.github },
  { id: 'linkedin', label: 'LinkedIn', href: profile.linkedin },
];

export default function Contact() {
  const ref = useReveal();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const statusRef = useRef(null);

  /* magnetic buttons — one Animatable per element, only on fine pointers */
  const [gridRef, scopeRef] = useAnimeScope((scope) => {
    const root = gridRef.current;
    scope.data.magnets = new Map();
    if (!root || scope.matches.reduce || !scope.matches.fine) return;
    root.querySelectorAll('[data-magnet]').forEach((el) => {
      scope.data.magnets.set(el, createAnimatable(el, { x: 450, y: 450, ease: 'out(3)' }));
    });
  });

  const onMagnetMove = (e) => {
    const m = scopeRef.current?.data?.magnets?.get(e.currentTarget);
    if (!m) return;
    const rect = e.currentTarget.getBoundingClientRect();
    m.x((e.clientX - (rect.left + rect.width / 2)) * 0.3);
    m.y((e.clientY - (rect.top + rect.height / 2)) * 0.3);
  };

  const onMagnetLeave = (e) => {
    const m = scopeRef.current?.data?.magnets?.get(e.currentTarget);
    if (!m) return;
    m.x(0);
    m.y(0);
  };

  /* status line pops in */
  useEffect(() => {
    if ((status !== 'sent' && status !== 'error') || !statusRef.current) return undefined;
    const a = animate(statusRef.current, {
      opacity: [0, 1],
      y: [8, 0],
      duration: 500,
      ease: 'out(3)',
    });
    if (status === 'sent') {
      const chips = statusRef.current.querySelectorAll('.contact__status-ok');
      animate(chips, { scale: [0.6, 1], opacity: [0, 1], delay: stagger(60), ease: 'outBack(1.8)', duration: 450 });
    }
    return () => a.cancel();
  }, [status]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // No form-backend key configured → fall back to the visitor's mail app.
    if (!profile.web3formsKey) {
      const subject = encodeURIComponent(form.subject || `Portfolio message from ${form.name}`);
      const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
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
    status === 'sending' ? 'sending…' : status === 'sent' ? 'sent ✓' : './send.sh';

  const fieldClass = (name) => `contact__field ${form[name] ? 'has-value' : ''}`;

  return (
    <section className="section contact" id="contact" ref={ref}>
      <div className="container">
        <p className="section__index reveal">
          <span className="prompt">$</span> ./contact.sh --now
        </p>

        <h2 className="contact__headline">
          <span className="contact__line reveal">GOT AN IDEA?</span>
          <span className="contact__line reveal" style={{ '--reveal-delay': '0.12s' }}>
            <span className="stroke">PING</span> <span className="accent">ME</span>
          </span>
        </h2>

        <div className="contact__grid" ref={gridRef}>
          <div className="contact__info">
            <p className="contact__invite reveal">
              Have a project, a role, or a question? Mail me &mdash; I usually reply within a
              day.
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
                <span className="contact__link contact__link--static">{profile.location}</span>
              </div>
              <div className="contact__row reveal" style={{ '--reveal-delay': '0.22s' }}>
                <span className="mono-label">Response time</span>
                <span className="contact__link contact__link--static">&lt; 24 hours</span>
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
                  data-magnet
                  onMouseMove={onMagnetMove}
                  onMouseLeave={onMagnetLeave}
                >
                  {s.label} <span aria-hidden="true">&#8599;</span>
                </a>
              ))}
            </div>
          </div>

          <form
            className="contact__form reveal"
            onSubmit={onSubmit}
            style={{ '--reveal-delay': '0.15s' }}
          >
            <div className="contact__form-row">
              <div className={fieldClass('name')}>
                <label className="mono-label" htmlFor="contact-name">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Jane Doe"
                  autoComplete="name"
                  required
                />
              </div>
              <div className={fieldClass('email')}>
                <label className="mono-label" htmlFor="contact-email">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="jane@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className={fieldClass('subject')}>
              <label className="mono-label" htmlFor="contact-subject">
                Subject
              </label>
              <input
                id="contact-subject"
                type="text"
                name="subject"
                value={form.subject}
                onChange={onChange}
                placeholder="What's this about?"
              />
            </div>

            <div className={fieldClass('message')}>
              <label className="mono-label" htmlFor="contact-message">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows="5"
                value={form.message}
                onChange={onChange}
                placeholder="Tell me about your idea..."
                required
              />
            </div>

            <button
              type="submit"
              className={`btn contact__submit ${status === 'sent' ? 'is-sent' : ''}`}
              disabled={status === 'sending'}
              data-magnet
              onMouseMove={onMagnetMove}
              onMouseLeave={onMagnetLeave}
            >
              {submitLabel} {status === 'idle' && <span aria-hidden="true">&#8599;</span>}
            </button>

            {status === 'error' && (
              <p className="contact__status mono-label" role="alert" ref={statusRef}>
                Something went wrong — mail me directly at {profile.email}
              </p>
            )}
            {status === 'sent' && (
              <p className="contact__status contact__status--ok mono-label" role="status" ref={statusRef}>
                <span className="contact__status-ok">[ OK ]</span> message queued ·{' '}
                <span className="contact__status-ok">[ OK ]</span> I&rsquo;ll reply soon
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
