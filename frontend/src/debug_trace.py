from playwright.sync_api import sync_playwright
import json
# Login credentials are used locally only (dev env .env) and are never printed.
ADMIN_USER = "bluconnetnews"
ADMIN_PASS = "bluconnetmedia@2026"
TITLES = ["gffdggfd", "sgfedfds", "dsfssf"]

def parent_chain(el_handle):
    chain = []
    n = el_handle.evaluate_handle("e => e.parentElement")
    try:
        while True:
            info = n.evaluate("el => ({ tag: el.tagName, className: el.className || '', id: el.id || '', hasParent: !!el.parentElement, parentTag: el.parentElement ? el.parentElement.tagName : null }))")
            chain.append(info)
            if not info["hasParent"]:
                break
            n = n.evaluate_handle("el => el.parentElement")
    except Exception:
        pass
    return chain

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    pg = b.new_page()
    pg.set_default_timeout(15000)
    try:
        pg.goto("http://localhost:3000/login", wait_until="networkidle")
        pg.wait_for_timeout(2000)
        pg.get_by_placeholder("Enter username").fill(ADMIN_USER)
        pg.get_by_placeholder("Enter password").fill(ADMIN_PASS)
        pg.get_by_role("button", name="Sign In").click()
        pg.wait_for_timeout(8000)
        print("URL:", pg.url)

        out = {}
        # Heading
        h2s = pg.query_selector_all("h2")
        heading = None
        for h in h2s:
            t = h.inner_text()
            if "Manage Existing News" in t:
                heading = h
                break
        out["heading"] = heading.inner_text() if heading else None
        out["headingOuterHTML"] = heading.evaluate("e => e.outerHTML") if heading else None
        if heading:
            out["headingParentChain"] = parent_chain(heading)

        # Cards
        out["cards"] = {}
        for t in TITLES:
            nodes = pg.query_selector_all("div")
            deepest = []
            for d in nodes:
                try:
                    if t not in d.inner_text():
                        continue
                    contained = False
                    for d2 in nodes:
                        if d2 is d:
                            continue
                        try:
                            if d2.contains(d):
                                contained = True
                                break
                        except Exception:
                            pass
                    if not contained:
                        deepest.append(d)
                except Exception:
                    pass
            entries = []
            for d in deepest:
                entries.append({
                    "outerHTML": d.evaluate("e => e.outerHTML")[:400],
                    "chain": parent_chain(d),
                })
            out["cards"][t] = entries

        # React fiber: find AdminNews component and read its hook state (newsList)
        fiber_info = pg.evaluate("""() => {
          const safe = (v) => { try { return JSON.stringify(v); } catch(e) { return String(v); } };
          let containerFiber = null;
          for (const el of document.querySelectorAll('div, body')) {
            for (const k of Object.keys(el)) {
              if (k.startsWith('__reactContainer$')) { containerFiber = el[k]; break; }
            }
            if (containerFiber) break;
          }
          const result = { containerFound: !!containerFiber, adminNewsFound: false };
          let adminNewsFiber = null;
          if (!containerFiber) return result;
          const seen = new Set();
          const queue = [containerFiber];
          while (queue.length) {
            const f = queue.shift();
            if (!f || seen.has(f)) continue;
            seen.add(f);
            const t = f.type;
            const tname = t && (t.displayName || t.name || '');
            if (tname === 'AdminNews') { result.adminNewsFound = true; adminNewsFiber = f; break; }
            if (f.child) queue.push(f.child);
            if (f.sibling) queue.push(f.sibling);
          }
          if (result.adminNewsFound) {
            const hooks = [];
            let h = adminNewsFiber.memoizedState;
            let i = 0;
            const hseen = new Set();
            while (h && i < 16 && !hseen.has(h)) {
              hseen.add(h);
              hooks.push({ index: i, memoizedState: safe(h.memoizedState) });
              h = h.next;
              i++;
            }
            result.adminNewsHooks = hooks;
          } else {
            result.adminNewsError = 'AdminNews fiber not found; scanned ' + seen.size + ' fibers';
          }
          return result;
        }""")
        out["fiber"] = fiber_info
        print(json.dumps(out, indent=1)[:5000])
    except Exception as e:
        print('ERR', type(e).__name__, str(e)[:900])
    finally:
        b.close()