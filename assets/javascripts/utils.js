/**
 * base64로 문자열을 base64로 인코딩하여 반환합니다.
 * @param {string} str - base64로 인코딩할 문자열
 * @returns {string} - base64로 인코딩된 문자열
 */
function b64EncodeUnicode(str) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode(`0x${p1}`);
    })
  );
}

function createModal(isCorrect) {
  // 모달 창을 생성할 요소들을 만듭니다.
  const modal = document.createElement('div');
  modal.id = 'cogit_modal';
  modal.classList.add('modal-overlay');

  const modalWindow = document.createElement('div');
  modalWindow.classList.add('modal-window');

  const title = document.createElement('div');
  title.classList.add('title');
  title.innerHTML = `<h2>${isCorrect ? '정답입니다' : '틀렸습니다'}</h2>`;

  const closeArea = document.createElement('div');
  closeArea.classList.add('close-area');
  closeArea.textContent = 'X';

  const content = document.createElement('div');
  content.classList.add('content');
  content.innerHTML = `
    ${isCorrect ? '코드를 git에 업로드합니다.' : '안타깝습니다.'}
`;

  // 요소들을 조립하여 모달 창에 추가합니다.
  modalWindow.appendChild(title);
  modalWindow.appendChild(closeArea);
  modalWindow.appendChild(content);
  modal.appendChild(modalWindow);

  const closeBtn = modal.querySelector('.close-area');
  closeBtn.addEventListener('click', (e) => {
    modal.style.display = 'none';
  });

  modal.addEventListener('click', (e) => {
    const evTarget = e.target;
    if (evTarget.classList.contains('modal-overlay')) {
      modal.style.display = 'none';
    }
  });

  // body에 모달을 추가합니다.
  document.body.appendChild(modal);
  document.head.appendChild(style);
}

const style = document.createElement('style');
style.textContent = `
#cogit_modal.modal-overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(1.5px);
  -webkit-backdrop-filter: blur(1.5px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
}
#cogit_modal .modal-window {
  background: rgba(69, 139, 197, 0.7);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(13.5px);
  -webkit-backdrop-filter: blur(13.5px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  width: 400px;
  height: 500px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px;
}
#cogit_modal .title {
  padding-left: 10px;
  display: inline;
  text-shadow: 1px 1px 2px gray;
  color: white;
}
#cogit_modal .title h2 {
  display: inline;
}
#cogit_modal .close-area {
  display: inline;
  float: right;
  padding-right: 10px;
  cursor: pointer;
  text-shadow: 1px 1px 2px gray;
  color: white;
}

#cogit_modal .content {
  margin-top: 20px;
  padding: 0px 10px;
  text-shadow: 1px 1px 2px gray;
  color: white;
}

`;
