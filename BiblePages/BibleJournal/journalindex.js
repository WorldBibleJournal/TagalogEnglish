// =========================
// MULTIPLE RANDOM POSTS
// =========================

const jsonUrlMulti = 'BiblePages/BibleJournal/binderposts.json';

const containerMulti =
  document.getElementById('journalholder');

async function loadPostsMulti() {

  if (!containerMulti) return;

  try {

    const response = await fetch(jsonUrlMulti);
    const posts = await response.json();

    containerMulti.innerHTML = '';

    const shuffled =
      [...posts].sort(() => 0.5 - Math.random());

    const count =
      Math.floor(Math.random() * (20 - 10 + 1)) + 10;

    const selected = shuffled.slice(0, count);

    selected.forEach(post => {

      const htmlTemplate = `
        <a href="BiblePages/BibleJournal/${post.bibjl}.html">
          <div class="biblejournalposts">
            <span class="journalnumber">
              Bible Journal - ${post.bibjn}
            </span>

            <span class="journaltitle">
              ${post.bibjt}
            </span>
          </div>
        </a>
      `;

      containerMulti.insertAdjacentHTML(
        'beforeend',
        htmlTemplate
      );

    });

  } catch (error) {

    containerMulti.innerHTML =
      '<p>Error loading posts.</p>';

    console.error(error);

  }
}

loadPostsMulti();



// =========================
// SINGLE RANDOM POST
// =========================

const jsonUrlSingle = 'BiblePages/BibleJournal/binderposts.json';

const containerSingle =
  document.getElementById('journalholder1');

async function loadPostsSingle() {

  if (!containerSingle) return;

  try {

    const response = await fetch(jsonUrlSingle);
    const posts = await response.json();

    containerSingle.innerHTML = '';

    const randomIndex =
      Math.floor(Math.random() * posts.length);

    const post = posts[randomIndex];

    const htmlTemplate = `
      <a href="BiblePages/BibleJournal/${post.bibjl}.html">
        <div class="biblejournalposts">
          <span class="journalnumber">
            Bible Journal - ${post.bibjn}
          </span>

          <span class="journaltitle">
            ${post.bibjt}
          </span>
        </div>
      </a>
    `;

    containerSingle.insertAdjacentHTML(
      'beforeend',
      htmlTemplate
    );

  } catch (error) {

    containerSingle.innerHTML =
      '<p>Error loading posts.</p>';

    console.error(error);

  }
}

loadPostsSingle();
document.addEventListener("DOMContentLoaded", () => {
  const jsonUrl = "BiblePages/BibleJournal/binderposts.json";
  const holderAll = document.getElementById("journalholderDesktop");
  const holderRandom = document.getElementById("journalholder1Desktop");
  const holderSuggestion = document.getElementById("journalholdersuggestion");

  // Helper function to build the HTML string for a template post
  function createPostHTML(post) {
    const linkName = post.bibjl === "binder" ? "binder" : post.bibjl;
    return `
      <a href="BiblePages/BibleJournal/${linkName}.html">
        <div class="biblejournalposts">
          <span class="journalnumber">
            Bible Journal - ${post.bibjn}
          </span>
          <span class="journaltitle">
            ${post.bibjt}
          </span>
        </div>
      </a>
    `;
  }

  // Simple shuffle function
  function shuffleArray(array) {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  // Fetch and process the JSON file
  fetch(jsonUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load json: ${response.status}`);
      }
      return response.json();
    })
    .then(posts => {
      if (!posts || posts.length === 0) return;

      // Shuffle posts before using them
      const shuffledPosts = shuffleArray(posts);

      // 1. Display all items in random order inside #journalholderDesktop
      let allPostsHTML = "";
      shuffledPosts.forEach(post => {
        allPostsHTML += createPostHTML(post);
      });
      if (holderAll) holderAll.innerHTML = allPostsHTML;

      if (holderSuggestion) holderSuggestion.innerHTML = allPostsHTML;

      // 2. Pick exactly one random post for #journalholder1Desktop
      if (holderRandom) {
        const randomIndex = Math.floor(Math.random() * shuffledPosts.length);
        const randomPost = shuffledPosts[randomIndex];
        holderRandom.innerHTML = createPostHTML(randomPost);
      }
    })
    .catch(error => {
      console.error("Error loading bible journal posts:", error);
    });
});
