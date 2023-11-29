const currentDate = new Date();

function countDay() { //연속 풀이 날
  let stringCurrent = String(currentDate.getFullYear()) + String(currentDate.getMonth() + 1) + String(currentDate.getDate());
  let nextDateTimestamp = currentDate.getTime() + 24 * 60 * 60 * 1000;
  let nextDate = new Date(nextDateTimestamp);
  let stirngNext = String(nextDate.getFullYear()) + String(nextDate.getMonth() + 1) + String(nextDate.getDate());

  chrome.storage.sync.get(["nextday"], (result) => { 
    if (result.nextday == stringCurrent) { //연속된다면
      chrome.storage.sync.set({ nextday: stirngNext });
      chrome.storage.sync.get(["combo"], (result) => {
        chrome.storage.sync.set({ combo: result.combo + 1 });
        console.log(result.combo + 1);
        createModal(true, result.combo + 1);
      });
    } else {
      chrome.storage.sync.set({ nextday: stirngNext });
      chrome.storage.sync.set({ combo: 1 });
      createModal(true, 1);
    }
  });
}

