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
  const staticurl = `${shareLink}`;
  const encodeuricomponent = `${encodeURIComponent(staticurl)}`;
  const twitterintent = `Read+${bookData.engBook}+${bookData.chapter}:${verses}`;
  const staticBtn = `a href="https://www.facebook.com/sharer/sharer.php?u=${encodeuricomponent}" onclick="window.open(this.href, 'fbshare', 'width=600,height=400'); return false;" style="color: blue; text-decoration: underline;"> Share (${bookData.tlBook}) ${bookData.engBook} ${bookData.chapter}:${verses} on Facebook </a>
 
    <a href="https://x.com/intent/tweet?text=${twitterintent}&url=${encodeuricomponent}&hashtags=BibleOnlineReader&via=angpagibigngdios&related=%40angpagibigngdios" onclick="window.open(this.href, 'twshare', 'width=600,height=400'); return false;">
     Share (${bookData.tlBook}) ${bookData.engBook} ${bookData.chapter}:${verses} on X (TWITTER)</a>
   `;

  // Dynamic button: only shows if verses are selected
  let dynamicBtn = '';
  if (item) {
const dynamicUrl = encodeURIComponent(item.link);
    dynamicBtn = `
 <a href="https://www.facebook.com/sharer/sharer.php?u=${dynamicUrl}" onclick="window.open(this.href, 'fbshare', 'width=600,height=400'); return false;"
       style="color: blue; text-decoration: underline;">
       Share (${bookData.tlBook}) ${bookData.engBook} ${bookData.chapter}:${verses} on Facebook
    </a>
 
    <a href="https://x.com/intent/tweet?text=${twitterintent}&url=${encodeuricomponent}&hashtags=BibleOnlineReader&via=angpagibigngdios&related=%40angpagibigngdios" onclick="window.open(this.href, 'twshare', 'width=600,height=400'); return false;">
     Share (${bookData.tlBook}) ${bookData.engBook} ${bookData.chapter}:${verses} on X (TWITTER)
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
