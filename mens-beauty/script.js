// ==========================================
// MENOLOGY - メンズ美容・ファッション コミュニティ
// ==========================================

document.addEventListener('DOMContentLoaded', function () {

  // ----- Mobile Navigation Toggle -----
  var menuToggle = document.getElementById('menu-toggle');
  var navSp = document.getElementById('nav-sp');
  var navSpClose = document.getElementById('nav-sp-close');

  if (menuToggle && navSp) {
    menuToggle.addEventListener('click', function () {
      navSp.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (navSpClose && navSp) {
    navSpClose.addEventListener('click', function () {
      navSp.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Close mobile nav when a link is clicked
  var navSpLinks = navSp ? navSp.querySelectorAll('a') : [];
  navSpLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navSp.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ----- Tab Switching (Category Highlights) -----
  var tabs = document.querySelectorAll('.tab');
  var tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var targetTab = this.getAttribute('data-tab');

      // Remove active from all tabs and contents
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tabContents.forEach(function (tc) { tc.classList.remove('active'); });

      // Activate clicked tab and corresponding content
      this.classList.add('active');
      var targetContent = document.getElementById('tab-' + targetTab);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // ----- Smooth Scroll for Anchor Links -----
  var anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        var headerHeight = 64;
        var targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ----- Newsletter Form -----
  var newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailInput = this.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        emailInput.value = '';
        alert('ご登録ありがとうございます！最新情報をお届けします。');
      }
    });
  }

});
