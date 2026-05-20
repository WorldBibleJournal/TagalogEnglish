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

  // For static button, just show Book + Chapter (no verses)
  const staticText = `${bookData.engBook} ${bookData.chapter} — ${shareLink}`;
  const staticUrl = encodeURIComponent(shareLink);
  const staticBtn = `
    <a href="https://www.facebook.com/sharer/sharer.php?u=${staticUrl}" 
       onclick="window.open(this.href, 'fbshare', 'width=600,height=400'); return false;"
       style="color: blue; text-decoration: underline;">
       Share (${bookData.tlBook}) ${bookData.engBook} ${bookData.chapter} on Facebook
    </a>
    <a href="https://x.com/intent/tweet?text=Read+${bookData.engBook}+${bookData.chapter}&url=${staticUrl}&hashtags=BibleOnlineReader&via=angpagibigngdios&related=%40angpagibigngdios" 
       onclick="window.open(this.href, 'twshare', 'width=600,height=400'); return false;">
       Share (${bookData.tlBook}) ${bookData.engBook} ${bookData.chapter} on X (Twitter)
    </a>
  `;

  // Dynamic button: only if verses are selected
  let dynamicBtn = '';
  if (item) {
    const dynamicUrl = encodeURIComponent(item.link);
    dynamicBtn = `
      <a href="https://www.facebook.com/sharer/sharer.php?u=${dynamicUrl}" 
         onclick="window.open(this.href, 'fbshare', 'width=600,height=400'); return false;"
         style="color: blue; text-decoration: underline;">
         Share (${item.tlBook}) ${item.engBook} ${item.chapter}:${item.verse} on Facebook
      </a>
      <a href="https://x.com/intent/tweet?text=Read+${item.engBook}+${item.chapter}+${item.verse}&url=${dynamicUrl}&hashtags=BibleOnlineReader&via=angpagibigngdios&related=%40angpagibigngdios" 
         onclick="window.open(this.href, 'twshare', 'width=600,height=400'); return false;">
         Share (${item.tlBook}) ${item.engBook} ${item.chapter}:${item.verse} on X (Twitter)
      </a>
    `;
  }

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
