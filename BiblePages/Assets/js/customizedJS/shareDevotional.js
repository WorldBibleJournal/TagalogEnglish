function renderDevotionalButton() {
  const container = document.getElementById('shareDevotional');
  if (!container) return;

  // Grab the page title (e.g. "May 23 - Evening Devotion by Charles Spurgeon")
  const devotionalTitle = document.title;

  // Current page link
  const shareLink = window.location.href;
  const encodedUrl = encodeURIComponent(shareLink);

  // Encode title for Twitter
  const twitterText = encodeURIComponent(`Read ${devotionalTitle}`);

  // Build static buttons
  const staticBtn = `
    <div id="sharestaticholder">

      <div class="facebookstatic">
        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" 
           onclick="window.open(this.href, 'fbshare', 'width=600,height=400'); return false;"
           style="color: blue; text-decoration: underline;">
           
           <div class="iconholder">
             <img class="svgmedia" src="../Assets/images/facebookogimage/myfacebookshare.svg">
           </div>
           <div class="socialmessage">
             Share this devotional:<br/>
             ${devotionalTitle}
           </div>
        </a>
      </div>

      <div class="twitterstatic">
        <a href="https://twitter.com/intent/tweet?text=${twitterText}&hashtags=DailyDevotion,BibleVerse&via=WBibleJournal&url=${encodedUrl}" 
           onclick="window.open(this.href, 'twshare', 'width=600,height=400'); return false;">
           
           <div class="iconholder switch1order">
             <img class="svgmedia" src="../Assets/images/facebookogimage/mytwittershare.svg">
           </div>
           <div class="socialmessage switch2order">
             Tweet this devotional:<br/>
             ${devotionalTitle}
           </div>
        </a>
      </div>

    </div>
  `;

  // Render into container
  container.innerHTML = staticBtn;
}


// Wrap your call in an event listener
document.addEventListener('DOMContentLoaded', () => {
  renderDevotionalButton();
});