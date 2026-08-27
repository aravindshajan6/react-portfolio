import { useCallback, useEffect, useRef, useState } from 'react';
import { animate, createTimeline, createDraggable, spring, stagger, utils } from 'animejs';
import {
  profile,
  stats,
  skills,
  timeline,
  certifications,
  projects,
} from '../content';
import { EVENTS, emit, scrollToSection, prefersReducedMotion } from '../lib/motion';
import CV from '../assets/resume.pdf';
import './terminal.css';

/* ── constants ─────────────────────────────────────────────── */
const PROMPT = 'aravind@portfolio:~$ ';
const MAX_LINES = 300;
const SECTIONS = ['home', 'about', 'skills', 'work', 'journey', 'contact'];
const COMMANDS = [
  'help', 'whoami', 'neofetch', 'cat', 'ls', 'projects', 'open', 'skills',
  'journey', 'git', 'certs', 'contact', 'mail', 'cv', 'resume', 'goto', 'cd',
  'theme', 'date', 'echo', 'pwd', 'history', 'clear', 'exit', 'quit', 'sudo',
  'rm', 'matrix', 'hack',
];
const FILES = ['about.md', 'projects/', 'skills/', 'journey/', 'certs/', 'contact.sh', 'resume.pdf'];
const GLYPHS = 'ｱｲｳｴｵｶｷｹｻｼｽｾﾀﾂﾃﾅﾆﾉﾊﾋﾌﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789<>/\\|=+*#$';
const LOGO = [
  ' █████╗  ███████╗',
  '██╔══██╗ ██╔════╝',
  '███████║ ███████╗',
  '██╔══██║ ╚════██║',
  '██║  ██║ ███████║',
  '╚═╝  ╚═╝ ╚══════╝',
];

let lineId = 0;
/** build a line: text string OR array of segments [{ t, c }] */
const L = (content, cls = 'out') => ({
  id: ++lineId,
  cls,
  segs: Array.isArray(content) ? content : [{ t: content }],
});
const cancelRef = (ref) => {
  if (ref.current) { ref.current.cancel(); ref.current = null; }
};
const isMobile = () => window.matchMedia('(max-width: 767px)').matches;
const isTouch = () => !window.matchMedia('(pointer: fine)').matches;
const pad = (s, n) => String(s).padEnd(n, ' ');
const openUrl = (url) => window.open(url, '_blank', 'noopener,noreferrer');
const findProject = (arg) => {
  const q = arg.trim().toLowerCase();
  if (!q) return null;
  const n = Number(q);
  if (Number.isInteger(n) && n >= 1 && n <= projects.length) return projects[n - 1];
  return projects.find((p) => p.title.toLowerCase() === q)
    || projects.find((p) => p.title.toLowerCase().startsWith(q))
    || projects.find((p) => p.title.toLowerCase().includes(q))
    || null;
};
const currentSection = () => {
  const mid = window.innerHeight * 0.4;
  let cur = 'home';
  SECTIONS.forEach((id) => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= mid) cur = id;
  });
  return cur;
};

/* ── command implementations ───────────────────────────────── */
function buildCommands({ close, clearOut, getHistory }) {
  const cmds = {
    help: () => [
      L('Available commands:', 'accent'),
      ...[
        ['help', 'this list'],
        ['whoami', 'who is behind this site'],
        ['neofetch', 'system info, terminal style'],
        ['cat about.md', 'short bio'],
        ['ls [projects|skills]', 'list files / projects / skills'],
        ['open <n|name>', 'open a project in a new tab'],
        ['skills', 'skill bars'],
        ['journey | git log', 'work + education timeline'],
        ['certs', 'certifications'],
        ['contact | mail', 'email + socials'],
        ['cv | resume', 'download the CV'],
        ['goto <section> | cd', `jump to ${SECTIONS.join('|')}`],
        ['theme [light|dark|toggle]', 'switch theme'],
        ['date | pwd | echo | history', 'the usual suspects'],
        ['clear | exit', 'clean up / close'],
      ].map(([c, d]) => L([{ t: `  ${pad(c, 28)}`, c: 'k' }, { t: d, c: 'dim' }])),
      L("Tips: Tab completes, ↑/↓ browse history, ` or Ctrl+K toggles. Try 'sudo hire aravind'.", 'dim'),
    ],

    whoami: () => [
      L(`${profile.firstName} ${profile.lastName} — ${profile.role}`, 'accent'),
      L(profile.tagline, 'dim'),
    ],

    neofetch: () => {
      const years = stats.find((s) => /experience/i.test(s.label));
      const info = [
        ['OS', 'Portfolio v3 x86_64'],
        ['Host', `${profile.firstName} ${profile.lastName} (${profile.role})`],
        ['Shell', 'zsh 5.9 (react 18 + vite)'],
        ['Uptime', `${years ? years.value + years.suffix : '3+'} years of experience`],
        ['Location', profile.location],
        ['Stack', 'Python · Playwright · FastAPI · MERN'],
        ['Status', `${profile.freelance} for freelance & full-time`],
        ['Languages', profile.languages.join(', ')],
      ];
      const rows = Math.max(LOGO.length, info.length);
      const out = [L('')];
      for (let i = 0; i < rows; i += 1) {
        const segs = [{ t: pad(LOGO[i] || '', 20), c: 'logo' }];
        if (info[i]) segs.push({ t: `${info[i][0]}: `, c: 'k' }, { t: info[i][1], c: 'v' });
        out.push(L(segs, 'raw'));
      }
      out.push(L(''));
      out.push(L(
        ['#ff5f57', '#febc2e', '#28c840', 'var(--accent)', 'var(--accent-2)', 'var(--text)', 'var(--text-dim)', 'var(--border)']
          .map((color) => ({ t: '███', color })),
        'raw'
      ));
      return out;
    },

    cat: (arg) => {
      const f = arg.trim().replace(/^\.\//, '');
      if (f === 'about.md' || f === 'about') {
        return [
          L(`# ${profile.firstName} ${profile.lastName}`, 'accent'),
          L(`${profile.role} from ${profile.location}. ${profile.tagline}`),
          L('Currently open to freelance work and full-time roles — mail me, I reply fast.', 'dim'),
        ];
      }
      if (f === 'contact.sh') return cmds.contact();
      if (f === 'resume.pdf') return [L('cat: resume.pdf: binary file — use `cv` to download it.', 'warn')];
      if (!f) return [L('usage: cat <file>', 'warn')];
      return [L(`cat: ${f}: No such file or directory`, 'err')];
    },

    ls: (arg) => {
      const a = arg.trim().replace(/\/$/, '').toLowerCase();
      if (a === 'projects') return cmds.projects();
      if (a === 'skills') return cmds.skills();
      if (a === 'journey') return cmds.journey();
      if (a === 'certs') return cmds.certs();
      if (a && a !== '~' && a !== '.') return [L(`ls: cannot access '${a}': No such file or directory`, 'err')];
      return [L(FILES.map((f) => ({ t: pad(f, 13), c: f.endsWith('/') ? 'dir' : f.endsWith('.sh') ? 'exe' : 'v' })), 'raw')];
    },

    projects: () => [
      L([{ t: `  ${pad('#', 4)}${pad('TITLE', 26)}${pad('STACK', 34)}LINK`, c: 'dim' }], 'raw'),
      ...projects.map((p, i) => L([
        { t: `  ${pad(i + 1, 4)}`, c: 'k' },
        { t: pad(p.title, 26), c: 'v' },
        { t: pad(p.stack.join(', ').slice(0, 32), 34), c: 'dim' },
        { t: p.link ? p.link.replace(/^https?:\/\//, '') : 'private', c: p.link ? 'link' : 'warn' },
      ], 'raw')),
      L(`open <n|name> to launch one · ${projects.length} projects`, 'dim'),
    ],

    open: (arg) => {
      if (!arg.trim()) return [L('usage: open <index|name>  (see `ls projects`)', 'warn')];
      const p = findProject(arg);
      if (!p) return [L(`open: no project matching '${arg.trim()}'`, 'err')];
      if (!p.link) return [L(`${p.title} is private client work — no public demo, sorry.`, 'warn')];
      openUrl(p.link);
      return [L(`→ opening ${p.title} (${p.link})`, 'accent')];
    },

    skills: () => skills.map((s) => {
      const filled = Math.round(s.level / 5);
      return L([
        { t: `  ${pad(s.name, 14)}`, c: 'v' },
        { t: '█'.repeat(filled), c: 'bar' },
        { t: '░'.repeat(20 - filled), c: 'dim' },
        { t: `  ${pad(s.level + '%', 5)}`, c: 'k' },
        { t: s.tag, c: 'dim' },
      ], 'raw');
    }),

    journey: () => timeline.flatMap((t) => {
      const hash = (t.id * 2654435761 % 0xffffff).toString(16).padStart(7, '0').slice(0, 7);
      return [
        L([{ t: `commit ${hash} `, c: 'hash' }, { t: `(${t.kind})`, c: t.kind === 'experience' ? 'accent' : 'dim' }], 'raw'),
        L([{ t: 'Date:   ', c: 'dim' }, { t: t.year, c: 'v' }], 'raw'),
        L([{ t: `    ${t.title} @ ${t.place}`, c: 'v' }], 'raw'),
        L([{ t: `    ${t.desc}`, c: 'dim' }], 'raw'),
        L(''),
      ];
    }),

    git: (arg) => (arg.trim() === 'log' || !arg.trim()
      ? cmds.journey()
      : [L(`git: '${arg.trim()}' is not a git command. Try 'git log'.`, 'err')]),

    certs: () => certifications.map((c, i) => L([
      { t: `  [${i + 1}] `, c: 'k' }, { t: c.title, c: 'v' },
    ], 'raw')),

    contact: () => [
      L([{ t: 'email     ', c: 'k' }, { t: profile.email, c: 'link' }], 'raw'),
      L([{ t: 'github    ', c: 'k' }, { t: profile.github, c: 'link' }], 'raw'),
      L([{ t: 'linkedin  ', c: 'k' }, { t: profile.linkedin, c: 'link' }], 'raw'),
      L([{ t: 'location  ', c: 'k' }, { t: profile.location, c: 'v' }], 'raw'),
      L("`mail` opens your email client · `goto contact` for the form", 'dim'),
    ],

    mail: () => {
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent('Hello from your portfolio terminal')}`;
      return [L(`→ opening mailto:${profile.email}`, 'accent')];
    },

    cv: () => {
      openUrl(CV);
      return [L('→ opening resume.pdf', 'accent')];
    },
    resume: () => cmds.cv(),

    goto: (arg) => {
      const id = arg.trim().replace(/^~?\//, '').replace(/\/$/, '').toLowerCase();
      if (!id || id === '~') return cmds.goto('home');
      if (!SECTIONS.includes(id)) return [L(`cd: no such section: ${id}  (${SECTIONS.join(' | ')})`, 'err')];
      scrollToSection(id);
      window.setTimeout(close, 120);
      return [L(`→ ~/${id}`, 'accent')];
    },
    cd: (arg) => cmds.goto(arg),

    theme: (arg) => {
      const want = arg.trim().toLowerCase();
      const cur = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
      if (want && want !== 'toggle' && want !== 'light' && want !== 'dark') {
        return [L('usage: theme [light|dark|toggle]', 'warn')];
      }
      if (want === cur) return [L(`theme already ${cur}`, 'dim')];
      emit(EVENTS.themeToggle);
      return [L(`→ theme: ${cur === 'light' ? 'dark' : 'light'}`, 'accent')];
    },

    date: () => [L(new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata', weekday: 'short', year: 'numeric', month: 'short',
      day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    }) + ' IST')],

    echo: (arg) => [L(arg.replace(/^["']|["']$/g, '').replace(/\$USER/g, 'aravind').replace(/\$STATUS/g, profile.freelance))],

    pwd: () => {
      const s = currentSection();
      return [L(s === 'home' ? '~' : `~/${s}`)];
    },

    history: () => {
      const h = getHistory();
      return h.length
        ? h.map((c, i) => L([{ t: `  ${pad(i + 1, 5)}`, c: 'dim' }, { t: c }], 'raw'))
        : [L('history is empty', 'dim')];
    },

    clear: () => { clearOut(); return []; },
    exit: () => { window.setTimeout(close, 60); return [L('logout', 'dim')]; },
    quit: () => cmds.exit(),

    sudo: (arg) => {
      const a = arg.trim().toLowerCase();
      if (/^hire\s+aravind/.test(a) || a === 'hire') {
        window.setTimeout(() => {
          window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent("Let's work together")}`;
        }, 400);
        return [
          L('[sudo] password for recruiter: ********', 'dim'),
          L('✔ Authentication successful.', 'accent'),
          L('✔ Checking availability........ Available', 'accent'),
          L('✔ Approving hire request........ APPROVED 🎉', 'accent'),
          L(`→ opening mailto:${profile.email} — let's talk!`),
        ];
      }
      return [L(`Permission denied: this incident will be reported to ${profile.email} 😄`, 'err')];
    },

    rm: (arg) => {
      const a = arg.trim();
      if (/-rf?\s+\/(\s|$)/.test(a) || a.includes('/*') || a.includes('--no-preserve-root')) {
        return [
          L('rm: refusing to remove root directory — nice try.', 'err'),
          L("This portfolio is load-bearing. Deleting it would take my career with it.", 'dim'),
        ];
      }
      return [L(`rm: cannot remove '${arg.trim() || ''}': Read-only file system`, 'err')];
    },

    matrix: () => 'matrix',
    hack: () => 'matrix',
  };
  return cmds;
}

/* ── component ─────────────────────────────────────────────── */
export default function Terminal() {
  const [visible, setVisible] = useState(false);
  const [lines, setLines] = useState(() => [
    L(`Welcome to ${profile.firstName}'s portfolio shell. Type 'help' to get started.`, 'dim'),
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);

  const rootRef = useRef(null);
  const backdropRef = useRef(null);
  const winRef = useRef(null);
  const innerRef = useRef(null);
  const barRef = useRef(null);
  const outputRef = useRef(null);
  const inputRef = useRef(null);
  const closeBtnRef = useRef(null);

  const openRef = useRef(false);
  const tlRef = useRef(null);
  const dragRef = useRef(null);
  const rainRef = useRef(null);
  const prevFocusRef = useRef(null);
  const prevOverflowRef = useRef(null);
  const histIdxRef = useRef(-1);
  const historyRef = useRef(history);
  const lastAnimatedRef = useRef(lineId);
  const busyRef = useRef(false);
  historyRef.current = history;

  const print = useCallback((newLines) => {
    setLines((prev) => [...prev, ...newLines].slice(-MAX_LINES));
  }, []);

  /* ── open / close ─────────────────────────────────────── */

  const open = useCallback(() => {
    if (openRef.current) return;
    openRef.current = true;
    prevFocusRef.current = document.activeElement;
    prevOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setVisible(true);
  }, []);

  const close = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    if (dragRef.current) { dragRef.current.revert(); dragRef.current = null; }
    document.body.style.overflow = prevOverflowRef.current || '';
    prevOverflowRef.current = null;

    const finish = () => {
      setVisible(false);
      const prev = prevFocusRef.current;
      if (prev && typeof prev.focus === 'function' && document.contains(prev)) prev.focus({ preventScroll: true });
      prevFocusRef.current = null;
    };

    cancelRef(tlRef);
    if (prefersReducedMotion() || !innerRef.current) { finish(); return; }
    const mobile = isMobile();
    tlRef.current = createTimeline({ defaults: { duration: 260, ease: 'in(2)' }, onComplete: finish })
      .add(innerRef.current, mobile
        ? { y: ['0%', '100%'] }
        : { scale: [1, 0.94], y: [0, 24], opacity: [1, 0] })
      .add(backdropRef.current, { opacity: [1, 0] }, '<<');
  }, []);

  const toggle = useCallback(() => (openRef.current ? close() : open()), [open, close]);

  /* enter animation + draggable, once the DOM is visible */
  useEffect(() => {
    if (!visible) return undefined;
    const win = winRef.current;
    const inner = innerRef.current;
    const backdrop = backdropRef.current;
    const mobile = isMobile();

    utils.set(win, { x: 0, y: 0 });
    cancelRef(tlRef);
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
    if (prefersReducedMotion()) {
      utils.set(inner, { opacity: 1, scale: 1, y: 0 });
      utils.set(backdrop, { opacity: 1 });
    } else {
      tlRef.current = createTimeline({ defaults: { duration: 380 } })
        .add(backdrop, { opacity: [0, 1], ease: 'out(2)' })
        .add(inner, mobile
          ? { y: ['100%', '0%'], ease: spring({ bounce: 0.15, duration: 520 }) }
          : { scale: [0.92, 1], y: [28, 0], opacity: [0, 1], ease: spring({ bounce: 0.3, duration: 560 }) },
        '<<+=40');
    }

    if (!mobile && !isTouch()) {
      dragRef.current = createDraggable(win, {
        trigger: barRef.current,
        container: rootRef.current,
        containerPadding: 12,
        releaseStiffness: 180,
        releaseDamping: 18,
        releaseMass: 1,
        cursor: { onHover: 'grab', onGrab: 'grabbing' },
      });
    }

    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      cancelAnimationFrame(raf);
      cancelRef(tlRef);
      if (dragRef.current) { dragRef.current.revert(); dragRef.current = null; }
    };
  }, [visible]);

  /* window events + hotkeys */
  useEffect(() => {
    const onKey = (e) => {
      const t = e.target;
      const inTerminal = rootRef.current && rootRef.current.contains(t);
      const inField = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if (e.key === 'Escape' && openRef.current) { e.preventDefault(); close(); return; }
      if (inField && !inTerminal) return;
      const hot = ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')
        || (!e.ctrlKey && !e.metaKey && !e.altKey && (e.key === '`' || e.key === '~'));
      if (hot) { e.preventDefault(); toggle(); }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener(EVENTS.terminalToggle, toggle);
    window.addEventListener(EVENTS.terminalOpen, open);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(EVENTS.terminalToggle, toggle);
      window.removeEventListener(EVENTS.terminalOpen, open);
    };
  }, [open, close, toggle]);

  /* unmount safety: restore body + revert everything */
  useEffect(() => () => {
    if (prevOverflowRef.current !== null) document.body.style.overflow = prevOverflowRef.current || '';
    cancelRef(tlRef);
    if (dragRef.current) { dragRef.current.revert(); dragRef.current = null; }
    if (rainRef.current) { rainRef.current.revert(); rainRef.current = null; }
  }, []);

  /* animate freshly printed lines + scroll to bottom */
  useEffect(() => {
    const out = outputRef.current;
    if (!out) return;
    const fresh = Array.from(out.querySelectorAll('.term__line')).filter(
      (el) => Number(el.dataset.id) > lastAnimatedRef.current
    );
    lastAnimatedRef.current = lineId;
    if (fresh.length && !prefersReducedMotion()) {
      animate(fresh, {
        opacity: [0, 1],
        x: [-8, 0],
        duration: 220,
        ease: 'out(3)',
        delay: stagger(Math.min(28, 600 / fresh.length)),
      });
    }
    out.scrollTop = out.scrollHeight;
  }, [lines]);

  /* ── matrix rain easter egg ───────────────────────────── */
  const runMatrix = () => {
    const out = outputRef.current;
    if (!out || busyRef.current) return;
    busyRef.current = true;
    const layer = document.createElement('div');
    layer.className = 'term__rain';
    layer.setAttribute('aria-hidden', 'true');
    const cols = Math.max(8, Math.floor(out.clientWidth / 18));
    for (let c = 0; c < cols; c += 1) {
      const col = document.createElement('span');
      col.className = 'term__rain-col';
      col.style.left = `${(c / cols) * 100}%`;
      let s = '';
      for (let i = 0; i < 16; i += 1) s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)] + '\n';
      col.textContent = s;
      layer.appendChild(col);
    }
    out.appendChild(layer);
    const done = () => {
      layer.remove();
      rainRef.current = null;
      busyRef.current = false;
      print([L('ACCESS GRANTED... just kidding. Nothing here but a portfolio 🙂', 'accent')]);
    };
    if (prefersReducedMotion()) { done(); return; }
    rainRef.current = animate(layer.children, {
      y: ['-100%', '100%'],
      opacity: [{ to: 1, duration: 200 }, { to: 0, duration: 400, delay: 900 }],
      duration: 1500,
      ease: 'linear',
      delay: stagger(40, { from: 'random' }),
      onComplete: done,
    });
  };

  /* ── command dispatch ─────────────────────────────────── */
  const cmdsRef = useRef(null);
  if (!cmdsRef.current) {
    cmdsRef.current = buildCommands({
      close,
      clearOut: () => setLines([]),
      getHistory: () => historyRef.current,
    });
  }

  const run = (raw) => {
    const trimmed = raw.trim();
    print([L([{ t: PROMPT, c: 'prompt' }, { t: raw }], 'cmd')]);
    if (!trimmed) return;
    setHistory((h) => [...h, trimmed].slice(-100));
    histIdxRef.current = -1;
    const [name, ...rest] = trimmed.split(/\s+/);
    const fn = cmdsRef.current[name.toLowerCase()];
    if (!fn) {
      print([L(`zsh: command not found: ${name} — try 'help'`, 'err')]);
      return;
    }
    const result = fn(rest.join(' '), trimmed);
    if (result === 'matrix') { runMatrix(); return; }
    if (Array.isArray(result) && result.length) print(result);
  };

  /* ── input handling ───────────────────────────────────── */
  const complete = () => {
    const val = input;
    const parts = val.split(/\s+/);
    if (parts.length <= 1) {
      const m = COMMANDS.filter((c) => c.startsWith(val.toLowerCase()));
      if (m.length === 1) setInput(`${m[0]} `);
      else if (m.length > 1) print([L([{ t: PROMPT, c: 'prompt' }, { t: val }], 'cmd'), L(m.join('  '), 'dim')]);
      return;
    }
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();
    let pool = [];
    if (['goto', 'cd'].includes(cmd)) pool = SECTIONS;
    else if (cmd === 'open') pool = projects.map((p) => p.title);
    else if (['cat', 'ls'].includes(cmd)) pool = FILES.map((f) => f.replace(/\/$/, ''));
    else if (cmd === 'theme') pool = ['light', 'dark', 'toggle'];
    else if (cmd === 'git') pool = ['log'];
    else if (cmd === 'sudo') pool = ['hire aravind'];
    const m = pool.filter((p) => p.toLowerCase().startsWith(arg));
    if (m.length === 1) setInput(`${parts[0]} ${m[0]}`);
    else if (m.length > 1) print([L([{ t: PROMPT, c: 'prompt' }, { t: val }], 'cmd'), L(m.join('  '), 'dim')]);
  };

  const onInputKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      run(input);
      setInput('');
    } else if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      complete();
    } else if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault();
      closeBtnRef.current?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const h = historyRef.current;
      if (!h.length) return;
      const idx = histIdxRef.current === -1 ? h.length - 1 : Math.max(0, histIdxRef.current - 1);
      histIdxRef.current = idx;
      setInput(h[idx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const h = historyRef.current;
      if (histIdxRef.current === -1) return;
      const idx = histIdxRef.current + 1;
      if (idx >= h.length) { histIdxRef.current = -1; setInput(''); } else { histIdxRef.current = idx; setInput(h[idx]); }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    } else if (e.key === 'c' && e.ctrlKey && !window.getSelection()?.toString()) {
      e.preventDefault();
      print([L([{ t: PROMPT, c: 'prompt' }, { t: `${input}^C` }], 'cmd')]);
      setInput('');
    }
  };

  /* focus trap: Tab on the close button wraps to the input */
  const onCloseKey = (e) => {
    if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); inputRef.current?.focus(); }
  };
  const onDialogKey = (e) => {
    if (e.key === 'Tab' && e.target !== inputRef.current && e.target !== closeBtnRef.current) {
      e.preventDefault();
      inputRef.current?.focus();
    }
  };

  if (!visible) return null;

  return (
    <div
      className="term"
      ref={rootRef}
      role="presentation"
      onKeyDown={onDialogKey}
    >
      <div
        className="term__backdrop"
        ref={backdropRef}
        onClick={close}
        aria-hidden="true"
      />
      <div
        className="term__win"
        ref={winRef}
        role="dialog"
        aria-modal="true"
        aria-label="Interactive terminal"
      >
        <div className="term__inner" ref={innerRef}>
          <div className="term__bar" ref={barRef}>
            <span className="term__dots" aria-hidden="true">
              <span className="term__dot" />
              <span className="term__dot" />
              <span className="term__dot" />
            </span>
            <span className="term__title">aravind@portfolio: ~ — zsh</span>
            <button
              type="button"
              className="term__close"
              ref={closeBtnRef}
              onClick={close}
              onKeyDown={onCloseKey}
              aria-label="Close terminal"
            >
              ×
            </button>
          </div>

          <div
            className="term__body"
            onClick={(e) => {
              if (!window.getSelection()?.toString() && e.target.closest('.term__line') === null) {
                inputRef.current?.focus();
              }
            }}
          >
            <div className="term__output" ref={outputRef} aria-live="polite" aria-atomic="false">
              {lines.map((line) => (
                <div
                  key={line.id}
                  data-id={line.id}
                  className={`term__line term__line--${line.cls}`}
                >
                  {line.segs.map((s, i) => (
                    <span
                      key={i}
                      className={s.c ? `term__seg term__seg--${s.c}` : 'term__seg'}
                      style={s.color ? { color: s.color } : undefined}
                    >
                      {s.t}
                    </span>
                  ))}
                  {line.segs.length === 1 && line.segs[0].t === '' && ' '}
                </div>
              ))}
            </div>

            <label className="term__inputline" htmlFor="term-input">
              <span className="term__seg--prompt">{PROMPT}</span>
              <span className="term__field">
                <span className="term__ghost" aria-hidden="true">
                  {input}
                  <span className="term__cursor" />
                </span>
                <input
                  id="term-input"
                  ref={inputRef}
                  className="term__input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onInputKey}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  aria-label="Terminal command input"
                />
              </span>
            </label>
          </div>
        </div>
      </div>
      <p className="term__hint" aria-hidden="true">
        esc to close · ` or ctrl+k to toggle
      </p>
    </div>
  );
}
