function checkActive(callback) {
  //코깃 활성화 여부
  chrome.storage.local.get('active', function (result) {
    if (result.active && result.active == 'active') {
      callback(true);
    } else {
      callback(false);
    }
  });
}

function getResult(isActive) {
  if (isActive && localStorage.getItem('code')) {
    const code = localStorage.getItem('code'); //제출한 코드 가지고 오기
    localStorage.removeItem('code');

    let firstSolutionElement = document.querySelector('[id^="solution-"]');
    let resultElement = firstSolutionElement.querySelector('.result');
    let preContent = resultElement.querySelector('span').textContent;

    if (preContent.includes('중')) {
      firstSolutionElement = document.querySelector('[id^="solution-"]');
      resultElement = firstSolutionElement.querySelector('.result');
      let loadingImg = document.createElement('img');
      loadingImg.src = chrome.runtime.getURL("assets/images/loading.gif");
      loadingImg.style = 'width:20px';
      resultElement.appendChild(loadingImg);

      // 2초 간격으로 내용 확인
      const intervalId = setInterval(function () {
        firstSolutionElement = document.querySelector('[id^="solution-"]');
        resultElement = firstSolutionElement.querySelector('.result');
        let currentContent = resultElement.querySelector('span').textContent;

        if (currentContent === preContent && !currentContent.includes('중')) {
          //채점 완료
          clearInterval(intervalId); // setInterval 중지

          let codeLanguage = firstSolutionElement
            .querySelector('td:nth-child(7)')
            .querySelector('a')
            .textContent.trim();
          let codeFileExtension = baekjoonExtension[codeLanguage];
          codeLanguage = baekjoonLanguages[codeLanguage];
          let codeRunningTime = firstSolutionElement.querySelector('.time').textContent + 'ms';
          let algorithmQuestId = firstSolutionElement
            .querySelector('td:nth-child(3)')
            .querySelector('a').textContent;
          let algorithmName = firstSolutionElement
            .querySelector('td:nth-child(3)')
            .querySelector('a')
            .getAttribute('data-original-title');

          if (currentContent.includes('맞았습니다')) {
            loadingImg.remove();
            var cogitImg = document.createElement('img');
            cogitImg.src = chrome.runtime.getURL("assets/images/cogit.png");
            cogitImg.style = 'width:20px; margin-left:5px';
            resultElement.appendChild(cogitImg);
            
            console.log(code);
            console.log(codeLanguage);
            console.log(codeRunningTime);
            console.log(algorithmQuestId);
            console.log(algorithmName);
            console.log(codeFileExtension);

            // sendCode(
            //   code,
            //   true,
            //   'BAEKJOON',
            //   codeLanguage,
            //   codeRunningTime,
            //   algorithmQuestId,
            //   codeFileExtension,
            //   `${PLATFORM_URL}${algorithmQuestId}`
            // );
          } else {
            loadingImg.remove();
            var cogitGreyImg = document.createElement('img');
            cogitImg.src = chrome.runtime.getURL("assets/images/cogit_gray.png");
            cogitGreyImg.style = 'width:20px; margin-left:5px';
            resultElement.appendChild(cogitGreyImg);
          }
        } else {
          preContent = currentContent; // 현재 내용을 저장
        }
      }, 2000);
    } else {
      console.log('이미 전송한 코드입니다.');
    }
  } else {
    localStorage.removeItem('code');
  }
}

checkActive(getResult);
