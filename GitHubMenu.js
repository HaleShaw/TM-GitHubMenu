// ==UserScript==
// @name                GitHub菜单
// @name:zh-CN          GitHub菜单
// @name:en             GitHub Menu
// @description         为GitHub头添加菜单。
// @description:zh-CN   为GitHub头添加菜单。
// @description:en      Add menu on the header of GitHub.
// @namespace           https://greasyfork.org/zh-CN/users/331591
// @version             1.0.0
// @author              Hale Shaw
// @homepage            https://greasyfork.org/zh-CN/scripts/398004
// @supportURL          https://greasyfork.org/zh-CN/scripts/398004/feedback
// @icon                https://greasyfork.org/assets/blacklogo16-bc64b9f7afdc9be4cbfa58bdd5fc2e5c098ad4bca3ad513a27b15602083fd5bc.png
// @require             https://greasyfork.org/scripts/398010-commonutils/code/CommonUtils.js?version=781197
// @match               https://github.com/*
// @match               https://github.wdf.sap.corp/*
// @license             AGPL-3.0-or-later
// @compatible	        Chrome
// @run-at              document-idle
// @grant               none
// ==/UserScript==
// ==/UserScript==

(function () {
  'use strict';

  const menuClassName1 = "d-flex flex-column flex-lg-row flex-self-stretch flex-lg-self-auto";
  const menuClassName2 = "d-flex";

  let menu = {};
  let exploreText = "";
  let menuItemClassName = "";
  let flag = false;
  let domainName = document.domain;

  const defaultAccountName = "HaleShaw";
  const accountName = getAccountName();
  getMenu();
  addMenuItem();

  /**
   * get the menu object by different class name.
   */
  function getMenu() {
    if (isValidByClassName(menuClassName1)) {
      menu = document.getElementsByClassName(menuClassName1)[0];
      exploreText = menu.children[4].innerText;
      menuItemClassName = "js-selected-navigation-item Header-link mr-0 mr-lg-3 py-2 py-lg-0 border-top border-lg-top-0 border-white-fade-15";
      flag = true;
    }
    else if (isValidByClassName(menuClassName2)) {
      const menus = document.getElementsByClassName(menuClassName2);
      for (let i = 0; i < menus.length; i++) {
        const labelValue = menus[i].getAttribute("aria-label");
        if ("Global" == labelValue) {
          menu = menus[i];
          break;
        }
      }
      if (isEnterprise()) {
        exploreText = menu.children[2].innerText;
      }
      else {
        exploreText = menu.children[3].innerText;
      }
      menuItemClassName = "js-selected-navigation-item Header-link mr-3";
      flag = true;
    }
  }

  /**
   * add menu item.
   */
  function addMenuItem() {
    if (flag) {
      let repoText = "Repositories";
      let watchText = "Watching";
      let starText = "Stars";
      let setText = "Settings"
      if ("探索" == exploreText) {
        repoText = "仓库";
        watchText = "关注";
        starText = "点赞";
        setText = "设置";
      }

      const repoUrl = "https://" + domainName + "/" + accountName + "?tab=repositories";
      const watchUrl = "https://" + domainName + "/watching";
      const starUrl = "https://" + domainName + "/" + accountName + "?tab=stars";
      const settingUrl = "https://" + domainName + "/settings/profile";

      createMenuItem(repoText, repoUrl, menu);
      createMenuItem(watchText, watchUrl, menu);
      createMenuItem(starText, starUrl, menu);
      createMenuItem(setText, settingUrl, menu);
    }
  }

  /**
   * create menu item.
   * @param {String} name
   * @param {String} url
   * @param {Object} menu
   */
  function createMenuItem(name, url, menu) {
    const menuItem = document.createElement("a");
    menuItem.text = name;
    menuItem.className = menuItemClassName;
    menuItem.href = url;
    menu.appendChild(menuItem);
  }

  /**
   * get account name.
   */
  function getAccountName() {
    const dropdownClassName = "dropdown-item";
    let accountName = defaultAccountName;
    if (isValidByClassName(dropdownClassName)) {
      console.log("There is already an account logged in.");
      let accountHref;

      const dropdownItems = document.getElementsByClassName(dropdownClassName);
      for (let i = 0; i < dropdownItems.length; i++) {
        const profileAttrValue = "Header, go to profile, text:your profile";

        const attrValue = dropdownItems[i].getAttribute("data-ga-click");
        if (profileAttrValue == attrValue) {
          accountHref = dropdownItems[i].href;
          break;
        }
      }

      const splitArr = accountHref.split("/");
      accountName = splitArr[splitArr.length - 1];
      console.log("The account is " + accountName);
    }
    return accountName;
  }

  /**
   * check if the domain is enterprise.
   */
  function isEnterprise() {
    if ("github.com" == domainName) {
      return false;
    }
    console.log("This is enterprise GitHub.");
    return true;
  }
})();
