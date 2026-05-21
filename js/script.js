import olSubjectsMS from "../json/OL_subjects_ms.json";
import alSubjectsMS from "../json/AL_subjects_ms.json";
import crSubjectsMS from "../json/CR_subjects_ms.json";
import TimerAudio from "../media/audio/timer-audio.mp3";

import {
  generateSideButton,
  generateMainButton,
  generateRandomImages,
} from "./generateElements.js";
import createModal from "./modal.js";

import { globalPDFSystem, pdfjsLib } from "./pdf-system.js";

import registerServiceWorker from "./serviceWorkerRegistration.js";
registerServiceWorker();

const hamburgerMenuContainer = document.getElementById(
  "hamburger-menu-container",
);
const hamburgerMenuButtonOpen = document.getElementById(
  "hamburger-menu-button-opened",
);
const hamburgerMenuButtonClose = document.getElementById(
  "hamburger-menu-button-closed",
);
const headerContent = document.getElementById("header-content");
let hamburgerOpened = false;
hamburgerMenuContainer.addEventListener("click", () => {
  if (!hamburgerOpened) {
    headerContent.style.animation = "";
    hamburgerMenuButtonOpen.classList.add("hidden");
    hamburgerMenuButtonClose.classList.remove("hidden");
    headerContent.classList.add("header-content-opened");
    hamburgerMenuContainer.classList.add("hamburger-menu-container-opened");
    let timeout = setTimeout(() => {
      hamburgerOpened = true;
      clearTimeout(timeout);
    }, 1);
  }
});
document.addEventListener("click", (e) => {
  if (hamburgerOpened) {
    const headerContentMousePos = {
      x:
        (e.clientX - headerContent.getBoundingClientRect().x) /
        headerContent.getBoundingClientRect().width,
      y:
        (e.clientY - headerContent.getBoundingClientRect().y) /
        headerContent.getBoundingClientRect().height,
    };
    if (
      headerContentMousePos.x < 0 ||
      headerContentMousePos.x > 1 ||
      headerContentMousePos.y < 0 ||
      headerContentMousePos.y > 1
    ) {
      hamburgerMenuButtonOpen.classList.remove("hidden");
      hamburgerMenuButtonClose.classList.add("hidden");
      headerContent.style.animation = "closeHeaderContent 100ms";
      hamburgerMenuContainer.classList.remove(
        "hamburger-menu-container-opened",
      );
      headerContent.classList.remove("header-content-opened");
      hamburgerOpened = false;
    }
  }
});

let importedFile;

async function readImport(e) {
  const file = e.target.files.item(0);
  const content = await file.text();

  importedFile = content;
}

const dataButton = document.getElementById("data");
dataButton.addEventListener("click", () => {
  createModal(
    "Your data", // title
    ["Here you can Export or Import your data to not lose your progress"], // content
    [
      "Import",
      () => {
        createModal(
          "Import",
          [
            "Import an existing data.json file to load it.",
            "WARNING: Importing clears your current local data.",
            [
              `<input type="file" id="imported-file" style="padding: 2rem;background: transparent;border-radius: 1rem;border: #0D1117 2pt dashed; color: #010409;" accept=".json">`,
              () => {
                addGlobalEventListener("change", "#imported-file", readImport);
              },
            ],
          ],
          [
            "  Import  ",
            () => {
              try {
                importJson(importedFile);
                document.body.appendChild(
                  createModal("Done", ["Date Imported"], ["  Ok  ", () => {}]),
                );
              } catch (error) {
                console.log(error);
                document.body.appendChild(
                  createModal(
                    "Error",
                    ["Invalid Import"],
                    ["  Ok  ", () => {}],
                  ),
                );
              }
            },
          ],
        );
      },
    ],
    [
      "Export",
      () => {
        let blob = new Blob([getExportJson()], { type: "application/json" });

        const a = document.createElement("a");
        const todayDate = new Date().toISOString().slice(0, 10);
        a.download = `My MCQ Mate data ${todayDate}.json`;
        a.href = window.URL.createObjectURL(blob);
        a.click(); // Trigger download
      },
    ],
  );
});

function getExportJson() {
  const regexPattern = new RegExp(/[a-z]{3}[oac][0-9]{2}[wsm][1-3][s]?/gim);
  let dict = JSON.parse(JSON.stringify(localStorage));

  Object.keys(dict).forEach((key) => {
    if (JSON.stringify(key.match(regexPattern)) != JSON.stringify([`${key}`])) {
      delete dict[key];
    }
  });

  return JSON.stringify(dict);
}

function importJson(content) {
  try {
    const parsed = JSON.parse(content);
    const regexPattern = new RegExp(/[a-z]{3}[oac][0-9]{2}[wsm][1-3][s]?/gim);

    console.log("parsed:", parsed);
    console.log("parsed:", regexPattern);

    Object.keys(parsed).forEach((key) => {
      console.log(
        JSON.stringify(key.match(regexPattern)),
        JSON.stringify([`${key}`]),
      );
      console.log(key.match(regexPattern));
      if (
        JSON.stringify(key.match(regexPattern)) != JSON.stringify([`${key}`])
      ) {
        throw new Error("bro gave us a broken file 😔");
      }
    });

    localStorage.clear();
    Object.keys(parsed).forEach((key) => {
      localStorage.setItem(key, parsed[key]);
    });
  } catch (error) {
    console.log(error);
    throw new Error("bro gave us a broken file 😔");
  }
}

import JSConfetti from "js-confetti";
const jsConfetti = new JSConfetti();

// GLOBAL VARIABLES
let globalTimer;
let timerInterval;
let userAnswers;
const subjectCode = {
  CRBiology: "0610",
  CRChemistry: "0620",
  CRCombined: "0653",
  CRPhysics: "0625",
  OLBiology: "0610",
  OLChemistry: "0620",
  OLCombined: "0653",
  OLEconomics: "0455",
  OLPhysics: "0625",
  ALBiology: "9700",
  ALChemistry: "9701",
  ALPhysics: "9702",
};

let randomImagesArray = generateRandomImages();
let randomImageCounter = 0;

// credits button behavior
const creditsButton = document.getElementById("credits");
creditsButton.addEventListener("click", () => {
  createModal(
    "Credit", // title
    [
      "Thanks For using <br> the website <3",
      `Website created by <br> <a href="https://github.com/ZiedDev" target="_blank">Zied</a> & <a href="https://github.com/omar-elsherbiny" target="_blank">Sherbo</a>`,
      `Special Thanks to: <br> <a href="https://gceguide.net/" target="_blank">GCE Guide</a> <br> <a href="https://papacambridge.com/" target="_blank">Papa Cambridge</a>`,
      `Repository: <br> <a href="https://github.com/ZiedDev/mcq-mate" target="_blank">MCQ Mate</a>`,
    ], // content
  );
});

// path direction behavior
const moveBackwardsArrow = document.getElementById("backwards-arrow");
const moveForwardsArrow = document.getElementById("forwards-arrow");

let backward_stack = [];
let current_path = ""; // important to put in datatype and format of root path
let forward_stack = [];

function isBackwardAvailable() {
  return backward_stack.length > 0 ? 1 : 0;
}

function isForwardAvailable() {
  return forward_stack.length > 0 ? 1 : 0;
}

function backwardPath() {
  randomImagesArray = generateRandomImages();
  randomImageCounter = 0;
  if (backward_stack.length == 0) return 0;
  forward_stack.push(current_path);
  current_path = backward_stack.pop();

  if (isBackwardAvailable()) {
    moveBackwardsArrow.classList.add("active");
  } else {
    moveBackwardsArrow.classList.remove("active");
  }
  if (isForwardAvailable()) {
    moveForwardsArrow.classList.add("active");
  } else {
    moveForwardsArrow.classList.remove("active");
  }

  updatePathElement(true);
  updatePathIcon();
}

function changePath(new_path) {
  if (current_path == new_path) {
    return;
  }

  randomImagesArray = generateRandomImages();
  randomImageCounter = 0;
  backward_stack.push(current_path);
  forward_stack = [];
  current_path = new_path;

  if (isBackwardAvailable()) {
    moveBackwardsArrow.classList.add("active");
  } else {
    moveBackwardsArrow.classList.remove("active");
  }
  if (isForwardAvailable()) {
    moveForwardsArrow.classList.add("active");
  } else {
    moveForwardsArrow.classList.remove("active");
  }

  updatePathElement();
  updatePathIcon();
}

function forwardPath() {
  randomImagesArray = generateRandomImages();
  randomImageCounter = 0;
  if (forward_stack.length == 0) return 0;
  backward_stack.push(current_path);
  current_path = forward_stack.pop();
  if (isBackwardAvailable()) {
    moveBackwardsArrow.classList.add("active");
  } else {
    moveBackwardsArrow.classList.remove("active");
  }
  if (isForwardAvailable()) {
    moveForwardsArrow.classList.add("active");
  } else {
    moveForwardsArrow.classList.remove("active");
  }

  updatePathElement(true);
  updatePathIcon();
}

let timeout;
function updatePathElement() {
  const path = document.getElementById("path");
  const pathText = current_path.split(">");
  main.style.animation = "200ms closeMenu forwards ease";

  clearTimeout(timeout);

  timeout = setTimeout(() => {
    main.innerHTML = "";
    globalPDFSystem.destroy();
    if (globalTimer != undefined) {
      globalTimer.parentNode.removeChild(globalTimer);
      globalTimer = undefined;
    }
    if (timerInterval != undefined) {
      clearInterval(timerInterval);
      timerInterval = undefined;
    }
    if (pathText.length == 5) {
      path.innerHTML = "";
      path.appendChild(
        createPathElement(`${pathText[0].toUpperCase()} ${pathText[1]}`, true),
      );
      path.appendChild(createPathElement(pathText[2]));
      path.appendChild(
        createPathElement(
          pathText[3] == "m"
            ? "Feb / Mar"
            : pathText[3] == "s"
              ? "May / Jun"
              : "Oct / Nov",
        ),
      );
      path.appendChild(
        createPathElement(`Variant ${Number(pathText[4]) + 1}`, false, true),
      );
      main.appendChild(
        createBubbleSheetMenu(
          pathText[0],
          pathText[1],
          pathText[2],
          pathText[3],
          pathText[4],
        ),
      );
    } else if (pathText.length == 4) {
      path.innerHTML = "";
      path.appendChild(
        createPathElement(`${pathText[0].toUpperCase()} ${pathText[1]}`, true),
      );
      path.appendChild(createPathElement(pathText[2]));
      path.appendChild(
        createPathElement(
          pathText[3] == "m"
            ? "Feb / Mar"
            : pathText[3] == "s"
              ? "May / Jun"
              : "Oct / Nov",
          false,
          true,
        ),
      );
      main.appendChild(
        CreateSubMenu(pathText[0], pathText[1], pathText[2], pathText[3]),
      );
    } else if (pathText.length == 3) {
      path.innerHTML = "";
      path.appendChild(
        createPathElement(`${pathText[0].toUpperCase()} ${pathText[1]}`, true),
      );
      path.appendChild(createPathElement(pathText[2], false, true));
      main.appendChild(CreateSubMenu(pathText[0], pathText[1], pathText[2]));
    } else if (pathText.length == 2) {
      path.innerHTML = "";
      path.appendChild(
        createPathElement(
          `${pathText[0].toUpperCase()} ${pathText[1]}`,
          true,
          true,
        ),
      );
      main.appendChild(CreateSubMenu(pathText[0], pathText[1]));
    } else if (pathText.length <= 1) {
      path.innerHTML = "";
      main.appendChild(createHomeMenu());
    }
    main.style.animation = "200ms openMenu forwards ease";
  }, 100);
}

moveBackwardsArrow.addEventListener("click", () => {
  if (isBackwardAvailable()) {
    backwardPath();
  }
});
moveForwardsArrow.addEventListener("click", () => {
  if (isForwardAvailable()) {
    forwardPath();
  }
});

document.addEventListener("mousedown", (e) => {
  if (e.buttons == 8) {
    if (isBackwardAvailable()) {
      backwardPath();
    }
  }
});
document.addEventListener("mousedown", (e) => {
  if (e.buttons == 16) {
    if (isForwardAvailable()) {
      forwardPath();
    }
  }
});
document.addEventListener("mouseup", (e) => {
  e.preventDefault();
});

function createPathElement(title, first, last) {
  const element = document.createElement("div");

  const pathElement = document.createElement("div");
  pathElement.textContent = title;
  if (title.split(" ")[0] == "CR") {
    pathElement.textContent = `Core ${title.split(" ")[1]}`;
  }

  if (!first) {
    const arrowElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    arrowElement.setAttribute("width", "32");
    arrowElement.setAttribute("height", "32");
    arrowElement.setAttribute("viewBox", "0 0 256 256");
    arrowElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    arrowElement.innerHTML = `<path fill="currentColor" d="m184.49 136.49l-80 80a12 12 0 0 1-17-17L159 128L87.51 56.49a12 12 0 1 1 17-17l80 80a12 12 0 0 1-.02 17" />`;
    element.appendChild(arrowElement);
  }

  if (!last) {
    pathElement.classList.add("path-clickable");
  } else {
    pathElement.classList.add("path-not-clickable");
  }

  const pathText = current_path.split(">");
  element.appendChild(pathElement);
  pathElement.addEventListener("click", () => {
    if (title == `${pathText[0].toUpperCase()} ${pathText[1]}`) {
      changePath(`${pathText[0]}>${pathText[1]}`);
    } else if (title == pathText[2]) {
      changePath(`${pathText[0]}>${pathText[1]}>${pathText[2]}`);
    } else if (
      title == "Feb / Mar" ||
      title == "May / Jun" ||
      title == "Oct / Nov"
    ) {
      changePath(`${pathText[0]}>${pathText[1]}>${pathText[2]}>${pathText[3]}`);
    }
  });

  return element;
}

function updatePathIcon() {
  const pathIcon = document.getElementById("path-icon");

  if (current_path.split(">")[1] == undefined) {
    pathIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path fill="currentColor" d="m222.14 105.85l-80-80a20 20 0 0 0-28.28 0l-80 80A19.86 19.86 0 0 0 28 120v96a12 12 0 0 0 12 12h64a12 12 0 0 0 12-12v-52h24v52a12 12 0 0 0 12 12h64a12 12 0 0 0 12-12v-96a19.86 19.86 0 0 0-5.86-14.15M204 204h-40v-52a12 12 0 0 0-12-12h-48a12 12 0 0 0-12 12v52H52v-82.35l76-76l76 76Z" /></svg>`;
  } else if (current_path.split(">")[1] == "Biology") {
    pathIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path fill="#ffffff" d="M224 204h-12a92.1 92.1 0 0 0-64-143.22V32a20 20 0 0 0-20-20H80a20 20 0 0 0-20 20v96a20 20 0 0 0 20 20h48a20 20 0 0 0 20-20V85.08A68.1 68.1 0 0 1 204 152a67.39 67.39 0 0 1-24.18 52H32a12 12 0 0 0 0 24h192a12 12 0 0 0 0-24m-100-80H84V36h40Zm-52 64a12 12 0 0 1 0-24h64a12 12 0 0 1 0 24Z"/></svg>`;
  } else if (current_path.split(">")[1] == "Physics") {
    pathIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path fill="#ffffff" d="M209.84 47.44A91.42 91.42 0 0 0 144.62 20h-.35a91.44 91.44 0 0 0-65.12 27l-61.39 62.17a20 20 0 0 0 .08 28.21L46.5 166a19.89 19.89 0 0 0 14.15 5.86h.11a19.86 19.86 0 0 0 14.2-6l60.87-62.39a12.07 12.07 0 0 1 16.77-.12a11.63 11.63 0 0 1 3.5 8.35a12.85 12.85 0 0 1-3.66 9.11L90.19 181a20 20 0 0 0-.21 28.5l28.66 28.66a20.08 20.08 0 0 0 28.15.14l61.76-60.44l.09-.09c36.01-35.99 36.54-94.46 1.2-130.33M60.62 146.21l-23-23l18.19-18.41l22.88 22.88Zm72.2 72.18l-23-23l18.61-18l22.88 22.87Zm58.89-57.62l-23.23 22.73l-22.78-22.77L169.21 138l.15-.14a37 37 0 0 0 10.74-26.37a35.44 35.44 0 0 0-10.85-25.41a36.2 36.2 0 0 0-50.44.48l-.1.11l-23.25 23.82l-22.78-22.77l23.5-23.8A67.55 67.55 0 0 1 144.27 44h.26a67.62 67.62 0 0 1 48.21 20.29c26.11 26.49 25.64 69.76-1.03 96.48"/></svg>`;
  } else if (current_path.split(">")[1] == "Chemistry") {
    pathIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path fill="#ffffff" d="M225.15 197.71L164 95.81V44h4a12 12 0 0 0 0-24H88a12 12 0 0 0 0 24h4v51.81l-61.15 101.9A20 20 0 0 0 48 228h160a20 20 0 0 0 17.15-30.29M140 44v55.14a12 12 0 0 0 1.71 6.17l35.13 58.54c-10.79.86-25.15-1.31-43.42-10.56c-14-7.08-27.46-11.33-40.27-12.76l21.14-35.22a12 12 0 0 0 1.71-6.17V44ZM55.06 204L79 164.19c13-1.11 27.62 2.42 43.62 10.52c19.61 9.92 36.25 13.31 49.85 13.31a75.44 75.44 0 0 0 17.64-2.02l10.83 18Z"/></svg>`;
  } else if (current_path.split(">")[1] == "Economics") {
    pathIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path fill="#ffffff" d="M236 208a12 12 0 0 1-12 12H32a12 12 0 0 1-12-12V48a12 12 0 0 1 24 0v99l43.51-43.52a12 12 0 0 1 17 0L128 127l43-43h-11a12 12 0 0 1 0-24h40a12 12 0 0 1 12 12v40a12 12 0 0 1-24 0v-11l-51.51 51.52a12 12 0 0 1-17 0L96 129l-52 52v15h180a12 12 0 0 1 12 12"/></svg>`;
  } else if (current_path.split(">")[1] == "Combined") {
    pathIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path fill="#ffffff" d="M219.23 159.2a196.66 196.66 0 0 0-18-31.2a196.66 196.66 0 0 0 18-31.2c11.84-26.31 11.69-47.48-.43-59.6s-33.29-12.27-59.6-.43a196.66 196.66 0 0 0-31.2 18a196.66 196.66 0 0 0-31.2-18c-26.31-11.84-47.48-11.69-59.6.43s-12.27 33.29-.43 59.6a196.66 196.66 0 0 0 18 31.2a196.66 196.66 0 0 0-18 31.2c-11.84 26.31-11.69 47.48.43 59.6c6.13 6.13 14.58 9.2 24.8 9.2c10 0 21.77-2.92 34.76-8.77a196.66 196.66 0 0 0 31.2-18a196.66 196.66 0 0 0 31.2 18c13 5.85 24.74 8.77 34.76 8.77c10.26 0 18.71-3.07 24.84-9.2c12.16-12.12 12.31-33.29.47-59.6m-17.41-105c5.25 5.26 1.79 26-16 53.78c-5.61-6.66-11.65-13.25-18.07-19.67S154.7 75.83 148 70.22c27.82-17.83 48.56-21.29 53.82-16.04ZM171.24 128a288.6 288.6 0 0 1-20.51 22.73A288.6 288.6 0 0 1 128 171.24a288.6 288.6 0 0 1-22.73-20.51A288.6 288.6 0 0 1 84.76 128A298.55 298.55 0 0 1 128 84.76a286.83 286.83 0 0 1 22.73 20.51A286.83 286.83 0 0 1 171.24 128M54.18 54.18c1.46-1.45 4.1-2.24 7.75-2.24c9.53 0 25.94 5.39 46 18.28c-6.66 5.61-13.25 11.65-19.67 18.07S75.83 101.3 70.22 108C52.39 80.18 48.93 59.44 54.18 54.18m0 147.64c-5.25-5.26-1.79-26 16-53.78c5.61 6.66 11.65 13.25 18.07 19.67s13 12.46 19.67 18.07c-27.74 17.83-48.48 21.29-53.74 16.04m147.64 0c-5.26 5.25-26 1.79-53.78-16c6.66-5.61 13.25-11.65 19.67-18.07s12.46-13 18.07-19.67c17.83 27.74 21.29 48.48 16.04 53.74M144 128a16 16 0 1 1-16-16a16 16 0 0 1 16 16"/></svg>`;
  }
}

const pathIcon = document.getElementById("path-icon");
pathIcon.addEventListener("click", () => {
  if (current_path != "home") {
    changePath("home");
  }
});

// side bar
const openedSideBarArray = [];

// creating side buttons for ol subjects
const sideGroupOl = document.getElementById("side-group-ol");
Object.keys(olSubjectsMS).forEach((subject) => {
  const subjectElement = generateSideButton({
    level: "ol",
    subject: subject,
    generateContainerCallback: () => {
      const sideSubjectYears = document.getElementById(
        `side-ol-${subject}-years`,
      );
      Object.keys(olSubjectsMS[subject]).forEach((year) => {
        let opened =
          openedSideBarArray.indexOf(`ol-${subject}-${year}`) == -1
            ? false
            : true;
        const yearElement = generateSideButton({
          opened: opened,
          level: "ol",
          subject: subject,
          year: year,
          generateContainerCallback: () => {
            if (!opened) {
              openedSideBarArray.push(`ol-${subject}-${year}`);
            }
            const sideYearSessions = document.getElementById(
              `side-ol-${subject}-${year}-sessions`,
            );
            Object.keys(olSubjectsMS[subject][year]).forEach((session) => {
              if (
                JSON.stringify(olSubjectsMS[subject][year][session]) !=
                JSON.stringify([null, null, null])
              ) {
                let opened =
                  openedSideBarArray.indexOf(
                    `ol-${subject}-${year}-${session}`,
                  ) == -1
                    ? false
                    : true;
                const sessionElement = generateSideButton({
                  opened: opened,
                  level: "ol",
                  subject: subject,
                  year: year,
                  session: session,
                  generateContainerCallback: () => {
                    if (!opened) {
                      openedSideBarArray.push(
                        `ol-${subject}-${year}-${session}`,
                      );
                    }
                    const sideSessionVariants = document.getElementById(
                      `side-ol-${subject}-${year}-${session}-variants`,
                    );
                    Object.keys(olSubjectsMS[subject][year][session]).forEach(
                      (variant) => {
                        if (
                          olSubjectsMS[subject][year][session][variant] != null
                        ) {
                          const variantElement = generateSideButton({
                            level: "ol",
                            subject: subject,
                            year: year,
                            session: session,
                            variant: variant,
                          });
                          variantElement.addEventListener("click", (e) => {
                            if (
                              e.target.id ==
                                `side-ol-button-${subject}-${year}-${session}-${variant}` ||
                              e.target.id ==
                                `side-ol-${subject}-${year}-${session}-${variant}-title`
                            ) {
                              changePath(
                                `ol>${subject}>${year}>${session}>${variant}`,
                              );
                            }
                          });
                          sideSessionVariants.appendChild(variantElement);
                        }
                      },
                    );
                  },
                  removeContainerCallback: () => {
                    let index = openedSideBarArray.indexOf(
                      `ol-${subject}-${year}-${session}`,
                    );
                    if (index != -1) {
                      openedSideBarArray.splice(index, 1);
                    }
                    const sideSessionVariants = document.getElementById(
                      `side-ol-${subject}-${year}-${session}-variants`,
                    );
                    const variantsLength =
                      sideSessionVariants.childNodes.length;
                    for (let i = 0; i < variantsLength; i++) {
                      let timeout = setTimeout(() => {
                        sideSessionVariants.removeChild(
                          sideSessionVariants.childNodes[0],
                        );
                        clearTimeout(timeout);
                      }, 100);
                    }
                  },
                });
                sessionElement.addEventListener("click", (e) => {
                  if (
                    e.target.id ==
                      `side-ol-button-${subject}-${year}-${session}` ||
                    e.target.id == `side-ol-${subject}-${year}-${session}-title`
                  ) {
                    changePath(`ol>${subject}>${year}>${session}`);
                  }
                });
                sideYearSessions.appendChild(sessionElement);
              }
            });
          },
          removeContainerCallback: () => {
            let index = openedSideBarArray.indexOf(`ol-${subject}-${year}`);
            if (index != -1) {
              openedSideBarArray.splice(index, 1);
            }
            const sideYearSessions = document.getElementById(
              `side-ol-${subject}-${year}-sessions`,
            );
            const sessionsLength = sideYearSessions.childNodes.length;
            for (let i = 0; i < sessionsLength; i++) {
              let timeout = setTimeout(() => {
                sideYearSessions.removeChild(sideYearSessions.childNodes[0]);
                clearTimeout(timeout);
              }, 100);
            }
          },
        });
        yearElement.addEventListener("click", (e) => {
          if (
            e.target.id == `side-ol-button-${subject}-${year}` ||
            e.target.id == `side-ol-${subject}-${year}-title`
          ) {
            changePath(`ol>${subject}>${year}`);
          }
        });

        sideSubjectYears.appendChild(yearElement);
      });
    },
    removeContainerCallback: () => {
      const sideSubjectYears = document.getElementById(
        `side-ol-${subject}-years`,
      );
      const yearLength = sideSubjectYears.childNodes.length;
      for (let i = 0; i < yearLength; i++) {
        let timeout = setTimeout(() => {
          sideSubjectYears.removeChild(sideSubjectYears.childNodes[0]);
          clearTimeout(timeout);
        }, 100);
      }
    },
  });
  subjectElement.addEventListener("click", (e) => {
    if (
      e.target.id == `side-ol-button-${subject}` ||
      e.target.id == `side-ol-${subject}-title`
    ) {
      changePath(`ol>${subject}`);
    }
  });

  sideGroupOl.appendChild(subjectElement);
});

// creating side buttons for al subjects
const sideGroupAl = document.getElementById("side-group-al");
Object.keys(alSubjectsMS).forEach((subject) => {
  const subjectElement = generateSideButton({
    level: "al",
    subject: subject,
    generateContainerCallback: () => {
      const sideSubjectYears = document.getElementById(
        `side-al-${subject}-years`,
      );
      Object.keys(alSubjectsMS[subject]).forEach((year) => {
        let opened =
          openedSideBarArray.indexOf(`al-${subject}-${year}`) == -1
            ? false
            : true;
        const yearElement = generateSideButton({
          opened: opened,
          level: "al",
          subject: subject,
          year: year,
          generateContainerCallback: () => {
            if (!opened) {
              openedSideBarArray.push(`al-${subject}-${year}`);
            }
            const sideYearSessions = document.getElementById(
              `side-al-${subject}-${year}-sessions`,
            );
            Object.keys(alSubjectsMS[subject][year]).forEach((session) => {
              if (
                JSON.stringify(alSubjectsMS[subject][year][session]) !=
                JSON.stringify([null, null, null])
              ) {
                let opened =
                  openedSideBarArray.indexOf(
                    `al-${subject}-${year}-${session}`,
                  ) == -1
                    ? false
                    : true;
                const sessionElement = generateSideButton({
                  opened: opened,
                  level: "al",
                  subject: subject,
                  year: year,
                  session: session,
                  generateContainerCallback: () => {
                    if (!opened) {
                      openedSideBarArray.push(
                        `al-${subject}-${year}-${session}`,
                      );
                    }
                    const sideSessionVariants = document.getElementById(
                      `side-al-${subject}-${year}-${session}-variants`,
                    );
                    Object.keys(alSubjectsMS[subject][year][session]).forEach(
                      (variant) => {
                        if (
                          alSubjectsMS[subject][year][session][variant] != null
                        ) {
                          const variantElement = generateSideButton({
                            level: "al",
                            subject: subject,
                            year: year,
                            session: session,
                            variant: variant,
                          });
                          variantElement.addEventListener("click", (e) => {
                            if (
                              e.target.id ==
                                `side-al-button-${subject}-${year}-${session}-${variant}` ||
                              e.target.id ==
                                `side-al-${subject}-${year}-${session}-${variant}-title`
                            ) {
                              changePath(
                                `al>${subject}>${year}>${session}>${variant}`,
                              );
                            }
                          });
                          sideSessionVariants.appendChild(variantElement);
                        }
                      },
                    );
                  },
                  removeContainerCallback: () => {
                    let index = openedSideBarArray.indexOf(
                      `al-${subject}-${year}-${session}`,
                    );
                    if (index != -1) {
                      openedSideBarArray.splice(index, 1);
                    }
                    const sideSessionVariants = document.getElementById(
                      `side-al-${subject}-${year}-${session}-variants`,
                    );
                    const variantsLength =
                      sideSessionVariants.childNodes.length;
                    for (let i = 0; i < variantsLength; i++) {
                      let timeout = setTimeout(() => {
                        sideSessionVariants.removeChild(
                          sideSessionVariants.childNodes[0],
                        );
                        clearTimeout(timeout);
                      }, 100);
                    }
                  },
                });
                sessionElement.addEventListener("click", (e) => {
                  if (
                    e.target.id ==
                      `side-al-button-${subject}-${year}-${session}` ||
                    e.target.id == `side-al-${subject}-${year}-${session}-title`
                  ) {
                    changePath(`al>${subject}>${year}>${session}`);
                  }
                });
                sideYearSessions.appendChild(sessionElement);
              }
            });
          },
          removeContainerCallback: () => {
            let index = openedSideBarArray.indexOf(`al-${subject}-${year}`);
            if (index != -1) {
              openedSideBarArray.splice(index, 1);
            }
            const sideYearSessions = document.getElementById(
              `side-al-${subject}-${year}-sessions`,
            );
            const sessionsLength = sideYearSessions.childNodes.length;
            for (let i = 0; i < sessionsLength; i++) {
              let timeout = setTimeout(() => {
                sideYearSessions.removeChild(sideYearSessions.childNodes[0]);
                clearTimeout(timeout);
              }, 100);
            }
          },
        });
        yearElement.addEventListener("click", (e) => {
          if (
            e.target.id == `side-al-button-${subject}-${year}` ||
            e.target.id == `side-al-${subject}-${year}-title`
          ) {
            changePath(`al>${subject}>${year}`);
          }
        });

        sideSubjectYears.appendChild(yearElement);
      });
    },
    removeContainerCallback: () => {
      const sideSubjectYears = document.getElementById(
        `side-al-${subject}-years`,
      );
      const yearLength = sideSubjectYears.childNodes.length;
      for (let i = 0; i < yearLength; i++) {
        let timeout = setTimeout(() => {
          sideSubjectYears.removeChild(sideSubjectYears.childNodes[0]);
          clearTimeout(timeout);
        }, 100);
      }
    },
  });
  subjectElement.addEventListener("click", (e) => {
    if (
      e.target.id == `side-al-button-${subject}` ||
      e.target.id == `side-al-${subject}-title`
    ) {
      changePath(`al>${subject}`);
    }
  });

  sideGroupAl.appendChild(subjectElement);
});

// // creating side button for core subjects
const sideGroupCr = document.getElementById("side-group-cr");
Object.keys(crSubjectsMS).forEach((subject) => {
  const subjectElement = generateSideButton({
    level: "cr",
    subject: subject,
    generateContainerCallback: () => {
      const sideSubjectYears = document.getElementById(
        `side-cr-${subject}-years`,
      );
      Object.keys(crSubjectsMS[subject]).forEach((year) => {
        let opened =
          openedSideBarArray.indexOf(`cr-${subject}-${year}`) == -1
            ? false
            : true;
        const yearElement = generateSideButton({
          opened: opened,
          level: "cr",
          subject: subject,
          year: year,
          generateContainerCallback: () => {
            if (!opened) {
              openedSideBarArray.push(`cr-${subject}-${year}`);
            }
            const sideYearSessions = document.getElementById(
              `side-cr-${subject}-${year}-sessions`,
            );
            Object.keys(crSubjectsMS[subject][year]).forEach((session) => {
              if (
                JSON.stringify(crSubjectsMS[subject][year][session]) !=
                JSON.stringify([null, null, null])
              ) {
                let opened =
                  openedSideBarArray.indexOf(
                    `cr-${subject}-${year}-${session}`,
                  ) == -1
                    ? false
                    : true;
                const sessionElement = generateSideButton({
                  opened: opened,
                  level: "cr",
                  subject: subject,
                  year: year,
                  session: session,
                  generateContainerCallback: () => {
                    if (!opened) {
                      openedSideBarArray.push(
                        `cr-${subject}-${year}-${session}`,
                      );
                    }
                    const sideSessionVariants = document.getElementById(
                      `side-cr-${subject}-${year}-${session}-variants`,
                    );
                    Object.keys(crSubjectsMS[subject][year][session]).forEach(
                      (variant) => {
                        if (
                          crSubjectsMS[subject][year][session][variant] != null
                        ) {
                          const variantElement = generateSideButton({
                            level: "cr",
                            subject: subject,
                            year: year,
                            session: session,
                            variant: variant,
                          });
                          variantElement.addEventListener("click", (e) => {
                            if (
                              e.target.id ==
                                `side-cr-button-${subject}-${year}-${session}-${variant}` ||
                              e.target.id ==
                                `side-cr-${subject}-${year}-${session}-${variant}-title`
                            ) {
                              changePath(
                                `cr>${subject}>${year}>${session}>${variant}`,
                              );
                            }
                          });
                          sideSessionVariants.appendChild(variantElement);
                        }
                      },
                    );
                  },
                  removeContainerCallback: () => {
                    let index = openedSideBarArray.indexOf(
                      `cr-${subject}-${year}-${session}`,
                    );
                    if (index != -1) {
                      openedSideBarArray.splice(index, 1);
                    }
                    const sideSessionVariants = document.getElementById(
                      `side-cr-${subject}-${year}-${session}-variants`,
                    );
                    const variantsLength =
                      sideSessionVariants.childNodes.length;
                    for (let i = 0; i < variantsLength; i++) {
                      let timeout = setTimeout(() => {
                        sideSessionVariants.removeChild(
                          sideSessionVariants.childNodes[0],
                        );
                        clearTimeout(timeout);
                      }, 100);
                    }
                  },
                });
                sessionElement.addEventListener("click", (e) => {
                  if (
                    e.target.id ==
                      `side-cr-button-${subject}-${year}-${session}` ||
                    e.target.id == `side-cr-${subject}-${year}-${session}-title`
                  ) {
                    changePath(`cr>${subject}>${year}>${session}`);
                  }
                });
                sideYearSessions.appendChild(sessionElement);
              }
            });
          },
          removeContainerCallback: () => {
            let index = openedSideBarArray.indexOf(`cr-${subject}-${year}`);
            if (index != -1) {
              openedSideBarArray.splice(index, 1);
            }
            const sideYearSessions = document.getElementById(
              `side-cr-${subject}-${year}-sessions`,
            );
            const sessionsLength = sideYearSessions.childNodes.length;
            for (let i = 0; i < sessionsLength; i++) {
              let timeout = setTimeout(() => {
                sideYearSessions.removeChild(sideYearSessions.childNodes[0]);
                clearTimeout(timeout);
              }, 100);
            }
          },
        });
        yearElement.addEventListener("click", (e) => {
          if (
            e.target.id == `side-cr-button-${subject}-${year}` ||
            e.target.id == `side-cr-${subject}-${year}-title`
          ) {
            changePath(`cr>${subject}>${year}`);
          }
        });

        sideSubjectYears.appendChild(yearElement);
      });
    },
    removeContainerCallback: () => {
      const sideSubjectYears = document.getElementById(
        `side-cr-${subject}-years`,
      );
      const yearLength = sideSubjectYears.childNodes.length;
      for (let i = 0; i < yearLength; i++) {
        let timeout = setTimeout(() => {
          sideSubjectYears.removeChild(sideSubjectYears.childNodes[0]);
          clearTimeout(timeout);
        }, 100);
      }
    },
  });
  subjectElement.addEventListener("click", (e) => {
    if (
      e.target.id == `side-cr-button-${subject}` ||
      e.target.id == `side-cr-${subject}-title`
    ) {
      changePath(`cr>${subject}`);
    }
  });

  sideGroupCr.appendChild(subjectElement);
});

// creating home menu

function createHomeMenu() {
  const home = document.createElement("div");
  home.id = "home";
  home.classList.add("home");

  const olTitle = document.createElement("h2");
  olTitle.textContent = "OL Subjects";
  home.appendChild(olTitle);

  const olCardsContainer = document.createElement("div");
  Object.keys(olSubjectsMS).forEach((subject) => {
    const subjectElement = generateMainButton("ol", subject);
    createRotatingCard(subjectElement);
    subjectElement.addEventListener("click", () => {
      changePath(`ol>${subject}`);
    });

    olCardsContainer.appendChild(subjectElement);
  });
  home.appendChild(olCardsContainer);

  const alTitle = document.createElement("h2");
  alTitle.textContent = "AL Subjects";
  home.appendChild(alTitle);

  const alCardsContainer = document.createElement("div");
  Object.keys(alSubjectsMS).forEach((subject) => {
    const subjectElement = generateMainButton("al", subject);
    createRotatingCard(subjectElement);
    subjectElement.addEventListener("click", () => {
      changePath(`al>${subject}`);
    });

    alCardsContainer.appendChild(subjectElement);
  });
  home.appendChild(alCardsContainer);

  const crTitle = document.createElement("h2");
  crTitle.textContent = "Core Subjects";
  home.appendChild(crTitle);

  const crCardsContainer = document.createElement("div");
  Object.keys(crSubjectsMS).forEach((subject) => {
    const subjectElement = generateMainButton("cr", subject);
    createRotatingCard(subjectElement);
    subjectElement.addEventListener("click", () => {
      changePath(`cr>${subject}`);
    });

    crCardsContainer.appendChild(subjectElement);
  });
  home.appendChild(crCardsContainer);

  return home;
}

// creating the sub menu buttons
function CreateSubMenu(level, subject, year, session) {
  const menu = document.createElement("div");
  menu.id = `Select a ${
    session == undefined
      ? year == undefined
        ? "years-menu"
        : "sessions-menu"
      : "variants-menu"
  }`;
  menu.classList.add("sub-menu");
  const title = document.createElement("h2");
  title.textContent = `Select a ${
    session == undefined ? (year == undefined ? "year" : "session") : "variant"
  }`;
  menu.appendChild(title);

  const cardsContainer = document.createElement("div");

  if (level.toLowerCase() == "cr") {
    if (session == undefined) {
      if (year == undefined) {
        Object.keys(crSubjectsMS[subject]).forEach((year) => {
          const yearElement = generateMainButton(
            "cr",
            subject,
            year,
            undefined,
            undefined,
            randomImagesArray[randomImageCounter],
          );
          randomImageCounter++;
          createRotatingCard(yearElement);
          yearElement.addEventListener("click", () => {
            changePath(`cr>${subject}>${year}`);
          });

          cardsContainer.appendChild(yearElement);
        });
      } else {
        Object.keys(crSubjectsMS[subject][year]).forEach((session) => {
          if (
            JSON.stringify(crSubjectsMS[subject][year][session]) !=
            JSON.stringify([null, null, null])
          ) {
            const sessionElement = generateMainButton(
              "cr",
              subject,
              year,
              session,
              undefined,
              randomImagesArray[randomImageCounter],
            );
            randomImageCounter++;
            createRotatingCard(sessionElement);
            sessionElement.addEventListener("click", () => {
              changePath(`cr>${subject}>${year}>${session}`);
            });
            cardsContainer.appendChild(sessionElement);
          }
        });
      }
    } else {
      Object.keys(crSubjectsMS[subject][year][session]).forEach((variant) => {
        if (crSubjectsMS[subject][year][session][variant] != null) {
          const variantElement = generateMainButton(
            "cr",
            subject,
            year,
            session,
            variant,
            randomImagesArray[randomImageCounter],
          );
          randomImageCounter++;
          createRotatingCard(variantElement);
          variantElement.addEventListener("click", () => {
            changePath(`cr>${subject}>${year}>${session}>${variant}`);
          });

          cardsContainer.appendChild(variantElement);
        }
      });
    }
  } else if (level.toLowerCase() == "ol") {
    if (session == undefined) {
      if (year == undefined) {
        Object.keys(olSubjectsMS[subject]).forEach((year) => {
          const yearElement = generateMainButton(
            "ol",
            subject,
            year,
            undefined,
            undefined,
            randomImagesArray[randomImageCounter],
          );
          randomImageCounter++;
          createRotatingCard(yearElement);
          yearElement.addEventListener("click", () => {
            changePath(`ol>${subject}>${year}`);
          });

          cardsContainer.appendChild(yearElement);
        });
      } else {
        Object.keys(olSubjectsMS[subject][year]).forEach((session) => {
          if (
            JSON.stringify(olSubjectsMS[subject][year][session]) !=
            JSON.stringify([null, null, null])
          ) {
            const sessionElement = generateMainButton(
              "ol",
              subject,
              year,
              session,
              undefined,
              randomImagesArray[randomImageCounter],
            );
            randomImageCounter++;
            createRotatingCard(sessionElement);
            sessionElement.addEventListener("click", () => {
              changePath(`ol>${subject}>${year}>${session}`);
            });
            cardsContainer.appendChild(sessionElement);
          }
        });
      }
    } else {
      Object.keys(olSubjectsMS[subject][year][session]).forEach((variant) => {
        if (olSubjectsMS[subject][year][session][variant] != null) {
          const variantElement = generateMainButton(
            "ol",
            subject,
            year,
            session,
            variant,
            randomImagesArray[randomImageCounter],
          );
          randomImageCounter++;
          createRotatingCard(variantElement);
          variantElement.addEventListener("click", () => {
            changePath(`ol>${subject}>${year}>${session}>${variant}`);
          });

          cardsContainer.appendChild(variantElement);
        }
      });
    }
  } else if (level.toLowerCase() == "al") {
    if (session == undefined) {
      if (year == undefined) {
        Object.keys(alSubjectsMS[subject]).forEach((year) => {
          const yearElement = generateMainButton(
            "al",
            subject,
            year,
            undefined,
            undefined,
            randomImagesArray[randomImageCounter],
          );
          randomImageCounter++;
          createRotatingCard(yearElement);
          yearElement.addEventListener("click", () => {
            changePath(`al>${subject}>${year}`);
          });

          cardsContainer.appendChild(yearElement);
        });
      } else {
        Object.keys(alSubjectsMS[subject][year]).forEach((session) => {
          if (
            JSON.stringify(alSubjectsMS[subject][year][session]) !=
            JSON.stringify([null, null, null])
          ) {
            const sessionElement = generateMainButton(
              "al",
              subject,
              year,
              session,
              undefined,
              randomImagesArray[randomImageCounter],
            );
            randomImageCounter++;
            createRotatingCard(sessionElement);
            sessionElement.addEventListener("click", () => {
              changePath(`al>${subject}>${year}>${session}`);
            });
            cardsContainer.appendChild(sessionElement);
          }
        });
      }
    } else {
      Object.keys(alSubjectsMS[subject][year][session]).forEach((variant) => {
        if (alSubjectsMS[subject][year][session][variant] != null) {
          const variantElement = generateMainButton(
            "al",
            subject,
            year,
            session,
            variant,
            randomImagesArray[randomImageCounter],
          );
          randomImageCounter++;
          createRotatingCard(variantElement);
          variantElement.addEventListener("click", () => {
            changePath(`al>${subject}>${year}>${session}>${variant}`);
          });

          cardsContainer.appendChild(variantElement);
        }
      });
    }
  }
  menu.appendChild(cardsContainer);

  return menu;
}

function createRotatingCard(elementContainer) {
  const element = elementContainer.children[0];

  elementContainer.addEventListener("mouseenter", (e) => {
    element.style.transition = `transform 100ms ease-in-out, scale 150ms ease, box-shadow 150ms ease`;
    const aTimeout = setTimeout(() => {
      rotateCard(e);
    }, 50);
    const anotherTimeout = setTimeout(() => {
      element.style.transition = `scale 150ms ease, box-shadow 150ms ease`;
      elementContainer.addEventListener("mousemove", rotateCard);
    }, 100);

    elementContainer.addEventListener("mouseleave", () => {
      clearTimeout(aTimeout);
      clearTimeout(anotherTimeout);

      elementContainer.removeEventListener("mousemove", rotateCard);
      element.style.transition = `transform 100ms ease-in-out, scale 150ms ease, box-shadow 150ms ease`;
      element.style.transform = ``;
    });
  });

  function rotateCard(e) {
    const mousePos = {
      x:
        ((e.clientX - elementContainer.getBoundingClientRect().x) /
          elementContainer.getBoundingClientRect().width) *
          (45 / 2) -
        45 / 2 / 2,
      y:
        ((e.clientY - elementContainer.getBoundingClientRect().y) /
          elementContainer.getBoundingClientRect().height) *
          (45 / 2) -
        45 / 2 / 2,
    };
    element.style.transform = `rotateY(${
      mousePos.x
    }deg) rotateX(${-mousePos.y}deg) scale(1.025)`;
  }
}

function createBubbleSheetMenu(
  level,
  subject,
  year,
  session,
  variant,
  useLocalAnswers,
) {
  const menu = document.createElement("div");
  menu.id = "bubble-sheet-menu";
  menu.classList.add("bubble-sheet-menu");

  const title = document.createElement("h2");
  title.classList.add("bubble-sheet-title");
  title.id = "bubble-sheet-title";
  const titleContainer = document.createElement("div");
  titleContainer.style.textAlign = "center";
  titleContainer.style.marginBottom = "30px";
  titleContainer.innerHTML = `
    <h2 style="font-family: var(--font-display, 'Space Grotesk', sans-serif); font-size: 1.75rem; font-weight: 700; color: #ffffff; letter-spacing: -0.02em; margin-bottom: 8px;">Paper Ready</h2>
    <p style="font-size: 1rem; color: #8b949e;">Select your preferred workspace to begin solving.</p>
  `;
  menu.appendChild(titleContainer);

  const is2025OrLater = Number(year) >= 2025;
  const filename = `${subjectCode[level.toUpperCase() + subject]}_${session}${
    Number(year) - 2000
  }_qp_${subject == "Economics" ? 1 : level == "al" || level == "cr" ? 1 : 2}${
    Number(variant) + 1
  }.pdf`;
  
  // Use our local proxy for PapaCambridge to bypass CORS for 2025+ papers
  const basePdfUrl = is2025OrLater
    ? `/api/pdf-proxy?url=` + encodeURIComponent(`https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/${filename}`)
    : `https://zieddev.github.io/mcq-mate/pdfs/${level.toUpperCase()}-${subject}/${year}/${
        session == "s" ? "May-Jun" : session == "w" ? "Oct-Nov" : "Feb-Mar"
      }/${filename}`;

  const layoutSelectContainer = document.createElement("div");
  layoutSelectContainer.id = "layout-select-container";
  layoutSelectContainer.style.marginBottom = "32px";
  layoutSelectContainer.style.display = "flex";
  layoutSelectContainer.style.flexDirection = "column";
  layoutSelectContainer.style.alignItems = "center";
  layoutSelectContainer.style.gap = "12px";
  layoutSelectContainer.style.width = "100%";
  layoutSelectContainer.innerHTML = `
    <h3 style="color: #f0f6fc; font-weight: 800; font-size: 1.25rem; letter-spacing: -0.01em; margin-bottom: 24px; text-transform: uppercase; text-align: center; background: linear-gradient(90deg, #bb86fc, #ff79c6, #8be9fd); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 0 20px rgba(187, 134, 252, 0.4);">Choose your workspace</h3>
    <div class="custom-layout-select" id="custom-layout-select">
      <div class="custom-layout-select-trigger" id="custom-layout-select-trigger">
        <div class="layout-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
          <span id="custom-layout-selected-text">Select Layout...</span>
        </div>
        <svg class="chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </div>
      <div class="custom-layout-options" id="custom-layout-options">
        <div class="custom-layout-option handout" data-value="handout">
          <div class="icon-box" style="background: linear-gradient(135deg, rgba(88, 166, 255, 0.15), rgba(88, 166, 255, 0.05)); color: #58a6ff; box-shadow: 0 0 10px rgba(88, 166, 255, 0.2);"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></div>
          <div class="option-text">
            <span class="option-title" style="color: #58a6ff; text-shadow: 0 0 8px rgba(88, 166, 255, 0.3);">Handout</span>
            <span class="option-desc">Bubble sheet focus, external viewer</span>
          </div>
        </div>
        <div class="custom-layout-option exam" data-value="exam">
          <div class="icon-box" style="background: linear-gradient(135deg, rgba(163, 113, 247, 0.15), rgba(163, 113, 247, 0.05)); color: #a371f7; box-shadow: 0 0 10px rgba(163, 113, 247, 0.2);"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="3" x2="12" y2="21"></line></svg></div>
          <div class="option-text">
            <span class="option-title" style="color: #a371f7; text-shadow: 0 0 8px rgba(163, 113, 247, 0.3);">Exam Screen</span>
            <span class="option-desc">Side-by-side split layout</span>
          </div>
        </div>
        <div class="custom-layout-option practice" data-value="practice">
          <div class="icon-box" style="background: linear-gradient(135deg, rgba(63, 185, 80, 0.15), rgba(63, 185, 80, 0.05)); color: #3fb950; box-shadow: 0 0 10px rgba(63, 185, 80, 0.2);"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div>
          <div class="option-text">
            <span class="option-title" style="color: #3fb950; text-shadow: 0 0 8px rgba(63, 185, 80, 0.3);">Practice Mode</span>
            <span class="option-desc">Full-screen native exam interface</span>
          </div>
        </div>
      </div>
    </div>
  `;

  menu.appendChild(layoutSelectContainer);
  
  // Exit Exam Mode logic is now inside the select handler

  const pdfButtonsContainer = document.createElement("div");
  pdfButtonsContainer.id = "pdf-buttons-container";
  pdfButtonsContainer.style.display = "none";
  pdfButtonsContainer.style.justifyContent = "center";
  pdfButtonsContainer.style.gap = "1rem";
  pdfButtonsContainer.style.width = "100%";
  pdfButtonsContainer.style.flexWrap = "wrap";
  pdfButtonsContainer.style.marginBottom = "24px";

  const pdfLink = document.createElement("a");
  pdfLink.classList.add("bubble-sheet-pdf-btn", "external-pdf-btn");
  pdfLink.id = "bubble-sheet-pdf-link";
  pdfLink.href = basePdfUrl;
  pdfLink.setAttribute("target", "_blank");
  pdfLink.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px; display:inline-block; vertical-align:middle; pointer-events: none;"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
    <span style="vertical-align:middle; pointer-events:none;">External Tab</span>
  `;
  pdfLink.style.display = "inline-flex";
  pdfLink.style.alignItems = "center";
  pdfLink.style.padding = "10px 20px";
  pdfLink.style.borderRadius = "8px";
  pdfLink.style.border = "1px solid #363b42";
  pdfLink.style.backgroundColor = "transparent";
  pdfLink.style.color = "#c9d1d9";
  pdfLink.style.textDecoration = "none";
  pdfLink.style.cursor = "pointer";
  pdfLink.style.fontWeight = "600";
  pdfLink.style.transition = "all 0.2s";
  pdfLink.onmouseenter = () => {
    pdfLink.style.backgroundColor = "#21262d";
  };
  pdfLink.onmouseleave = () => {
    pdfLink.style.backgroundColor = "transparent";
  };

  const builtInPdfBtn = document.createElement("button");
  builtInPdfBtn.classList.add("bubble-sheet-pdf-btn");
  builtInPdfBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px; display:inline-block; vertical-align:middle; pointer-events: none;"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
    <span style="vertical-align:middle; pointer-events:none;">Built-in Viewer (Z)</span>
  `;
  builtInPdfBtn.style.padding = "10px 20px";
  builtInPdfBtn.style.borderRadius = "8px";
  builtInPdfBtn.style.border = "1px solid #2ea043";
  builtInPdfBtn.style.backgroundColor = "transparent";
  builtInPdfBtn.style.color = "#2ea043";
  builtInPdfBtn.style.cursor = "pointer";
  builtInPdfBtn.style.fontWeight = "600";
  builtInPdfBtn.style.display = "inline-flex";
  builtInPdfBtn.style.alignItems = "center";
  builtInPdfBtn.style.transition = "all 0.2s";
  builtInPdfBtn.onmouseenter = () => {
    builtInPdfBtn.style.backgroundColor = "rgba(46, 160, 67, 0.1)";
  };
  builtInPdfBtn.onmouseleave = () => {
    builtInPdfBtn.style.backgroundColor = "transparent";
  };
  builtInPdfBtn.onclick = () => {
    document.body.classList.remove("split-screen-active");
    if (menu.style.position === "fixed") {
      menu.style = ""; // reset
    }
    globalPDFSystem.toggle(basePdfUrl);
  };

  pdfButtonsContainer.appendChild(pdfLink);
  pdfButtonsContainer.appendChild(builtInPdfBtn);
  menu.appendChild(pdfButtonsContainer);

  const realtimeSettingsContainer = document.createElement("div");
  realtimeSettingsContainer.className = "realtime-settings";
  realtimeSettingsContainer.id = "split-screen-realtime-settings";
  realtimeSettingsContainer.style.display = "none";
  realtimeSettingsContainer.style.background = "#161b22";
  realtimeSettingsContainer.style.border = "1px solid #30363d";
  realtimeSettingsContainer.style.borderRadius = "10px";
  realtimeSettingsContainer.style.padding = "12px 16px";
  realtimeSettingsContainer.style.marginBottom = "24px";
  realtimeSettingsContainer.style.maxWidth = "400px";
  realtimeSettingsContainer.style.margin = "0 auto 24px auto";

  const realtimeRow = document.createElement("div");
  realtimeRow.className = "realtime-row";
  realtimeRow.style.cursor = "pointer";
  realtimeRow.style.display = "flex";
  realtimeRow.style.justifyContent = "space-between";
  realtimeRow.style.alignItems = "center";
  realtimeRow.innerHTML = `
      <span style="font-weight: 600; color: #c9d1d9;">Realtime Answers</span>
      <div class="toggle-switch-wrapper" id="realtime-toggle" style="pointer-events:none;">
          <div class="toggle-switch" id="realtime-toggle-ui">
              <div class="toggle-thumb"></div>
          </div>
      </div>
  `;

  realtimeSettingsContainer.appendChild(realtimeRow);
  menu.appendChild(realtimeSettingsContainer);

  const bubbleSheetContainer = document.createElement("div");
  bubbleSheetContainer.id = "bubble-sheet-container";
  bubbleSheetContainer.classList.add("bubble-sheet-container");
  bubbleSheetContainer.style.display = "none";
  
  const customSelect = layoutSelectContainer.querySelector("#custom-layout-select");
  const customSelectTrigger = layoutSelectContainer.querySelector("#custom-layout-select-trigger");
  const options = layoutSelectContainer.querySelectorAll(".custom-layout-option");
  const selectedText = layoutSelectContainer.querySelector("#custom-layout-selected-text");

  customSelectTrigger.addEventListener("click", () => {
    customSelect.classList.toggle("open");
    customSelectTrigger.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!customSelect.contains(e.target)) {
      customSelect.classList.remove("open");
      customSelectTrigger.classList.remove("open");
    }
  });

  options.forEach(option => {
    option.addEventListener("click", async (e) => {
      const val = option.dataset.value;
      const title = option.querySelector('.option-title').textContent;
      
      selectedText.textContent = title;
      customSelect.classList.remove("open");
      customSelectTrigger.classList.remove("open");
      
      // Cleanup any existing modes
      const oldExitBtn = document.getElementById("exit-exam-mode-btn");
      if (oldExitBtn) oldExitBtn.remove();
      
      document.body.classList.remove("split-screen-active");
      menu.style = ""; // reset menu
      document.querySelector("header").style.display = "";
      document.getElementById("top-bar").style.display = "";
      if (globalTimer) {
        document.getElementById("top-bar").after(globalTimer);
      }
      
      // Hide pdf viewer if active
      const pdfViewer = document.getElementById("new-x-pdf-viewer");
      if (pdfViewer && pdfViewer.classList.contains("visible")) {
        globalPDFSystem.toggle(null); // Just toggles off
      }
      // Cleanup CBT practice mode
      const cbtContainer = document.getElementById("cbt-system-container");
      if (cbtContainer) cbtContainer.remove();

      const buttonsContainer = document.querySelector(".bubble-sheet-buttons-container");
      const markContainer = document.getElementById("exam-mark");

      if (val === "handout") {
         pdfButtonsContainer.style.display = "flex";
         realtimeSettingsContainer.style.display = "block";
         bubbleSheetContainer.style.display = "grid";
         if (buttonsContainer) buttonsContainer.style.display = "flex";
         if (markContainer) markContainer.style.display = "block";
      } else if (val === "exam") {
         pdfButtonsContainer.style.display = "none";
         // Enter split screen
         document.body.classList.add("split-screen-active");
         
         globalPDFSystem.toggle(basePdfUrl);
         
         // Restore original exam screen layout styling
         menu.style.position = "fixed";
         menu.style.right = "0";
         menu.style.top = "0";
         menu.style.width = "350px";
         menu.style.height = "100vh";
         menu.style.overflowY = "auto";
         menu.style.backgroundColor = "#1e1e1e";
         menu.style.color = "#c9d1d9";
         menu.style.zIndex = "100000";
         menu.style.padding = "20px 20px 80px 20px";
         menu.style.margin = "0";
         menu.style.borderRadius = "0";
         menu.style.maxWidth = "100%";
         menu.style.border = "none";
         menu.style.boxShadow = "none";
         
         document.querySelector("header").style.display = "none";
         document.getElementById("top-bar").style.display = "none";
         
         if (globalTimer) {
            menu.insertBefore(globalTimer, menu.firstChild);
         }
         bubbleSheetContainer.style.display = "grid";
         
         let exitExamModeBtn = document.createElement("button");
         exitExamModeBtn.id = "exit-exam-mode-btn";
         exitExamModeBtn.className = "exit-exam-mode-btn";
         exitExamModeBtn.style.display = "flex";
         exitExamModeBtn.innerHTML = `
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
           Exit Exam Layout
         `;
         
         // We append it to .pdf-header-left so it appears in the PDF toolbar
         const pollForHeader = setInterval(() => {
           const pdfHeaderLeft = document.querySelector(".pdf-header-left");
           if (pdfHeaderLeft) {
             pdfHeaderLeft.appendChild(exitExamModeBtn);
             clearInterval(pollForHeader);
           }
         }, 100);
         
         exitExamModeBtn.addEventListener("click", () => {
           const handoutOption = document.querySelector('.custom-layout-option[data-value="handout"]');
           if (handoutOption) handoutOption.click();
         });
         
         // make submit, reveal, and mark visible in exam mode too
         realtimeSettingsContainer.style.display = "block";
         if (buttonsContainer) buttonsContainer.style.display = "flex";
         if (markContainer) markContainer.style.display = "block";
      } else if (val === "practice") {
         // This is removed from view but keep logic in case we want to bring it back
         // Update: the user said "also remove practice button that inside exam layout",
         // we'll actually just hide it in CSS when split screen is active, or we could remove it from the select menu entirely.
         // Actually the user wants it removed from "inside exam layout" or maybe they mean the select menu? We will remove it here just in case.
         pdfButtonsContainer.style.display = "none";
         realtimeSettingsContainer.style.display = "none";
         bubbleSheetContainer.style.display = "none";
         if (buttonsContainer) buttonsContainer.style.display = "none";
         if (markContainer) markContainer.style.display = "none";
         
         let doc = window.globalPDFSystem?.pdfDocument;
         try {
             if (!doc) {
               selectedText.textContent = "Loading...";
               customSelectTrigger.style.pointerEvents = "none";
               let loadingTask = pdfjsLib.getDocument(basePdfUrl);
               doc = await loadingTask.promise;
             }
             if (doc) {
               const module = await import("./cbt-mode.js");
               const cbt = new module.CBTSystem();
               cbt.init(doc, { modelAnswers, basePdfUrl });
             } else {
               alert("Failed to load PDF for Practice Mode.");
               const handoutOpt = document.querySelector('.custom-layout-option[data-value="handout"]');
               if (handoutOpt) handoutOpt.click();
             }
         } catch (error) {
             console.error(error);
             alert("Error starting Practice Mode.");
             const handoutOpt = document.querySelector('.custom-layout-option[data-value="handout"]');
             if (handoutOpt) handoutOpt.click();
         } finally {
             customSelectTrigger.style.pointerEvents = "auto";
         }
      }
    });
  });

  let isRealtimeAnswers = false;
  realtimeRow.onclick = () => {
    isRealtimeAnswers = !isRealtimeAnswers;
    document
      .getElementById("realtime-toggle-ui")
      .classList.toggle("active", isRealtimeAnswers);
    if (isRealtimeAnswers) {
      // Apply it immediately for all currently answered
      if (typeof submitBehavior === "function") {
        submitBehavior(userAnswers);
      }
    } else {
      // Clear all marks
      for (let i = 0; i < modelAnswers.length; i++) {
        const Question = document.getElementById(`question-${i}-number`);
        if (Question) {
          Question.classList.remove(
            "wrong-question",
            "correct-question",
            "discounted-question",
          );
        }
        const opts = ["a", "b", "c", "d"];
        opts.forEach((o) => {
          const el = document.getElementById(`question-${i}-${o}`);
          if (el) {
            el.classList.remove(
              "corrected-question",
              "corrected-discounted-question",
            );
          }
        });
      }
      const markEl = document.getElementById("exam-mark");
      if (
        markEl &&
        markEl.textContent.trim() !== `- / ${modelAnswers.length}`
      ) {
        markEl.textContent = `- / ${modelAnswers.length}`;
        markEl.classList.remove("ACE");
      }
    }
  };

  let modelAnswers =
    level == "cr"
      ? crSubjectsMS[subject][year][session][variant]
      : level == "ol"
        ? olSubjectsMS[subject][year][session][variant]
        : level == "al"
          ? alSubjectsMS[subject][year][session][variant]
          : "";
  let localKey = `${subject.toLowerCase().substring(0, 3)}${level
    .toLowerCase()
    .substring(0, 1)}${Number(year) - 2000}${session}${Number(variant) + 1}`;

  if (localStorage.getItem(localKey) == null) {
    localStorage.setItem(
      localKey,
      Array.from({ length: 40 }).fill("N").join(""),
    );
    localStorage.setItem(localKey + "s", "");
  }

  if (
    useLocalAnswers ||
    localStorage.getItem(localKey + "s", "") != "" ||
    localStorage.getItem(localKey + "s", "") != null
  ) {
    userAnswers = localStorage.getItem(localKey).split("");
  } else {
    userAnswers = Array(40).fill("N");
  }

  for (let i = 0; i < modelAnswers.length; i++) {
    const questionNumber = document.createElement("div");
    questionNumber.classList.add("bubble-box");
    questionNumber.textContent = i + 1;
    questionNumber.id = `question-${i}-number`;
    bubbleSheetContainer.appendChild(questionNumber);

    const questionA = document.createElement("div");
    questionA.classList.add("bubble-box");
    questionA.classList.add("bubble-choice");
    questionA.textContent = "A";
    questionA.id = `question-${i}-a`;

    const questionB = document.createElement("div");
    questionB.classList.add("bubble-box");
    questionB.classList.add("bubble-choice");
    questionB.textContent = "B";
    questionB.id = `question-${i}-b`;

    const questionC = document.createElement("div");
    questionC.classList.add("bubble-box");
    questionC.classList.add("bubble-choice");
    questionC.textContent = "C";
    questionC.id = `question-${i}-c`;

    const questionD = document.createElement("div");
    questionD.classList.add("bubble-box");
    questionD.classList.add("bubble-choice");
    questionD.textContent = "D";
    questionD.id = `question-${i}-d`;

    const options = ["A", "B", "C", "D"];
    const questionEls = [questionA, questionB, questionC, questionD];

    // Set initial classes
    options.forEach((opt, idx) => {
      if (userAnswers[i] === opt) {
        questionEls[idx].classList.add("bubble-chosen");
      } else {
        questionEls[idx].classList.remove("bubble-chosen");
      }

      // Setup event listeners
      questionEls[idx].addEventListener("click", () => {
        let isSelecting = userAnswers[i] !== opt;

        // Update UI
        questionEls.forEach((el, elIdx) => {
          if (elIdx === idx && isSelecting) {
            el.classList.add("bubble-chosen");
          } else {
            el.classList.remove("bubble-chosen");
          }
        });

        // Update logical state
        userAnswers[i] = isSelecting ? opt : "N";

        // Update localStorage
        let localAnswersString = localStorage.getItem(localKey).split("");
        localAnswersString[i] = userAnswers[i];
        localStorage.setItem(localKey, localAnswersString.join(""));

        if (isRealtimeAnswers && typeof submitBehavior === "function") {
          submitBehavior(userAnswers);
        }
      });

      bubbleSheetContainer.appendChild(questionEls[idx]);
    });
  }
  menu.appendChild(bubbleSheetContainer);

  if (useLocalAnswers) {
    let waitForBubbleSheet = setTimeout(() => {
      let focus = userAnswers.length - 1;
      for (let i = 0; i < userAnswers.length; i++) {
        if (userAnswers[i] == "N") {
          focus = i;
          break;
        }
      }
      if (focus > 3) {
        const focusElement = document.getElementById(
          `question-${focus - 2}-number`,
        );
        focusElement.scrollIntoView({ behavior: "smooth" });
        clearTimeout(waitForBubbleSheet);
      }
    }, 1);
  }

  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("bubble-sheet-buttons-container");
  buttonsContainer.style.display = "none";
  const submitButton = document.createElement("button");
  submitButton.textContent = "Submit";
  submitButton.classList.add("bubble-sheet-submit-button");
  submitButton.id = "bubble-sheet-submit-button";

  const revealButton = document.createElement("button");
  revealButton.textContent = "Reveal all answers";
  revealButton.classList.add("bubble-sheet-reveal-button");
  revealButton.id = "bubble-sheet-reveal-button";

  const mark = document.createElement("div");
  mark.id = "exam-mark";
  mark.classList.add("exam-mark");
  mark.style.display = "none";
  mark.textContent = `- / ${modelAnswers.length}`;

  if (localStorage.getItem(localKey + "s") != "") {
    let waitForBubbleSheet = setTimeout(() => {
      submitBehavior(localStorage.getItem(localKey + "s"));
      for (let i = 0; i < localStorage.getItem(localKey + "s").length; i++) {
        if (localStorage.getItem(localKey + "s").split("")[i] == "A") {
          document
            .getElementById(`question-${i}-a`)
            .classList.add("bubble-chosen");
          document
            .getElementById(`question-${i}-b`)
            .classList.remove("bubble-chosen");
          document
            .getElementById(`question-${i}-c`)
            .classList.remove("bubble-chosen");
          document
            .getElementById(`question-${i}-d`)
            .classList.remove("bubble-chosen");
        } else if (localStorage.getItem(localKey + "s").split("")[i] == "B") {
          document
            .getElementById(`question-${i}-a`)
            .classList.remove("bubble-chosen");
          document
            .getElementById(`question-${i}-b`)
            .classList.add("bubble-chosen");
          document
            .getElementById(`question-${i}-c`)
            .classList.remove("bubble-chosen");
          document
            .getElementById(`question-${i}-d`)
            .classList.remove("bubble-chosen");
        } else if (localStorage.getItem(localKey + "s").split("")[i] == "C") {
          document
            .getElementById(`question-${i}-a`)
            .classList.remove("bubble-chosen");
          document
            .getElementById(`question-${i}-b`)
            .classList.remove("bubble-chosen");
          document
            .getElementById(`question-${i}-c`)
            .classList.add("bubble-chosen");
          document
            .getElementById(`question-${i}-d`)
            .classList.remove("bubble-chosen");
        } else if (localStorage.getItem(localKey + "s").split("")[i] == "D") {
          document
            .getElementById(`question-${i}-a`)
            .classList.remove("bubble-chosen");
          document
            .getElementById(`question-${i}-b`)
            .classList.remove("bubble-chosen");
          document
            .getElementById(`question-${i}-c`)
            .classList.remove("bubble-chosen");
          document
            .getElementById(`question-${i}-d`)
            .classList.add("bubble-chosen");
        }
      }
      createModal(
        "", // title
        [
          `You have already submitted this exam before and got ${
            recalculatePastExam(localStorage.getItem(localKey + "s"))[0]
          } / ${recalculatePastExam(localStorage.getItem(localKey + "s"))[1]}.`,
          `Do you want to solve it again or inspect your answers?`,
        ], // content,
        [
          "Resolve",
          () => {
            localStorage.setItem(
              localKey,
              Array.from({ length: 40 }).fill("N").join(""),
            );
            localStorage.setItem(localKey + "s", "");
            resetBubbleSheet();
          },
        ],
        ["Inspect", () => {}],
      );

      clearTimeout(waitForBubbleSheet);
    }, 1);
  } else if (
    localStorage.getItem(localKey) != "" &&
    localStorage.getItem(localKey) != null &&
    localStorage.getItem(localKey) !=
      "NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN" &&
    !useLocalAnswers
  ) {
    let waitForBubbleSheet = setTimeout(() => {
      createModal(
        "", // title
        [
          `You already started solving this exam before.`,
          `Do you want to continue where you left?`,
        ], // content,
        [
          "Continue",
          () => {
            resetBubbleSheet(true);
          },
        ],
        [
          "Restart",
          () => {
            localStorage.setItem(
              localKey,
              Array.from({ length: 40 }).fill("N").join(""),
            );
            localStorage.setItem(localKey + "s", "");
            resetBubbleSheet();
          },
        ],
        () => {
          resetBubbleSheet(true);
        },
      );

      clearTimeout(waitForBubbleSheet);
    }, 1);
  }

  submitButton.addEventListener("click", () => {
    let userAnswersTemp = userAnswers;
    if (subject == "Economics") {
      userAnswersTemp = userAnswersTemp.join("").substring(0, 30).split("");
    }
    if (userAnswersTemp.includes("N")) {
      createModal(
        "Are you sure?", // title
        [
          "Seems like there are some questions you missed. <br> Only the solved questions will be graded.",
        ], // content,
        [
          "Confirm",
          () => {
            localStorage.setItem(
              localKey + "s",
              localStorage.getItem(localKey).split("").join(""),
            );
            submitBehavior(localStorage.getItem(localKey + "s"));
            if (
              recalculatePastExam(localStorage.getItem(localKey + "s"))[0] ==
              recalculatePastExam(localStorage.getItem(localKey + "s"))[1]
            ) {
              jsConfetti.addConfetti();
            }
            document
              .querySelector(".timer-play-icon")
              .classList.toggle("hidden");
            document
              .querySelector(".timer-pause-icon")
              .classList.toggle("hidden");
            clearInterval(timerInterval);
            isTimerRunning = false;
            timerAudio.pause();
            timerAudio.currentTime = 0;
            document.querySelector(".toggle-clock path").style.fill = "";
          },
        ],
        ["Cancel", () => {}],
      );
    } else {
      localStorage.setItem(
        localKey + "s",
        localStorage.getItem(localKey).split("").join(""),
      );
      submitBehavior(localStorage.getItem(localKey + "s"));
      if (
        recalculatePastExam(localStorage.getItem(localKey + "s"))[0] ==
        recalculatePastExam(localStorage.getItem(localKey + "s"))[1]
      ) {
        jsConfetti.addConfetti();
      }
      document.querySelector(".timer-play-icon").classList.toggle("hidden");
      document.querySelector(".timer-pause-icon").classList.toggle("hidden");
      clearInterval(timerInterval);
      isTimerRunning = false;
      timerAudio.pause();
      timerAudio.currentTime = 0;
      document.querySelector(".toggle-clock path").style.fill = "";
    }
  });

  revealButton.addEventListener("click", () => {
    createModal(
      "Are you sure?", // title
      [
        "This will only highlight the correct answers and will not correct your answers.",
      ], // content,
      [
        "Confirm",
        () => {
          revealBehavior();
        },
      ],
      ["Cancel", () => {}],
    );
  });
  buttonsContainer.appendChild(submitButton);
  buttonsContainer.appendChild(revealButton);

  menu.appendChild(buttonsContainer);
  menu.appendChild(mark);

  // timer
  let timerTimes = {
    al_physics: [1, 1, 5, 0, 0],
    al_biology: [1, 0, 0, 0, 0],
    al_chemistry: [1, 0, 0, 0, 0],
    default: [0, 4, 5, 0, 0],
  };

  let timeArray = Object.keys(timerTimes).includes(
    `${level}_${subject.toLowerCase()}`,
  )
    ? [...timerTimes[`${level}_${subject.toLowerCase()}`]]
    : [...timerTimes["default"]];
  let isTimerRunning;
  let timerModal = createClock();
  let timerAudio = new Audio(TimerAudio);

  globalTimer = timerModal;
  document.getElementById("top-bar").after(globalTimer);

  document
    .querySelector(".timer-play-pause-button")
    .addEventListener("click", () => {
      document.querySelector(".timer-play-icon").classList.toggle("hidden");
      document.querySelector(".timer-pause-icon").classList.toggle("hidden");
      if (!isTimerRunning) {
        autoClock();
        document.querySelector(".toggle-clock path").style.fill = "#1aad72";
      } else {
        clearInterval(timerInterval);
        isTimerRunning = false;
        timerAudio.pause();
        timerAudio.currentTime = 0;
        document.querySelector(".toggle-clock path").style.fill = "";
      }
    });

  document.querySelector(".timer-stop-button").addEventListener("click", () => {
    document.querySelector(".timer-play-icon").classList.remove("hidden");
    document.querySelector(".timer-pause-icon").classList.add("hidden");
    document.querySelector(".toggle-clock path").style.fill = "";
    clearInterval(timerInterval);
    isTimerRunning = false;
    timeArray = Object.keys(timerTimes).includes(
      `${level}_${subject.toLowerCase()}`,
    )
      ? [...timerTimes[`${level}_${subject.toLowerCase()}`]]
      : [...timerTimes["default"]];
    setClock(timeArray);
  });

  document
    .querySelector(".timer-toggle-button")
    .addEventListener("click", () => {
      document.querySelector(".clock").classList.remove("clock-opened");
      document
        .querySelector(".toggle-clock")
        .classList.remove("toggle-clock-opened");
    });

  function setClock(time) {
    const digits = document.querySelectorAll(".digit");
    digits.forEach((digit, dIndex) => {
      let numbers = digit.children;
      let target = time[dIndex % 5];
      if (target != null) {
        for (let i = 0; i < 10; i++) {
          const number = numbers[i];
          number.classList.remove("current");
          number.classList.remove("out");
          if (i < target) {
            number.classList.add("out");
          } else if (i == target) {
            number.classList.add("current");
          }
        }
      }
    });
  }

  function autoClock() {
    isTimerRunning = true;
    setClock(timeArray);
    if (
      timeArray[0] > 0 ||
      timeArray[1] > 0 ||
      timeArray[2] > 0 ||
      timeArray[3] > 0 ||
      timeArray[4] > 0
    ) {
      timerInterval = setInterval(() => {
        timeArray[4] -= 1;
        if (timeArray[4] < 0) {
          timeArray[3] -= 1;
          timeArray[4] = 9;
        }
        if (timeArray[3] < 0) {
          timeArray[2] -= 1;
          timeArray[3] = 5;
        }
        if (timeArray[2] < 0) {
          timeArray[1] -= 1;
          timeArray[2] = 9;
        }
        if (timeArray[1] < 0) {
          timeArray[0] -= 1;
          timeArray[1] = 5;
        }
        if (
          timeArray[0] <= 0 &&
          timeArray[1] <= 0 &&
          timeArray[2] <= 0 &&
          timeArray[3] <= 0 &&
          timeArray[4] <= 0
        ) {
          clearInterval(timerInterval); //finish
          timerAudio.play();
          setTimeout(() => {
            timerAudio.pause();
            timerAudio.currentTime = 0;
          }, 14000);
          createModal(
            "Time is finished",
            [],
            [
              "OK",
              () => {
                timerAudio.pause();
                timerAudio.currentTime = 0;
              },
            ],
            undefined,
            () => {
              timerAudio.pause();
              timerAudio.currentTime = 0;
            },
          );
        }

        setClock(timeArray);
      }, 1000);
    }
  }

  function createClock() {
    let clockElementContainer = document.createElement("div");
    clockElementContainer.classList.add("clock-container");

    let toggleClock = document.createElement("div");
    toggleClock.classList.add("toggle-clock");
    toggleClock.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path d="M128 44a96 96 0 1 0 96 96a96.11 96.11 0 0 0-96-96m0 168a72 72 0 1 1 72-72a72.08 72.08 0 0 1-72 72m36.49-112.49a12 12 0 0 1 0 17l-28 28a12 12 0 0 1-17-17l28-28a12 12 0 0 1 17 0M92 16a12 12 0 0 1 12-12h48a12 12 0 0 1 0 24h-48a12 12 0 0 1-12-12"/></svg>`;

    let clockElement = document.createElement("div");
    clockElement.classList.add("clock");
    clockElement.innerHTML = `
        <div class="digit"><p class="current">0</p><p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p><p>7</p><p>8</p><p>9</p></div>
        <p>:</p>
        <div class="digit"><p class="current">0</p><p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p><p>7</p><p>8</p><p>9</p></div>
        <div class="digit"><p class="current">0</p><p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p><p>7</p><p>8</p><p>9</p></div>
        <p>:</p>
        <div class="digit"><p class="current">0</p><p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p><p>7</p><p>8</p><p>9</p></div>
        <div class="digit"><p class="current">0</p><p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p><p>7</p><p>8</p><p>9</p>
        </div>
        <button class="timer-toggle-button" id="timer-toggle-button">
        <svg class="timer-toggle-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path fill="#000000" d="M168.49 199.51a12 12 0 0 1-17 17l-80-80a12 12 0 0 1 0-17l80-80a12 12 0 0 1 17 17L97 128Z"/></svg>
        </button>
        <button class="timer-stop-button" id="timer-stop-button">
        <svg class="timer-play-stop" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path fill="#000000" d="M140 80v41.21l34.17 20.5a12 12 0 1 1-12.34 20.58l-40-24A12 12 0 0 1 116 128V80a12 12 0 0 1 24 0m-12-52a99.38 99.38 0 0 0-70.76 29.34c-4.69 4.74-9 9.37-13.24 14V64a12 12 0 0 0-24 0v40a12 12 0 0 0 12 12h40a12 12 0 0 0 0-24H57.77c5.23-6 10.6-11.78 16.49-17.74a76 76 0 1 1 1.58 109a12 12 0 0 0-16.48 17.46A100 100 0 1 0 128 28"/></svg>
        </button>
        <button class="timer-play-pause-button" id="timer-play-pause-button">
        <svg class="timer-play-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path fill="#000000" d="M240 128a15.74 15.74 0 0 1-7.6 13.51L88.32 229.65a16 16 0 0 1-16.2.3A15.86 15.86 0 0 1 64 216.13V39.87a15.86 15.86 0 0 1 8.12-13.82a16 16 0 0 1 16.2.3l144.08 88.14A15.74 15.74 0 0 1 240 128"/></svg>
        <svg class="timer-pause-icon hidden" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path fill="#000000" d="M216 48v160a16 16 0 0 1-16 16h-40a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h40a16 16 0 0 1 16 16M96 32H56a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h40a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16"/></svg>
        </button>`;

    toggleClock.addEventListener("click", () => {
      toggleClock.classList.add("toggle-clock-opened");
      clockElement.classList.add("clock-opened");
      setClock(timeArray);
    });

    clockElementContainer.appendChild(clockElement);
    clockElementContainer.appendChild(toggleClock);
    return clockElementContainer;
  }

  function shortcutsFunc(e) {
    try {
      if (e.key == "z" && !e.shiftKey && !e.ctrlKey) {
        const is2025OrLater = Number(year) >= 2025;
        const filename = `${subjectCode[level.toUpperCase() + subject]}_${session}${Number(year) - 2000}_qp_${subject == "Economics" ? 1 : level == "al" || level == "cr" ? 1 : 2}${Number(variant) + 1}.pdf`;
        
        const basePdfUrl = is2025OrLater
          ? `/api/pdf-proxy?url=` + encodeURIComponent(`https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/${filename}`)
          : `https://zieddev.github.io/mcq-mate/pdfs/${level.toUpperCase()}-${subject}/${year}/${
              session == "s" ? "May-Jun" : session == "w" ? "Oct-Nov" : "Feb-Mar"
            }/${filename}`;
        globalPDFSystem.toggle(basePdfUrl);
      }
      
      if (e.key == "p" && !e.shiftKey && !e.ctrlKey) {
        if (!document.querySelector("#cbt-layout")) {
            let btns = document.querySelectorAll('.bubble-sheet-pdf-btn');
            for(let b of btns) {
                if (b.textContent.includes('Practice Mode')) {
                    b.click();
                    break;
                }
            }
        }
      }

      if (e.key == "c" && !e.shiftKey && !e.ctrlKey) {
        document.querySelector(".clock").classList.toggle("clock-opened");
        document
          .querySelector(".toggle-clock")
          .classList.toggle("toggle-clock-opened");
      }
    } catch (error) {
      console.log("error", error);
    }
  }
  document.addEventListener("keyup", (e) => {
    shortcutsFunc(e);
  });

  const switchToPdf = document.createElement("div");
  switchToPdf.classList.add("switch-to-pdf");
  switchToPdf.title = "Open PDF (Z)";
  // Elegant dark Z logo as SVG
  switchToPdf.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" style="border-radius: 50%; overflow: hidden; pointer-events:none;">
      <rect width="100" height="100" style="fill:#010409 !important;" />
      <circle cx="50" cy="50" r="45" style="fill:none !important; stroke:#238636 !important;" stroke-width="4" />
      <path d="M30 35 h40 l-25 30 h30" style="fill:none !important; stroke:#e6edf3 !important; width:auto !important; height:auto !important;" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>
    </svg>
  `;
  switchToPdf.style.display = "flex";
  switchToPdf.style.alignItems = "center";
  switchToPdf.style.justifyContent = "center";
  switchToPdf.style.padding = "2px";
  switchToPdf.addEventListener("click", () => {
    shortcutsFunc({ key: "z", shiftKey: false, ctrlKey: false });
  });

  menu.appendChild(switchToPdf);

  const iButton = document.createElement("div");
  iButton.classList.add("i-button");
  iButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 5 15"><circle cx="2" cy="2" r="2"/><path d="M5,13.51c0,.65-.42,1.21-1.01,1.4-.15,.06-.31,.09-.48,.09h-.01c-1.37,0-2.49-1.11-2.49-2.49v-4.11C.42,8.21,0,7.65,0,6.99s.42-1.21,1.01-1.4c.15-.06,.31-.09,.48-.09h.01c1.37,0,2.49,1.11,2.49,2.49v4.11c.59,.19,1.01,.75,1.01,1.41Z"/></svg>`;
  iButton.addEventListener("click", () => {
    createModal(
      "Color Code for answers", // title
      [
        `<span class="green">Green</span> → Correct Answer`,
        `<span class="red">Red</span> → Incorrect Answer`,
        `<span class="purple">Purple</span> → Discounted Answer <button id="i-button-discounted"><svg class="discounted-question-info" id="discounted-question-info" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 5 15"><circle cx="2" cy="2" r="2"/><path d="M5,13.51c0,.65-.42,1.21-1.01,1.4-.15,.06-.31,.09-.48,.09h-.01c-1.37,0-2.49-1.11-2.49-2.49v-4.11C.42,8.21,0,7.65,0,6.99s.42-1.21,1.01-1.4c.15-.06,.31-.09,.48-.09h.01c1.37,0,2.49,1.11,2.49,2.49v4.11c.59,.19,1.01,.75,1.01,1.41Z"/></svg></button>`,
      ], // content
      ["Close", () => {}],
    );

    const iButtonDiscounted = document.getElementById("i-button-discounted");
    iButtonDiscounted.addEventListener("click", () => {
      document
        .getElementById("modal-container")
        .parentNode.removeChild(document.getElementById("modal-container"));
      createModal(
        "Discounted Questions",
        ["These are disqualified question from the mark scheme."],
        ["Close", () => {}],
      );
    });
  });
  menu.appendChild(iButton);

  function recalculatePastExam(userAnswers) {
    let correctAnswers = 0;
    for (let i = 0; i < modelAnswers.length; i++) {
      if (modelAnswers[i] == "Q" || modelAnswers[i] == userAnswers[i]) {
        correctAnswers++;
      }
    }

    return [correctAnswers, modelAnswers.length];
  }

  function resetBubbleSheet(useLocalAnswers) {
    main.innerHTML = "";
    globalPDFSystem.destroy();
    if (globalTimer != undefined) {
      globalTimer.parentNode.removeChild(globalTimer);
      globalTimer = undefined;
    }
    if (timerInterval != undefined) {
      clearInterval(timerInterval);
      timerInterval = undefined;
    }
    main.appendChild(
      createBubbleSheetMenu(
        level,
        subject,
        year,
        session,
        variant,
        useLocalAnswers,
      ),
    );
  }

  function submitBehavior(userAnswers) {
    let correctAnswers = 0;
    for (let i = 0; i < modelAnswers.length; i++) {
      const Question = document.getElementById(`question-${i}-number`);
      const correctedQuestion = document.getElementById(
        `question-${i}-${modelAnswers[i].toLowerCase()}`,
      );

      Question.classList.remove("wrong-question");
      Question.classList.remove("correct-question");
      Question.classList.remove("discounted-question");

      const opts = ["a", "b", "c", "d"];
      opts.forEach((o) => {
        const el = document.getElementById(`question-${i}-${o}`);
        if (el) {
          el.classList.remove(
            "corrected-question",
            "corrected-discounted-question",
          );
        }
      });

      if (modelAnswers[i] == "Q") {
        correctAnswers++;
        Question.classList.add("discounted-question");
      } else if (modelAnswers[i] == userAnswers[i]) {
        correctAnswers++;
        Question.classList.add("correct-question");
      } else if (userAnswers[i] == "" || userAnswers[i] == "N") {
        continue;
      } else {
        Question.classList.add("wrong-question");

        correctedQuestion.classList.add("corrected-question");
      }
    }
    mark.textContent = `${correctAnswers} / ${modelAnswers.length}`;
    if (correctAnswers == modelAnswers.length) {
      mark.classList.add("ACE");
    } else {
      mark.classList.remove("ACE");
    }
  }

  function revealBehavior() {
    for (let i = 0; i < modelAnswers.length; i++) {
      if (modelAnswers[i].toLowerCase() != "q") {
        const correctedQuestion = document.getElementById(
          `question-${i}-${modelAnswers[i].toLowerCase()}`,
        );
        correctedQuestion.classList.add("corrected-question");
      } else {
        const discountedQuestionA = document.getElementById(`question-${i}-a`);
        const discountedQuestionB = document.getElementById(`question-${i}-b`);
        const discountedQuestionC = document.getElementById(`question-${i}-c`);
        const discountedQuestionD = document.getElementById(`question-${i}-d`);

        discountedQuestionA.classList.add("corrected-discounted-question");
        discountedQuestionB.classList.add("corrected-discounted-question");
        discountedQuestionC.classList.add("corrected-discounted-question");
        discountedQuestionD.classList.add("corrected-discounted-question");
      }
    }
  }

  return menu;
}

// Global EventListener
function addGlobalEventListener(type, selector, callback, options) {
  document.addEventListener(
    type,
    (e) => {
      if (e.target.matches(selector)) callback(e);
    },
    options,
  );
}

// appending home to main
const main = document.getElementById("main");
changePath("home");
