function getBookChapterFromTitle() {
  const fullTitle = document.title || '';
  const match = fullTitle.match(/^\((.*?)\)\s*(.*?)\s+(\d+)$/);

  if (!match) return null;

  return {
    tlBook: match[1].trim(),   // Tagalog book name
    engBook: match[2].trim(),  // English book name
    chapter: match[3].trim()   // Chapter number
  };
}

function buildShareItem() {
  const input = document.getElementById('verseInput');
  if (!input) return null;

  const verses = input.value.trim();
  if (!verses) return null;

  const bookData = getBookChapterFromTitle();
  if (!bookData) return null;

  const shareLink = window.location.href;

  return {
    chapter: bookData.chapter,
    verse: verses,
    engBook: bookData.engBook,
    tlBook: bookData.tlBook,
    link: shareLink,
    text: `${bookData.engBook} ${bookData.chapter}:${verses} — ${shareLink}`
  };
}

function renderShareButtons() {
  const item = buildShareItem();
  const container = document.getElementById('shareBibleVerse');
  if (!container) return;

  const bookData = getBookChapterFromTitle();
  if (!bookData) return;

  const shareLink = window.location.href;

  // Static button: always shows Book + Chapter
  const staticText = `${bookData.engBook} ${bookData.chapter} — ${shareLink}`;
  const staticTwitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(staticText)}`;
  const staticBtn = `
    <a href="${staticTwitterUrl}" target="_blank" class="share-button">
      Share ${bookData.engBook} ${bookData.chapter}
    </a>
  `;

  // Dynamic button: only shows if verses are selected
  let dynamicBtn = '';
  if (item) {
    const dynamicTwitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(item.text)}`;
    dynamicBtn = `
      <a href="${dynamicTwitterUrl}" target="_blank" class="share-button">
        Share ${item.engBook} ${item.chapter}:${item.verse}
      </a>
    `;
  }

  // Render both
  container.innerHTML = staticBtn + (dynamicBtn ? `<br>${dynamicBtn}` : '');
}

// ✅ Run once when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  renderShareButtons();

  const input = document.getElementById('verseInput');
  if (input) {
    input.addEventListener('input', renderShareButtons);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        renderShareButtons();
      }
    });
  }

  window.addEventListener('hashchange', renderShareButtons);
});
