import { visit } from 'unist-util-visit';
import GithubSlugger from 'github-slugger';

// ==중요== → <mark> 하이라이트로 변환
export function remarkHighlight() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      const regex = /==([^=]+)==/g;
      if (!regex.test(node.value)) return;
      const parts = [];
      let last = 0;
      node.value.replace(/==([^=]+)==/g, (match, inner, offset) => {
        if (offset > last) parts.push({ type: 'text', value: node.value.slice(last, offset) });
        parts.push({ type: 'html', value: `<mark class="hl">${inner}</mark>` });
        last = offset + match.length;
        return match;
      });
      if (last < node.value.length) parts.push({ type: 'text', value: node.value.slice(last) });
      parent.children.splice(index, 1, ...parts);
    });
  };
}

// [[SUMMARY]] ... [[/SUMMARY]] 블록을 "한눈에 보기" 요약 박스로 변환한다.
// 사용법 (빈 줄 없이 한 문단으로 붙여 쓴다):
//   [[SUMMARY]]
//   <strong class="key">대상</strong>: 한부모가구
//   <strong class="key">금액</strong>: 월 20만원
//   [[/SUMMARY]]
// 마크다운 파서는 빈 줄이 없는 연속된 줄을 하나의 문단(paragraph) 노드로 합치고,
// 그 안의 <strong class="key">...</strong>는 html 인라인 노드로, 나머지는 text 노드로 쪼갠다.
// 따라서 문단을 블록 단위가 아니라 "줄바꿈 기준"으로 재조립해서 파싱한다.
// (6장 frontmatter의 대상/금액/조건 섹션에서 사용 — 글쓰기가이드 2장·6장 참고)
export function remarkSummaryBox() {
  return (tree) => {
    visit(tree, 'paragraph', (node, index, parent) => {
      if (!parent) return;

      // 문단 내 인라인 노드를 순서대로 이어붙인 뒤 줄바꿈으로 다시 분리한다.
      const raw = node.children
        .map((c) => {
          if (c.type === 'html') return c.value;
          if (c.type === 'text') return c.value;
          if (c.type === 'break') return '\n';
          return '';
        })
        .join('');

      if (!raw.includes('[[SUMMARY]]') || !raw.includes('[[/SUMMARY]]')) return;

      const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);
      const startAt = lines.indexOf('[[SUMMARY]]');
      const endAt = lines.indexOf('[[/SUMMARY]]');
      if (startAt === -1 || endAt === -1 || endAt <= startAt) return;

      const itemLines = lines.slice(startAt + 1, endAt);
      const rows = [];

      itemLines.forEach((line) => {
        const match = line.match(/<strong class="key">([^<]+)<\/strong>\s*:\s*(.+)/);
        if (match) {
          rows.push(
            `<div class="summary-row"><span class="summary-k">${match[1]}</span><span class="summary-v">${match[2].trim()}</span></div>`
          );
        }
      });

      if (rows.length === 0) return;

      const boxHtml = `<div class="summary-box"><p class="summary-label">한눈에 보기</p>${rows.join('')}</div>`;
      parent.children.splice(index, 1, { type: 'html', value: boxHtml });
    });
  };
}

// **Q. 질문** 다음 줄에 A. 답변이 이어지는 FAQ 문단에서
// A 답변 부분만 <span class="faq-answer">로 감싸 hanging indent CSS를 걸 수 있게 한다.
// 두 가지 원본 표기를 모두 지원한다:
//   1) 하드 브레이크(줄 끝 `\`) — 파서가 [strong(Q), break, ...A인라인] 로 분리해줌
//   2) 그냥 줄바꿈(백슬래시 없음) — 파서가 [strong(Q), text("\nA. ...")] 로 합쳐서 넣음
// 두 경우 모두 최종적으로 <br />는 유지하고, A 텍스트만 span으로 감싼다.
// (2장 9번 FAQ 규칙 참고)
export function remarkFaq() {
  return (tree) => {
    visit(tree, 'paragraph', (node) => {
      const children = node.children;
      if (!children || children.length < 2) return;

      // 1번째 자식: **Q. ...** (strong)
      const first = children[0];
      if (first.type !== 'strong') return;

      const qText = first.children
        .map((c) => (c.type === 'text' ? c.value : ''))
        .join('');
      if (!qText.trim().startsWith('Q.')) return;

      const second = children[1];
      let breakNode;
      let rest;

      if (second.type === 'break') {
        // 케이스 1: 이미 break 노드로 분리돼 있음
        breakNode = second;
        rest = children.slice(2);
      } else if (second.type === 'text' && second.value.startsWith('\n')) {
        // 케이스 2: strong 바로 뒤 text 노드에 줄바꿈이 붙어 있음 → break를 직접 만들어 분리
        breakNode = { type: 'break' };
        const trimmedValue = second.value.replace(/^\n+/, '');
        rest = [{ ...second, value: trimmedValue }, ...children.slice(2)];
      } else {
        return;
      }

      const firstRestText =
        rest[0] && rest[0].type === 'text' ? rest[0].value : '';
      if (!firstRestText.trimStart().startsWith('A.')) return;

      // rest를 <span class="faq-answer"> 안에 넣기 위해 앞뒤로 html 래퍼 노드를 삽입한다.
      // (인라인 서식이 섞여 있어도 그대로 span의 자식으로 유지된다.)
      const spanOpen = { type: 'html', value: '<span class="faq-answer">' };
      const spanClose = { type: 'html', value: '</span>' };
      node.children = [first, breakNode, spanOpen, ...rest, spanClose];
    });
  };
}

// 헤딩에서 순수 텍스트만 추출
function headingText(node) {
  let text = '';
  visit(node, (child) => {
    if (child.type === 'text' || child.type === 'inlineCode') text += child.value;
  });
  return text;
}

// [[TOC]] 마커 자리에 목차(소제목 h2/h3 기반)를 그려넣는다.
// 소제목 링크의 id는 rehype-slug와 동일한 github-slugger로 생성해 정확히 일치시킨다.
// h2에는 순번(1, 2, 3...)을 매기고, h3는 번호 없이 하위 항목으로만 표시한다.
// 같은 번호를 본문의 h2 헤딩에도 data-num 속성으로 심어서 "목차 번호 = 본문 소제목 번호"가 되게 한다.
// ⚠️ 번호를 헤딩의 텍스트 콘텐츠로 직접 넣지 않는다 — rehype-slug가 헤딩 텍스트를 기준으로
//    id(슬러그)를 만드는데, 텍스트에 숫자가 섞이면 TOC의 href와 실제 id가 어긋난다.
//    그래서 번호는 data 속성으로만 심고, 화면 표시는 CSS ::before로 처리한다.
// 목차 마크업은 스크롤스파이(현재 읽는 섹션 강조) + 진행바를 붙일 수 있도록
// 각 li에 data-toc-target(슬러그)을 심어둔다 — 실제 하이라이트 동작은 PostLayout의 스크립트가 담당.
// 소제목 번호를 두 자리로 통일한다 (1 → "01", 12 → "12").
function pad2(n) {
  return String(n).padStart(2, '0');
}

export function remarkInlineToc() {
  return (tree) => {
    const slugger = new GithubSlugger();
    const items = [];
    let h2Counter = 0;
    const h2Nodes = [];

    visit(tree, 'heading', (node) => {
      if (node.depth === 2 || node.depth === 3) {
        const text = headingText(node);
        const slug = slugger.slug(text);
        let number = null;
        if (node.depth === 2) {
          h2Counter += 1;
          number = pad2(h2Counter);
          h2Nodes.push(node);
        }
        items.push({ depth: node.depth, text, slug, number });
      }
    });

    // 소제목이 2개 미만이면 목차 자체를 안 그리므로, 헤딩 번호도 매기지 않는다(일관성 유지).
    if (items.length >= 2) {
      h2Nodes.forEach((node, i) => {
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties['data-num'] = pad2(i + 1);
      });
    }

    visit(tree, 'paragraph', (node, index, parent) => {
      if (
        node.children.length === 1 &&
        node.children[0].type === 'text' &&
        node.children[0].value.trim() === '[[TOC]]'
      ) {
        if (items.length < 2) {
          // 소제목이 2개 미만이면 목차 없이 마커만 제거
          parent.children.splice(index, 1);
          return;
        }
        const lis = items
          .map((it) => {
            if (it.depth === 3) {
              return `<li class="toc-item sub" data-toc-target="${it.slug}"><a href="#${it.slug}">${it.text}</a></li>`;
            }
            return `<li class="toc-item" data-toc-target="${it.slug}"><span class="toc-num">${it.number}</span><a href="#${it.slug}">${it.text}</a></li>`;
          })
          .join('');
        const html =
          '<nav class="toc" aria-label="목차" data-toc-root>' +
          '<div class="toc-header">' +
          '<span class="toc-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg></span>' +
          '<span class="toc-title">목차</span>' +
          '<span class="toc-hint">클릭해서 이동</span>' +
          '</div>' +
          '<div class="toc-body">' +
          '<div class="toc-track"></div>' +
          '<div class="toc-progress" data-toc-progress></div>' +
          `<ol class="toc-list">${lis}</ol>` +
          '</div>' +
          '</nav>';
        parent.children.splice(index, 1, { type: 'html', value: html });
      }
    });
  };
}

// > 📌 3줄 요약
// >
// > 1. ...
// > 2. ...
// > 3. ...
//
// 형태의 blockquote를 감지해 "3줄 요약" 전용 박스(.tldr-box)로 변환한다.
// 일반 인용구(blockquote)를 재활용하는 대신 완전히 별도 마크업을 그려서,
// 나중에 진짜 인용구(예: 정부 발표 원문)를 쓰더라도 스타일이 충돌하지 않게 한다.
// 리스트 항목은 순서 목록(1. 2. 3.)이든 불릿 목록(-)이든 둘 다 인식하되,
// 화면에는 항상 불릿(•)으로 통일해서 그린다(2026-07-20 결정 — 3장 참고).
export function remarkTldrBox() {
  return (tree) => {
    visit(tree, 'blockquote', (node, index, parent) => {
      if (!parent || !node.children || node.children.length < 2) return;

      const firstPara = node.children[0];
      if (firstPara.type !== 'paragraph') return;
      const headerText = firstPara.children
        .map((c) => (c.type === 'text' ? c.value : ''))
        .join('')
        .trim();
      if (!headerText.includes('3줄 요약')) return;

      const listNode = node.children.find((c) => c.type === 'list');
      if (!listNode || !listNode.children || listNode.children.length === 0) return;

      const items = listNode.children.map((li) => {
        // 리스트 항목 안의 인라인 서식(강조 등)을 그대로 살리기 위해
        // 텍스트를 직접 뽑지 않고 mdast-to-html 변환 없이 즉석에서 HTML로 직렬화한다.
        const inlineHtml = (li.children || [])
          .filter((c) => c.type === 'paragraph')
          .flatMap((p) => p.children)
          .map((c) => inlineToHtml(c))
          .join('');
        return `<li>${inlineHtml}</li>`;
      });

      const boxHtml =
        '<div class="tldr-box">' +
        '<div class="tldr-header"><span class="tldr-badge">' +
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10"></path><path d="M18 20V4"></path><path d="M6 20v-4"></path></svg>' +
        '3줄 요약</span></div>' +
        `<ul class="tldr-list">${items.join('')}</ul>` +
        '</div>';

      parent.children.splice(index, 1, { type: 'html', value: boxHtml });
    });
  };
}

// mdast 인라인 노드를 최소 HTML로 직렬화한다(3줄 요약 안의 **굵게** 등 간단한 서식 지원용).
function inlineToHtml(node) {
  if (!node) return '';
  if (node.type === 'text') return node.value;
  if (node.type === 'html') return node.value;
  if (node.type === 'break') return '<br />';
  if (node.type === 'strong') {
    return `<strong>${(node.children || []).map(inlineToHtml).join('')}</strong>`;
  }
  if (node.type === 'emphasis') {
    return `<em>${(node.children || []).map(inlineToHtml).join('')}</em>`;
  }
  if (node.type === 'inlineCode') return `<code>${node.value}</code>`;
  if (node.children) return node.children.map(inlineToHtml).join('');
  return '';
}
