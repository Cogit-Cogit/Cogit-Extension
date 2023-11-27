const submitButton = document.getElementById('submit_button');
if (submitButton != null) {
  submitButton.addEventListener('click', function () {
    saveCode();
  });
}

function saveCode() {
  const codeMirrorLines = document.querySelectorAll('.CodeMirror-line');

  const linesContent = Array.from(codeMirrorLines).map((line) => line.textContent);

  const contentWithNewlines = linesContent.join('\n');

  localStorage.setItem('code', contentWithNewlines);
}