const container = document.querySelector(".container");
const card = document.querySelector(".container__card");
const cardBack = document.querySelector(".container__card__back");
const cardError = document.querySelector(".container__card__error");
const cardInput = document.querySelector(".container__card__nameInput");
const graphic = document.querySelector(".container__card__graphics__graphic");
const sky = document.querySelector(".container__card__graphics__sky");
const graphicLast = document.querySelector(".container__card__graphics__graphicLast");
const skyLast = document.querySelector(".container__card__graphics__skyLast");
const help = document.querySelector(".container__card__help");
const rsvpButton = document.querySelector(".container__card__button");
const playlistCard = document.querySelector(".container__playlistEntryCard");
const loadingRing = document.querySelector(".container__card__loading");
const playlistHeading = document.querySelector(".container__playlistEntryCard__heading");
const lastCard = document.querySelector(".container__lastCard");
const skipButton = document.querySelector(".container__card__button__skip");

let cardFlipped = false;
let user = null;
let userId = null;

container.addEventListener("mousemove", (e) => {
  let xAxis = window.innerWidth / 2 - e.pageX;
  let yAxis = window.innerHeight / 2 - e.pageY;
  if (!cardFlipped) {
    card.style.transform = `rotateY(${yAxis / 25}deg) rotateX(${xAxis / 25}deg)`;

    graphic.style.transform = `rotateY(${yAxis / 10}deg) rotateX(${xAxis / 10}deg) translateZ(50px)`;
    sky.style.transform = `rotateY(${yAxis / 15}deg) rotateX(${xAxis / 15}deg) translateZ(25px)`;
  }

  lastCard.style.transform = `rotateY(${yAxis / 25}deg) rotateX(${xAxis / 25}deg)`;
  graphicLast.style.transform = `rotateY(${yAxis / 10}deg) rotateX(${xAxis / 10}deg) translateZ(50px)`;
  skyLast.style.transform = `rotateY(${yAxis / 15}deg) rotateX(${xAxis / 15}deg) translateZ(25px)`;
});

container.addEventListener("mouseenter", (e) => {
  if (!cardFlipped) {
    card.style.transition = `none`;
    graphic.style.transition = `none`;
    sky.style.transition = `none`;
  }

  lastCard.style.transition = `none`;
  graphicLast.style.transition = `none`;
  skyLast.style.transition = `none`;
});

container.addEventListener("mouseleave", (e) => {
  if (!cardFlipped) {
    card.style.transform = `rotateY(0deg) rotateX(0deg)`;
    graphic.style.transform = `rotateY(0deg) rotateX(0deg) translateZ(0)`;
    sky.style.transform = `rotateY(0deg) rotateX(0deg) translateZ(0)`;

    card.style.transition = `all 0.5s ease`;
    graphic.style.transition = `all 0.5s ease`;
    sky.style.transition = `all 0.5s ease`;
  }

  lastCard.style.transform = `rotateY(0deg) rotateX(0deg)`;
  graphicLast.style.transform = `rotateY(0deg) rotateX(0deg) translateZ(0)`;
  skyLast.style.transform = `rotateY(0deg) rotateX(0deg) translateZ(0)`;

  lastCard.style.transition = `all 0.5s ease`;
  graphicLast.style.transition = `all 0.5s ease`;
  skyLast.style.transition = `all 0.5s ease`;
});

help.addEventListener("click", (e) => {
  cardFlipped = true;
  card.style.transition = `all 0.5s ease`;
  cardBack.style.transition = `all 0.5s ease`;
  graphic.style.transform = `rotateY(0deg) rotateX(0deg) translateZ(0)`;
  sky.style.transform = `rotateY(0deg) rotateX(0deg) translateZ(0)`;

  card.style.transform = "rotateY(-180deg)";
  cardBack.style.transform = "rotateY(0deg)";
});

cardBack.addEventListener("click", (e) => {
  cardFlipped = false;

  card.style.transition = `all 0.5s ease`;
  cardBack.style.transition = `all 0.5s ease`;

  card.style.transform = "rotateY(-0deg)";
  cardBack.style.transform = "rotateY(180deg)";
});

cardInput.addEventListener("input", (e) => {
  cardError.hidden = true;
  cardError.innerText = "";
});

//SAVING DATA
card.addEventListener("submit", (e) => {
  e.preventDefault();
  loadingRing.hidden = false;

  if (card.emailAddress.value.includes("@kandua.com")) {
    db.collection("peeps")
      .where("email", "==", card.emailAddress.value)
      .get()
      .then((foundPeep) => {
        const { docs } = foundPeep;
        if (docs.length === 0) {
          db.collection("peeps")
            .add({
              email: card.emailAddress.value,
            })
            .then((res) => {
              userId = res.id;
              card.style.display = "none";
              playlistCard.style.display = "flex";
            });
        } else {
          loadingRing.hidden = true;
          user = foundPeep.docs[0];
          userId = foundPeep.docs[0].id;
          playlistHeading.innerHTML = "You've already RSVP'd";

          const songs = foundPeep.docs[0].data().songs;

          if (songs && songs.length > 0) {
            songs.forEach((song, i) => {
              const title = document.getElementById(`title${i}`);
              const artist = document.getElementById(`artist${i}`);

              title.value = song.title;
              artist.value = song.artist;
            });
          }
          card.style.display = "none";
          playlistCard.style.display = "flex";
        }
      });
  } else {
    cardError.innerText = "You can only RSVP using your Kandua email address";
    cardError.hidden = false;
    loadingRing.hidden = true;
  }
});

playlistCard.addEventListener("submit", (e) => {
  e.preventDefault();
  let songs = [];
  loadingRing.hidden = false;

  for (let i = 0; i < 6; i++) {
    const title = document.getElementById(`title${i}`);
    const artist = document.getElementById(`artist${i}`);

    if (title.value || title.value) {
      songs.push({
        title: title.value,
        artist: artist.value,
      });
    }
  }

  db.collection("peeps")
    .doc(userId)
    .update({
      songs,
    })
    .then(() => {
      loadingRing.hidden = true;
      playlistCard.style.display = "none";
      lastCard.style.display = "flex";
    });
});

skipButton.addEventListener("click", (e) => {
  e.preventDefault();
  loadingRing.hidden = true;
  playlistCard.style.display = "none";
  lastCard.style.display = "flex";
});
