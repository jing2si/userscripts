// ==UserScript==
// @name         Add a copy button for Jira comment code block
// @version      0.1
// @description  Add a copy button for Jira comment code block
// @author       Luka
// @match        https://*.atlassian.net/*
// @run-at       document-end
// @grant        GM_addStyle
// ==/UserScript==

;(function () {
  'use strict'

  GM_addStyle(`
	.GM-copy-wrap:hover .GM-copy-button {
		transition: opacity 0.3s ease-in-out;
		opacity: 1;
	}

	.GM-copy-button {
    position: absolute;
    right: 0;
    top: 0;
    display: inline-block;
    padding: 5px 10px;
    background-color: #0052CC;
    color: #fff;
    font-size: 12px;
    text-align: center;
    border-radius: 4px;
    border: none;
		opacity: 0;
  }

  .GM-copy-button:hover {
		filter: brightness(1.2);
  }

	.GM-copy-button:active {
		filter: brightness(0.8);
  }
`)

  function copyToClipboard(element) {
    const codeBlock = element.querySelector('code')
    const codeContent = codeBlock.textContent
    const tempTextarea = document.createElement('textarea')

    tempTextarea.value = codeContent
    document.body.appendChild(tempTextarea)
    tempTextarea.select()

    try {
      const success = document.execCommand('copy')
      console.log(success ? 'Text copied' : 'Copy failed')
    } catch (err) {
      console.log('Copy failed:', err)
    }

    document.body.removeChild(tempTextarea)
  }

  function addCopyButton(wrap) {
    const copyButton = document.createElement('button')
    copyButton.textContent = 'Copy'
    copyButton.classList.add('GM-copy-button')
    copyButton.setAttribute('type', 'button')

    copyButton.addEventListener('click', () => {
      copyButton.textContent = 'Copyed'

      setTimeout(function () {
        copyButton.textContent = 'Copy'
      }, 1000)
      copyToClipboard(wrap)
    })

    wrap.classList.add('GM-copy-wrap')
    wrap.appendChild(copyButton)
  }

  function init() {
    const selector = '.code-block[class*="css-"]'
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        const addedNodes = mutation.addedNodes
        if (mutation.type === 'childList' && addedNodes) {
          Array.from(addedNodes).forEach((element) => {
            if (element instanceof Element && element.matches(selector)) {
              addCopyButton(element)
            }
          })
        }
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })
  }

  init()
})()
