/**
 * tabs.js — Accessible tabbed interface for geothermal systems section
 */
(function () {
  'use strict';

  const tabList = document.querySelector('[role="tablist"]');
  if (!tabList) return;

  const tabs = tabList.querySelectorAll('[role="tab"]');
  const panels = document.querySelectorAll('[role="tabpanel"]');

  function activateTab(targetTab) {
    tabs.forEach(tab => {
      tab.setAttribute('aria-selected', 'false');
    });
    panels.forEach(panel => {
      panel.classList.remove('is-active');
    });

    targetTab.setAttribute('aria-selected', 'true');
    const targetPanelId = targetTab.getAttribute('aria-controls');
    const targetPanel = document.getElementById(targetPanelId);
    if (targetPanel) {
      targetPanel.classList.add('is-active');
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      activateTab(this);
    });

    // Keyboard navigation
    tab.addEventListener('keydown', function (e) {
      const tabArray = Array.from(tabs);
      const currentIndex = tabArray.indexOf(this);
      let newIndex;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        newIndex = (currentIndex + 1) % tabArray.length;
        tabArray[newIndex].focus();
        activateTab(tabArray[newIndex]);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        newIndex = (currentIndex - 1 + tabArray.length) % tabArray.length;
        tabArray[newIndex].focus();
        activateTab(tabArray[newIndex]);
      } else if (e.key === 'Home') {
        e.preventDefault();
        tabArray[0].focus();
        activateTab(tabArray[0]);
      } else if (e.key === 'End') {
        e.preventDefault();
        tabArray[tabArray.length - 1].focus();
        activateTab(tabArray[tabArray.length - 1]);
      }
    });
  });

})();
