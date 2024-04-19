import http from "k6/http";
import { sleep, check } from "k6";

export let options = {
    stages: [
      { duration: "1m", target: 1 },
      { duration: "5m", target: 2 },
      { duration: "1m", target: 4 },
      { duration: "3m", target: 3 },
      { duration: "1m", target: 0 }, // ramp down to 0 VUs during the last minute
    ],
};

function randomDelay(min, max) {
  // Generate a random delay between min and max (inclusive)
  return Math.random() * (max - min) + min;
}

function makeRequestWithChance(url, chance) {
  // With a given chance, make an HTTP request to the specified URL
  if (Math.random() < chance) {
    let res = http.get(url);
    check(res, { "Status was 200": (r) => r.status === 200 });
    console.log(`Request to ${url} made with status ${res.status}`);
  }
}

export default function () {
  // Sleep for a random time between 50ms and 300ms
  sleep(randomDelay(0.05, 0.3));
  // Always fetch the main URL
  // makeRequestWithChance("https://api.animalbuttons.biz", 1); // 100% chance

  // Snails are fast 3 times 10 minutes per hour
  let fastSnails = false;
  const now = new Date();
  const minutes = now.getMinutes();
  if (minutes >= 0 && minutes < 10) {
    fastSnails = true;
  }
  if (minutes >= 20 && minutes < 30) {
    fastSnails = true;
  }
  if (minutes >= 40 && minutes < 60) {
    fastSnails = true;
  }

  // Call specific APIs with certain chances
  if (fastSnails) {
    makeRequestWithChance("https://api.animalbuttons.biz/snail?max=1", 0.95); // 95% chance
  } else {
    makeRequestWithChance("https://api.animalbuttons.biz/snail", 0.95); // 95% chance
  }
  makeRequestWithChance("https://api.animalbuttons.biz/rabbit", 0.6); // 60% chance
  // makeRequestWithChance("https://api.animalbuttons.biz/panda", 0.5); // 50% chance
  // makeRequestWithChance("https://api.animalbuttons.biz/beaver", 0.4); // 40% chance
}
