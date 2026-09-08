/* CloveStewPine - Interactive Hearthside Cuisine JavaScript */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Management (Light / Dark)
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const currentTheme = localStorage.getItem('clove_theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('clove_theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('i');
    if (icon) {
      icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  // 2. Mobile Drawer Navigation
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerOverlay = document.getElementById('drawerOverlay');

  function openDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('active');
    if (drawerOverlay) drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('active');
    if (drawerOverlay) drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  // Auto close drawer when clicking any link inside mobile drawer
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Close drawer and search on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      if (searchModalOverlay) searchModalOverlay.classList.remove('active');
    }
  });

  // 3. Live Search Modal Overlay
  const searchModalTrigger = document.getElementById('searchModalTrigger');
  const searchModalOverlay = document.getElementById('searchModalOverlay');
  const searchCloseBtn = document.getElementById('searchCloseBtn');
  const searchInput = document.getElementById('liveSearchInput');
  const searchResults = document.getElementById('searchResultsContainer');

  const stewDatabase = [
    { title: "Forest Venison & Spiced Root Casserole", category: "Woodland Game Stews", link: "blog.html" },
    { title: "Pine-Smoked Wild Morel & Lentil Pot", category: "Foraged Botanical Stews", link: "blog.html" },
    { title: "Slow Braised Beef Shank with Whole Cloves", category: "Heirloom Dutch Oven Braises", link: "blog.html" },
    { title: "Alpine Duck & Roasted Chestnut Ragout", category: "Alpine Hearthside Roasts", link: "blog.html" },
    { title: "Hearthside Root Potage with Herbed Dumplings", category: "Comfort Vegetable Potages", link: "blog.html" },
    { title: "Slow-Simmered Woodland Rabbit & Thyme Ragout", category: "Rustic Braising Sciences", link: "blog.html" }
  ];

  if (searchModalTrigger && searchModalOverlay) {
    searchModalTrigger.addEventListener('click', () => {
      searchModalOverlay.classList.add('active');
      if (searchInput) searchInput.focus();
    });
  }

  if (searchCloseBtn && searchModalOverlay) {
    searchCloseBtn.addEventListener('click', () => {
      searchModalOverlay.classList.remove('active');
    });
  }

  if (searchModalOverlay) {
    searchModalOverlay.addEventListener('click', (e) => {
      if (e.target === searchModalOverlay) {
        searchModalOverlay.classList.remove('active');
      }
    });
  }

  if (searchInput && searchResults) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        searchResults.innerHTML = '<p style="color:var(--text-muted);font-size:0.88rem;">Type a stew type, botanical spice, or cut...</p>';
        return;
      }
      const matches = stewDatabase.filter(r => r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
      if (matches.length === 0) {
        searchResults.innerHTML = '<p style="color:var(--text-muted);font-size:0.88rem;">No matching woodland stew monographs found. View our complete blog directory.</p>';
      } else {
        searchResults.innerHTML = matches.map(m => `
          <a href="${m.link}" class="search-result-item">
            <h5>${m.title}</h5>
            <p>${m.category}</p>
          </a>
        `).join('');
      }
    });
  }

  // 4. Accordion FAQ
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(hdr => {
    hdr.addEventListener('click', () => {
      const item = hdr.parentElement;
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('active');
        const content = i.querySelector('.accordion-content');
        if (content) content.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        const content = item.querySelector('.accordion-content');
        if (content) content.style.maxHeight = content.scrollHeight + 40 + 'px';
      }
    });
  });

  // 5. Interactive Woodland Stew Calculator
  const stewProtein = document.getElementById('stewProtein');
  const stewHerb = document.getElementById('stewHerb');
  const stewPot = document.getElementById('stewPot');
  const resultTitle = document.getElementById('configResultTitle');
  const resultTemp = document.getElementById('configResultTemp');
  const resultTime = document.getElementById('configResultTime');
  const resultLiquid = document.getElementById('configResultLiquid');
  const resultTip = document.getElementById('configResultTip');

  function calculateStewPlan() {
    if (!stewProtein || !stewHerb || !stewPot) return;
    const protein = stewProtein.value;
    const herb = stewHerb.value;
    const pot = stewPot.value;

    let title = `${stewProtein.options[stewProtein.selectedIndex].text} with ${stewHerb.options[stewHerb.selectedIndex].text}`;
    let temp = "285°F (140°C) Oven / Low Ember";
    let time = "3.5 - 4.5 Hours Slow Simmer";
    let liquid = "Roasted Vegetable & Clove-Spiced Bone Broth";
    let tip = "Brown protein aggressively in heavy cast iron to build deep fond before adding botanical braising aromatics.";

    if (protein === 'beef_shank') {
      temp = "275°F - 300°F";
      time = "4 Hours";
      liquid = "Rich Roasted Beef Stock & Spiced Plum Reduction";
      tip = "Maintain a tight lid seal to promote collagen conversion into gelatin.";
    } else if (protein === 'game_venison') {
      temp = "260°F - 280°F";
      time = "3.5 Hours";
      liquid = "Wild Juniper, Clove & Roasted Mushroom Broth";
      tip = "Submerge meat completely in aromatic broth to preserve moisture in lean venison cuts.";
    } else if (protein === 'wild_fowl') {
      temp = "310°F";
      time = "2 - 2.5 Hours";
      liquid = "Golden Poultry Broth & Pine Needle Infusion";
      tip = "Add pine needle bouquet garni during the final 45 minutes of simmering for crisp aromatic lift.";
    } else if (protein === 'forest_mushrooms') {
      temp = "325°F";
      time = "1.25 Hours";
      liquid = "Charred Onion, Garlic & Clove Vegetable Stock";
      tip = "Layer chanterelles and morels with cooked heirloom beans and root vegetables.";
    }

    if (pot === 'clay_cocotte') {
      tip += " Clay cocottes provide gentle, even radiant heat that preserves subtle volatile terpene notes.";
    } else if (pot === 'copper_pot') {
      tip += " Heavy copper ensures rapid temperature response during initial fond searing.";
    }

    if (resultTitle) resultTitle.textContent = title;
    if (resultTemp) resultTemp.textContent = temp;
    if (resultTime) resultTime.textContent = time;
    if (resultLiquid) resultLiquid.textContent = liquid;
    if (resultTip) resultTip.textContent = tip;
  }

  if (stewProtein) stewProtein.addEventListener('change', calculateStewPlan);
  if (stewHerb) stewHerb.addEventListener('change', calculateStewPlan);
  if (stewPot) stewPot.addEventListener('change', calculateStewPlan);

  // 6. Cookie Consent Management
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAcceptBtn = document.getElementById('cookieAcceptBtn');
  const cookieDeclineBtn = document.getElementById('cookieDeclineBtn');

  if (cookieBanner) {
    if (!localStorage.getItem('clove_cookie_choice')) {
      setTimeout(() => {
        cookieBanner.classList.add('show');
      }, 1200);
    }

    if (cookieAcceptBtn) {
      cookieAcceptBtn.addEventListener('click', () => {
        localStorage.setItem('clove_cookie_choice', 'accepted');
        cookieBanner.classList.remove('show');
      });
    }

    if (cookieDeclineBtn) {
      cookieDeclineBtn.addEventListener('click', () => {
        localStorage.setItem('clove_cookie_choice', 'essential_only');
        cookieBanner.classList.remove('show');
      });
    }
  }

  // 7. Scroll Progress & Back to Top Button
  const progressBar = document.getElementById('readingProgressBar');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const siteHeader = document.querySelector('.site-header');

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    if (progressBar) progressBar.style.width = scrolled + '%';

    if (siteHeader) {
      if (winScroll > 60) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (winScroll > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 8. Newsletter Subscription Handler
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        form.innerHTML = '<div style="padding:1rem;background:rgba(27,59,43,0.2);border-radius:12px;color:#fff;font-weight:600;"><i class="fas fa-check-circle" style="color:var(--amber);margin-right:8px;"></i> Welcome to the Woodland Hearth Guild! Check your inbox for your stew monographs.</div>';
      }
    });
  });
});
