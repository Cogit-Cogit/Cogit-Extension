const PLATFORM_URL = 'https://www.acmicpc.net/problem/';

let solutionElements = document.querySelectorAll('[id^="solution-"]');


if (solutionElements.length > 0) {
  let firstSolutionElement = solutionElements[0];
  let spanElement = firstSolutionElement.querySelector('span[data-color]');

  let preContent = spanElement.textContent;

  let isActive = false;
  chrome.storage.local.get('active', function (result) {
    if (result.active) {
      if (result.active == 'active') {
        isActive = true;
      }
    }
  });
  
  if (preContent.includes('중')) {

    let resultElement = firstSolutionElement.querySelector('.result');
    let loadingImg = document.createElement('img');
    loadingImg.src = 'https://cogitusercode.s3.ap-northeast-2.amazonaws.com/assets/loading.gif';
    loadingImg.style = 'width:20px';
    resultElement.appendChild(loadingImg);

    // 2초 간격으로 내용 확인
    const intervalId = setInterval(function () {
      chrome.storage.local.get('active', function (result) {
        if (result.active) {
          if (result.active == 'deactive') {
            clearInterval(intervalId); // setInterval 중지
          }
        }
      });
      solutionElements = document.querySelectorAll('[id^="solution-"]');
      firstSolutionElement = solutionElements[0];
      spanElement = firstSolutionElement.querySelector('span[data-color]');

      if (spanElement) {
        let currentContent = spanElement.textContent;

        if (currentContent === preContent && !currentContent.includes('중')) {
          clearInterval(intervalId); // setInterval 중지
          let codeLanguage = firstSolutionElement
            .querySelector('td:nth-child(7)')
            .querySelector('a')
            .textContent.trim();
          let codeFileExtension = baekjoonExtension[codeLanguage];
          codeLanguage = baekjoonLanguages[codeLanguage];
          let codeRunningTime = firstSolutionElement.querySelector('.time').textContent;
          let algorithmQuestId = firstSolutionElement
            .querySelector('td:nth-child(3)')
            .querySelector('a').textContent;

          if (localStorage.getItem('code')) {
            var code = localStorage.getItem('code');

            if (currentContent.includes('맞았습니다')) {
              loadingImg.remove();
              var cogitImg = document.createElement('img');
              cogitImg.src =
                'https://cogitusercode.s3.ap-northeast-2.amazonaws.com/assets/cogit.png';
              cogitImg.style = 'width:20px; margin-left:5px';
              
              spanElement.appendChild(cogitImg);

              sendCode(
                code,
                true,
                'BAEKJOON',
                codeLanguage,
                codeRunningTime,
                algorithmQuestId,
                codeFileExtension,
                `${PLATFORM_URL}${algorithmQuestId}`
              );

            } else if (
              currentContent.includes('틀렸습니다') ||
              currentContent.includes('시간 초과') ||
              currentContent.includes('메모리 초과')
            ) {
              loadingImg.remove();
              var cogitGreyImg = document.createElement('img');
              cogitGreyImg.src =
                'https://cogitusercode.s3.ap-northeast-2.amazonaws.com/assets/cogit_gray.png';
              cogitGreyImg.style = 'width:20px; margin-left:5px';
              spanElement.appendChild(cogitGreyImg);

              sendCode(
                code,
                false,
                'BAEKJOON',
                codeLanguage,
                codeRunningTime,
                algorithmQuestId,
                codeFileExtension,
                `${PLATFORM_URL}${algorithmQuestId}`
              );

            }
          }
        }
        preContent = currentContent; // 현재 내용을 저장
      }
    }, 2000);
  } else {
    console.log('이미 전송한 코드입니다.');
  }
}
