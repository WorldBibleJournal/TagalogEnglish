// ✅ Helper: encode text for Twitter (spaces → +)
function encodeForTwitter(text) {
  return encodeURIComponent(text).replace(/%20/g, '+');
}

function getBookChapterFromTitle() {
  const fullTitle = document.title || '';
  const match = fullTitle.match(/^\((.*?)\)\s*(.*?)\s+(\d+)$/);

  if (!match) return null;

  const tlBook = match[1].trim();   // Tagalog book name
  const engBook = match[2].trim();  // English book name
  const chapter = match[3].trim();  // Chapter number (string)

  return {
    tlBook,
    engBook,
    chapter,                        // "1"
    chapterNumber: parseInt(chapter, 10), // 1
    chapterLink: `${engBook.replace(/\s+/g, '')}${chapter}` // "Mark1"
  };
}
function buildShareItem() {
  const input = document.getElementById('verseInput');
  if (!input) return null;

  const verses = input.value.trim();
  if (!verses) return null;

  const bookData = getBookChapterFromTitle();
  if (!bookData) return null;

  // ✅ Normalize verses for URL
  const normalized = normalizeVerses(verses);

  const baseUrl = window.location.origin + window.location.pathname;
  const shareLink = `${baseUrl}#verse-${normalized}`;

  return {
    chapter: bookData.chapter,
    chapterNumber: bookData.chapterNumber,
    chapterLink: bookData.chapterLink,
    verse: verses, // keep original for display
    engBook: bookData.engBook,
    tlBook: bookData.tlBook,
    link: shareLink,
    text: `Read ${bookData.engBook} ${bookData.chapter} : ${verses} — ${shareLink}`
  };
}



function normalizeVerses(rawInput) {
  // Trim and split by spaces
  const parts = rawInput.trim().split(/\s+/);
  // Join back with spaces so the hash looks like "1 3 5-7 10"
  return parts.join('%20');
}




function renderShareButtons() {
  const item = buildShareItem();
  const container = document.getElementById('shareBibleVerse');
  if (!container) return;

  const bookData = getBookChapterFromTitle();
  if (!bookData) return;

  const shareLink = window.location.href;
  const staticUrl = encodeURIComponent(shareLink);

  // ✅ Static button: Book + Chapter
  const staticText = `Read ${bookData.engBook} ${bookData.chapter}`;
  const staticTwitterText = encodeForTwitter(staticText);
  const staticBtn = `
<div id="sharestaticholder">

<div class="facebookstatic">
    <a href="https://www.facebook.com/sharer/sharer.php?u=${staticUrl}" 
       onclick="window.open(this.href, 'fbshare', 'width=600,height=400'); return false;"
       style="color: blue; text-decoration: underline;">

         <div class="iconholder"><img class="svgmedia" src="../Assets/images/facebookogimage/myfacebookshare.svg"></div>

      <div class="socialmessage">
          Link so your friends may read:<br/>
     (${bookData.tlBook}) ${bookData.engBook} ${bookData.chapter}
      </div>

    </a>
</div>

<div class="twitterstatic">
    <a href="https://twitter.com/intent/tweet?text=${staticTwitterText}&hashtags=BibleReadingOnline,%20BibleVerse&via=pagibigngdios&url=${staticUrl}"  onclick="window.open(this.href, 'twshare', 'width=600,height=400'); return false;">
    
           <div class="iconholder"><img class="svgmedia" src="../Assets/images/facebookogimage/mytwittershare.svg"></div>

      <div class="socialmessage">
    Link so your friends may read:<br/>
    (${bookData.tlBook}) ${bookData.engBook} ${bookData.chapter}
          </div>
    
    </a>
</div>

</div>

  `;

// ✅ Dynamic button: Book + Chapter + Verse(s)
let dynamicBtn = '';
if (item) {
  const dynamicUrl = encodeURIComponent(item.link);
const dynamicText = `Read ${item.engBook} ${item.verse}`;
const dynamicTwitterText = encodeForTwitter(dynamicText);

  dynamicBtn = `

  <div id="sharedynamicholder">

<div class="facebookstatic">


  <a href="https://www.facebook.com/sharer/sharer.php?u=${dynamicUrl}" 
     onclick="window.open(this.href, 'fbshare', 'width=600,height=400'); return false;"
     style="color: blue; text-decoration: underline;">

         <div class="iconholder"><img class="svgmedia" src="../Assets/images/facebookogimage/myfacebookshare.svg"></div>

      <div class="socialmessage">
         The Link to this verse can be shared:<br/>
   (${item.tlBook}) ${item.engBook} ${item.verse} 

     </div>

  </a>

</div>

<div class="twitterstatic">

  <a href="https://twitter.com/intent/tweet?text=${dynamicTwitterText}&hashtags=BibleReadingOnline,BibleVerse&via=pagibigngdios&url=${dynamicUrl}" 
     onclick="window.open(this.href, 'twshare', 'width=600,height=400'); return false;">
     
     
     
  
      <div class="iconholder"><img class="svgmedia" src="../Assets/images/facebookogimage/mytwittershare.svg"></div>

      <div class="socialmessage">
    The Link to this verse can be tweeted:<br/>

     (${item.tlBook}) ${item.engBook} ${item.verse}



           </div>
    
    </a>
</div>

</div>


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






function updateOgTag(property, value) {
  let metaTag = document.querySelector(`meta[property='${property}']`);
  if (!metaTag) {
    metaTag = document.createElement("meta");
    metaTag.setAttribute("property", property);
    document.head.appendChild(metaTag);
  }
  metaTag.setAttribute("content", value);
}

function refreshHeaderDisplay() {
  const inputField = document.getElementById('verseInput');
  const displayDiv = document.getElementById('display-title2');

  if (!inputField || !displayDiv) return;

  let rawInput = inputField.value.trim();

  // Update URL hash
  if (rawInput) {
    window.location.hash = 'verse-' + rawInput;
  } else {
    history.replaceState(null, null, ' ');
  }

  // Format verse text
  let cleanInput = decodeURIComponent(rawInput)
    .replace(/[,\s]+/g, ',\u00A0')
    .replace(/-/g, '\u00A0\u2014\u00A0');

  let verseDisplay = rawInput
    ? `\u00A0\u00A0:\u00A0\u00A0${cleanInput}`
    : '';

  // Browser tab title
  document.title = rawInput
    ? `${originalTitle} : ${rawInput}`
    : originalTitle;

  // Visible header
  displayDiv.innerHTML = `${originalTitle}${verseDisplay}`;

  // ✅ Update OG tags dynamically
  updateOgTag("og:title", document.title);

  const newDescription = rawInput
    ? `Read Online Bible @WorldBibleJournal — ${originalTitle} ${rawInput}`
    : `Read Online Bible @WorldBibleJournal`;

  updateOgTag("og:description", newDescription);

  // ✅ Update og:url with current link
  const shareLink = window.location.href;
  updateOgTag("og:url", shareLink);
}
