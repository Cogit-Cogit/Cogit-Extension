function saveCode(isActive) {
  if (!isActive) return;

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
  loadingImg.src = chrome.runtime.getURL('assets/images/loading.gif');
  loadingImg.style = 'width:30px';
  funcButtons.prepend(loadingImg);

  const intervalId = setInterval(function () {
    let modalTitle = document.querySelector('.modal-title');
    codeResult = modalTitle.textContent;
    var codeRunningTime = 0;
    var algorithmQuestId = document
      .querySelector('div.main > div.lesson-content')
      .getAttribute('data-lesson-id');

    var algorithmName = document.querySelector('.challenge-title').textContent;

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
        codeRunningTime = runTimes.reduce((acc, value) => acc + value, 0) / runTimes.length + 'ms';

        console.log(codeContent);
        console.log(codeLanguage);
        console.log(codeRunningTime);
        console.log(algorithmQuestId);
        console.log(algorithmName);
        console.log(codeFileExtension);

        uploadCode(
          codeContent,
          true,
          'PROGRAMMERS',
          codeLanguage,
          codeRunningTime,
          algorithmQuestId,
          codeFileExtension,
          algorithmName
        );

        loadingImg.remove();
        cogitImg.src = chrome.runtime.getURL('assets/images/cogit.png');
        cogitImg.style = 'width:30px; margin-left:10px';
        modalTitle.appendChild(cogitImg);

      } else {
        loadingImg.remove();
        cogitImg.src = chrome.runtime.getURL('assets/images/cogit_gray.png');
        cogitImg.style = 'width:30px; margin-left:10px';
        modalTitle.appendChild(cogitImg);
      }
    }
  }, 2000);
}

const submitButton = document.getElementById('submit-code');
if (submitButton != null) {
  submitButton.addEventListener('click', function () {
    checkActive(saveCode);
  });
}
