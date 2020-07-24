// ==UserScript==
// @name                GitHub菜单
// @name:zh-CN          GitHub菜单
// @name:en             GitHub Menu
// @description         为GitHub头添加更多的菜单项，让你能够快速抵达你想要的页面。
// @description:zh-CN   为GitHub头添加更多的菜单项，让你能够快速抵达你想要的页面。
// @description:en      Add more menu items on the header of GitHub to quickly reach the page you want.
// @namespace           https://greasyfork.org/zh-CN/users/331591
// @version             1.1.0
// @author              Hale Shaw
// @homepage            https://greasyfork.org/zh-CN/scripts/398004
// @supportURL          https://greasyfork.org/zh-CN/scripts/398004/feedback
// @icon                https://github.githubassets.com/favicon.ico
// @match               *://github.com/*
// @match               *://github.wdf.sap.corp/*
// @license             AGPL-3.0-or-later
// @compatible	        Chrome
// @run-at              document-idle
// @grant               none
// ==/UserScript==

(function () {
  'use strict';

  // If you want to use it on a enterprise github, you should add the URL of enterprise github in the match list.
  // 如果你想在Github企业版上使用它，你需要将你的Github企业版URL添加到脚本上方的match列表中。

  const scheme = "https://";
  const urlSeparator = "/";
  const domainName = document.domain;
  const defaultAccountName = "HaleShaw";

  const accountName = getAccountName();
  const menu = getMenu();
  const itemClassName = getClassName(menu);
  addMenuItem();

  /**
   * Add menu item.
   */
  function addMenuItem() {
    const watchText = "Watching";
    const starText = "Stars";
    const profileText = "Profile";
    const setText = "Settings";
    const repoText = "Repositories";

    const host = scheme + domainName + urlSeparator;
    const watchUrl = host + "watching";
    const starUrl = host + accountName + "?tab=stars";
    const profileUrl = host + accountName;
    const settingUrl = host + "settings/profile";
    const repoUrl = host + accountName + "?tab=repositories";

    createMenuItem(watchText, watchUrl, menu);
    createMenuItem(starText, starUrl, menu);
    createMenuItem(profileText, profileUrl, menu);
    createMenuItem(setText, settingUrl, menu);
    createMenuItem(repoText, repoUrl, menu);
  }

  /**
   * Create menu item.
   * @param {String} name
   * @param {String} url
   * @param {Object} menu
   */
  function createMenuItem(name, url, menu) {
    const menuItem = document.createElement("a");
    menuItem.text = name;
    menuItem.className = itemClassName;
    menuItem.href = url;
    menu.appendChild(menuItem);
  }

  /**
   * Get account name.
   */
  function getAccountName() {
    let accountName = defaultAccountName;
    const dropdownItems = document.querySelectorAll("a[class=dropdown-item]");
    const itemLength = dropdownItems.length;
    if (itemLength != 0) {
      let accountHref;
      for (let i = 0; i < itemLength; i++) {
        const profileAttrValue = "Header, go to profile, text:your profile";

        const attrValue = dropdownItems[i].getAttribute("data-ga-click");
        if (profileAttrValue == attrValue) {
          accountHref = dropdownItems[i].href;
          break;
        }
      }
      const splitArr = accountHref.split("/");
      accountName = splitArr[splitArr.length - 1];
    }
    return accountName;
  }

  /**
   * Get the menu object.
   */
  function getMenu() {
    const navs = document.getElementsByTagName("nav");
    if (navs && navs != undefined && "Global" == navs[0].getAttribute("aria-label")) {
      return navs[0];
    }
  }

  /**
   * Get the className of menu item.
   * @param {Object} menu menu.
   */
  function getClassName(menu) {
    const menuItems = menu.children;
    for (let i = 0; i < menuItems.length; i++) {
      const text = menuItems[i].innerText;
      if ("Explore" === text) {
        return menuItems[i].className;
      }
    }
  }
})();
