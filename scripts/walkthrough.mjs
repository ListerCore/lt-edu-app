#!/usr/bin/env node
// Role walkthrough of a demo institution (phase E9 of docs/ceba/PLAN.md). For each role it signs in with a session
// token, opens every page its sidebar offers on desktop and on a phone, in light and dark theme, and records console
// errors, uncaught exceptions, error screens ("No se pudo cargar", the error boundary) and access denials. It writes
// a screenshot per page and a report (report.md and report.json) into the output folder.
//
//   cd joseph-api && go run ./cmd/demosessions -slug demo-eba > /tmp/sessions.json
//   node scripts/walkthrough.mjs --sessions /tmp/sessions.json --type EBA --out /tmp/walkthrough
//   cd joseph-api && go run ./cmd/demosessions -cleanup
//
// Options: --base http://localhost:5173  --roles director,tutor  --themes light,dark  --viewports desktop,mobile
// --wait 6000 (ms per page). Chrome: CHROME=/path/to/chrome, otherwise the Chrome for Testing of Playwright's cache.
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1]?.startsWith('--') || all[i + 1] === undefined ? 'true' : all[i + 1]]] : acc), []),
);
const base = args.base ?? 'http://localhost:5173';
const type = args.type ?? 'EBA';
const out = args.out ?? 'walkthrough-report';
const wait = Number(args.wait ?? 6000);
const themes = (args.themes ?? 'light,dark').split(',');
const viewports = (args.viewports ?? 'desktop,mobile').split(',');
if (!args.sessions) {
  console.error('Usage: node scripts/walkthrough.mjs --sessions sessions.json [--type EBA] [--out dir]');
  process.exit(1);
}
const sessions = JSON.parse(readFileSync(args.sessions, 'utf8'));
const roles = (args.roles ?? Object.keys(sessions).filter((k) => typeof sessions[k] === 'string').join(',')).split(',');
const sizes = { desktop: [1440, 1000, false], mobile: [390, 844, true] };

const findChrome = () => {
  if (process.env.CHROME) return process.env.CHROME;
  const cache = join(homedir(), 'Library/Caches/ms-playwright');
  const dir = existsSync(cache) ? readdirSync(cache).filter((d) => d.startsWith('chromium-')).sort().pop() : undefined;
  const mac = dir && join(cache, dir, 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
  if (mac && existsSync(mac)) return mac;
  const linux = dir && join(cache, dir, 'chrome-linux/chrome');
  if (linux && existsSync(linux)) return linux;
  console.error('Chrome not found: set CHROME');
  process.exit(1);
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let chrome;
let ws;
let id = 0;
const pending = new Map();
let problems = [];
// A fresh Chrome per role: a headless tab wedges after a few hundred navigations
const startBrowser = async () => {
  const port = 9400 + Math.floor(Math.random() * 400);
  chrome = spawn(findChrome(), ['--headless=new', `--remote-debugging-port=${port}`, '--hide-scrollbars', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', `--user-data-dir=/tmp/walkthrough-${port}`, 'about:blank'], { stdio: 'ignore' });
  let target;
  for (let i = 0; i < 60 && !target; i++) {
    await sleep(250);
    try {
      target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page');
    } catch {}
  }
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.method === 'Runtime.exceptionThrown') problems.push(`exception: ${(d.params.exceptionDetails.exception?.description ?? d.params.exceptionDetails.text).slice(0, 300)}`);
    if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') {
      const text = d.params.args.map((a) => a.value ?? a.description ?? '').join(' ').slice(0, 300);
      // The browser's own noise is not the page's error
      if (!/favicon|DevTools|Download the React DevTools/.test(text)) problems.push(`console: ${text}`);
    }
    if (d.method === 'Network.responseReceived' && d.params.type === 'Document' && d.params.response.status >= 400) problems.push(`http ${d.params.response.status}: ${d.params.response.url}`);
    if (d.id && pending.has(d.id)) {
      pending.get(d.id)(d);
      pending.delete(d.id);
    }
  };
  await send('Network.enable');
  await send('Runtime.enable');
  await send('Page.enable');
};
const stopBrowser = () => {
  ws?.close();
  chrome?.kill();
};
// Every command answers or gives up after 45 s (a page that hangs Chrome must not stop the walkthrough)
const send = (method, params = {}) =>
  new Promise((r) => {
    const i = ++id;
    const timer = setTimeout(() => {
      pending.delete(i);
      problems.push(`timeout: ${method}`);
      r({});
    }, 45_000);
    pending.set(i, (d) => {
      clearTimeout(timer);
      r(d);
    });
    ws.send(JSON.stringify({ id: i, method, params }));
  });
const evaluate = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result?.result?.value;
const host = new URL(base).hostname;
const results = [];
mkdirSync(out, { recursive: true });

for (const role of roles) {
  const token = sessions[role];
  if (!token) continue;
  stopBrowser();
  await startBrowser();
  await send('Network.setCookie', { name: 'joseph_session', value: token, domain: host, path: '/', httpOnly: true });
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: `${base}/` });
  await sleep(1500);
  await evaluate(`localStorage.setItem('joseph-workspace', ${JSON.stringify(JSON.stringify({ institutionType: type, role }))})`);
  // The pages of the role: every link its sidebar offers, with the collapsed groups opened
  await send('Page.navigate', { url: `${base}/dashboard` });
  await sleep(wait);
  const pages = await evaluate(`(async () => {
    const nav = document.querySelector('[data-sidebar="sidebar"], aside, nav');
    for (let round = 0; round < 3; round++) {
      document.querySelectorAll('[data-sidebar] button[aria-expanded="false"], nav button[aria-expanded="false"]').forEach((b) => b.click());
      await new Promise((r) => setTimeout(r, 300));
    }
    const hrefs = [...document.querySelectorAll('a[href^="/dashboard"]')].map((a) => a.getAttribute('href').split('?')[0]);
    return [...new Set(hrefs)].sort();
  })()`);
  console.log(`${role}: ${pages?.length ?? 0} pages`);
  for (const path of pages ?? []) {
    for (const viewport of viewports) {
      for (const theme of themes) {
        const [w, h, mobile] = sizes[viewport];
        await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile });
        await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: theme }, { name: 'prefers-reduced-motion', value: 'reduce' }] });
        await evaluate(`localStorage.setItem('theme', '${theme}')`);
        problems = [];
        await send('Page.navigate', { url: base + path });
        await sleep(wait);
        const screen = await evaluate(`(() => {
          const text = document.body?.innerText ?? '';
          const flags = [];
          if (text.includes('No se pudo cargar')) flags.push('error screen: ' + (document.querySelector('[role=alert]')?.innerText ?? '').replace(/\\s+/g, ' ').slice(0, 200));
          if (/Algo salió mal|Application error|Unhandled Runtime Error/.test(text)) flags.push('error boundary');
          const denied = /no tiene acceso|No tienes acceso|no puede ver/i.test(text);
          const overflow = document.documentElement.scrollWidth > window.innerWidth + 2;
          return { flags, denied, overflow, title: document.title };
        })()`);
        const issues = [...problems, ...(screen?.flags ?? [])];
        if (viewport === 'mobile' && screen?.overflow) issues.push('horizontal scroll on the phone');
        const file = `${role}-${path.replace(/^\/dashboard\/?/, '').replace(/\//g, '_') || 'home'}-${viewport}-${theme}.png`;
        if (viewport === 'desktop' && theme === 'light') {
          const shot = await send('Page.captureScreenshot', { format: 'png' });
          if (shot.result?.data) writeFileSync(join(out, file), Buffer.from(shot.result.data, 'base64'));
        }
        results.push({ role, path, viewport, theme, title: screen?.title ?? '', denied: Boolean(screen?.denied), issues });
        // Kept as it goes, so a stopped run still leaves what it saw
        writeFileSync(join(out, 'report.json'), JSON.stringify(results, null, 2));
        if (issues.length) console.log(`  ✗ ${path} ${viewport}/${theme}: ${issues[0]}`);
      }
    }
  }
}
stopBrowser();

const failed = results.filter((r) => r.issues.length);
const lines = [`# Recorrido por rol · ${type}`, '', `${results.length} vistas (${new Set(results.map((r) => r.role)).size} roles), ${failed.length} con problemas.`, ''];
for (const role of roles) {
  const mine = results.filter((r) => r.role === role);
  if (!mine.length) continue;
  const pagesOf = [...new Set(mine.map((r) => r.path))];
  lines.push(`## ${role}`, '', `${pagesOf.length} páginas, ${mine.filter((r) => r.issues.length).length} vistas con problemas.`, '');
  for (const r of mine.filter((x) => x.issues.length)) lines.push(`- \`${r.path}\` ${r.viewport}/${r.theme}: ${r.issues.join(' · ')}`);
  lines.push('');
}
writeFileSync(join(out, 'report.md'), lines.join('\n'));
writeFileSync(join(out, 'report.json'), JSON.stringify(results, null, 2));
console.log(`\n${results.length} views, ${failed.length} with problems → ${join(out, 'report.md')}`);
process.exit(failed.length ? 2 : 0);
