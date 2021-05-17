const songCount = document.querySelector(".playlist_count");
const artistList = document.querySelector(".playlist__artists");
const titleList = document.querySelector(".playlist_titles");
const playlist = document.querySelector(".playlist");

db.collection("peeps")
  .get()
  .then((peeps) => {
    const songs = [];

    peeps.forEach((peep) => {
      const peepData = peep.data();

      if (peepData.songs) {
        peepData.songs.forEach((song) => {
          if (songs.length > 0) {
            let foundSongAt = null;

            songs.forEach((checkSong, i) => {
              if (checkSong.artist.toLowerCase() === song.artist.toLowerCase() && checkSong.title.toLowerCase() === song.title.toLowerCase()) {
                foundSongAt = i;
              }
            });

            if (foundSongAt || foundSongAt === 0) {
              songs[foundSongAt].count = songs[foundSongAt].count + 1;
            } else {
              songs.push({ ...song, count: 1 });
            }
          } else {
            songs.push({ ...song, count: 1 });
          }
        });
      }
    });

    songs.forEach((displaySong) => {
      let row = playlist.insertRow();
      let count = row.insertCell(0);
      count.innerHTML = displaySong.count;

      let title = row.insertCell(1);
      title.innerHTML = displaySong.title || "-";

      let artist = row.insertCell(2);
      artist.innerHTML = displaySong.artist || "-";
    });
  });
