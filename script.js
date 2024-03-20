import http from "k6/http";
import { sleep, check } from "k6";

export let options = {
    stages: [
      { duration: "1m", target: 1 },
      { duration: "3m", target: 5 },
      { duration: "3m", target: 8 },
      { duration: "2m", target: 2 },
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
  // Sleep for a random time between 100ms and 5s
  sleep(randomDelay(0.1, 5));

  // Always fetch the main URL
  makeRequestWithChance("https://api.animalbuttons.biz", 1); // 100% chance

  // Call specific APIs with certain chances
  makeRequestWithChance("https://api.animalbuttons.biz/snail", 0.5); // 50% chance
  makeRequestWithChance("https://api.animalbuttons.biz/rabbit", 0.2); // 20% chance
  makeRequestWithChance("https://api.animalbuttons.biz/panda", 0.9); // 90% chance
  makeRequestWithChance("https://api.animalbuttons.biz/beaver", 0.5); // 50% chance
}
