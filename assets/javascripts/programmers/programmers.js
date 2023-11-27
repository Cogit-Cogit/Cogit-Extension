const PLATFORM_URL = 'https://school.programmers.co.kr/learn/courses/30/lessons/';

const submitButton = document.getElementById('submit-code');
if (submitButton != null) {
  submitButton.addEventListener('click', function () {
    chrome.storage.local.get('active', function (result) {
      if (result.active) {
        if (result.active == 'active') {
          saveCode();
        }
      }
    });
  });
}

function saveCode() {
  let codeLanguage = document.getElementById('tour7').querySelector('button').textContent.trim();
  let codeFileExtension = programmersExtension[codeLanguage];
  codeLanguage = programmersLanguages[codeLanguage];

  const codeMirrorLines = document.querySelectorAll('.CodeMirror-line');
  const linesContent = Array.from(codeMirrorLines).map((line) => line.textContent);
  const codeContent = linesContent.join('\n');

  let codeResult = document.querySelector('.modal-title');
  if (codeResult) {
    codeResult.textContent = '로딩중';
  }

  let funcButtons = document.querySelector('.func-buttons');
  let loadingImg = document.createElement('img');
  loadingImg.src = 'https://cogitusercode.s3.ap-northeast-2.amazonaws.com/assets/loading.gif';
  loadingImg.style = 'width:30px';
  funcButtons.prepend(loadingImg);

  const intervalId = setInterval(function () {
    let modalTitle = document.querySelector('.modal-title');
    codeResult = modalTitle.textContent;
    var codeRunningTime = 0;
    var algorithmQuestNumber = document
      .querySelector('div.main > div.lesson-content')
      .getAttribute('data-lesson-id');

    if (codeResult && !codeResult.includes('로딩중')) {
      clearInterval(intervalId);

      let result = false;

      funcButtons.remove();
      let cogitImg = document.createElement('img');

      if (codeResult.includes('정답')) {
        const timeElements = document.querySelectorAll('.console-test-group td.result.passed');
        const runTimes = [];

        for (var timeElement of timeElements) {
          var runTime = timeElement.innerText.match(/(\d+\.\d+)ms/);
          if (runTime) {
            runTimes.push(parseFloat(runTime[1]));
          }
        }
        codeRunningTime = runTimes.reduce((acc, value) => acc + value, 0) / runTimes.length;
        result = true;

        sendCode(
          codeContent,
          result,
          'PROGRAMMERS',
          codeLanguage,
          codeRunningTime,
          algorithmQuestNumber,
          codeFileExtension,
          `${PLATFORM_URL}${algorithmQuestNumber}`
        );

        cogitImg.src = 'https://cogitusercode.s3.ap-northeast-2.amazonaws.com/assets/cogit.png';
        cogitImg.style = 'width:30px; margin-left:10px';
        modalTitle.appendChild(cogitImg);
      } else {
        sendCode(
          codeContent,
          result,
          'PROGRAMMERS',
          codeLanguage,
          codeRunningTime,
          algorithmQuestNumber,
          codeFileExtension,
          `${PLATFORM_URL}${algorithmQuestNumber}`
        );

        cogitImg.src =
          'https://cogitusercode.s3.ap-northeast-2.amazonaws.com/assets/cogit_gray.png';
        cogitImg.style = 'width:30px; margin-left:10px';
        modalTitle.appendChild(cogitImg);
      }
    }
  }, 2000);
}
