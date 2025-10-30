const fs = require('fs');
const { contextBridge, shell } = require('electron');
const path = require('path');
const { app } = require('@electron/remote');

const iconMap = require('./config/iconMap.js');
const widgetJsonPath = path.join(__dirname, 'config', 'widget_blocks.json');
const widgetMap = JSON.parse(fs.readFileSync(widgetJsonPath, 'utf-8'));
const userConfigPath = path.join(app.getPath('userData'), 'config.json');


const { ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openConfig: () => {
    shell.openPath(userConfigPath);
  },
  setStoreUrl: (url) => {
    ipcRenderer.send('set-store-url', url);
  }
});


const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config/config.json'), 'utf-8'));
const baseDomain = new URL(config.url).hostname;
const overrides = require(path.join(__dirname, 'config', 'overrides.js'));
const currentUrl = window.location.href;
const matchedRules = overrides.rules.filter(rule => {
  try {
    const regex = new RegExp(rule.match, 'i');
    return regex.test(currentUrl);
  } catch (e) {
    console.warn(`Invalid regex in rule: ${rule.match}`);
    return false;
  }
});
console.log('Current URL:', currentUrl);
console.log('Matched rules:', matchedRules);


window.addEventListener('DOMContentLoaded', () => {
  const currentURL = window.location.href;

  // Inject global theme
  const globalCSSPath = path.join(__dirname, 'styles', 'global.css');
  if (fs.existsSync(globalCSSPath)) {
    const globalStyle = document.createElement('style');
    globalStyle.textContent = fs.readFileSync(globalCSSPath, 'utf-8');
    document.head.appendChild(globalStyle);
  }

const logo = document.getElementById('topbarlogo');
if (logo) {
  logo.src = 'https://library.cwanz.online/cw_y.png';
  logo.alt = 'Cartridge World Logo';
}
  
  const topbarPath = path.join(__dirname, 'html', 'topbar_snippet.htm');

  
  // Apply matching overrides
  for (const rule of overrides.rules) {
    if (currentURL.includes(rule.match)) {
      // Inject CSS
      if (rule.cssFile) {
        const cssPath = path.join(__dirname, 'styles', rule.cssFile);
        if (fs.existsSync(cssPath)) {
          const style = document.createElement('style');
          style.textContent = fs.readFileSync(cssPath, 'utf-8');
          document.head.appendChild(style);
        } else {
          console.warn(`CSS file not found: ${cssPath}`);
        }
      }

      // Inject JS
      if (rule.js) {
        const script = document.createElement('script');
        script.textContent = rule.js;
        document.body.appendChild(script);
      }

      // 1. Inject widget HTML



      

    if (fs.existsSync(widgetJsonPath)) {
      try {
        const widgetMap = JSON.parse(fs.readFileSync(widgetJsonPath, 'utf-8'));

        // Replace widgets by ID
        document.querySelectorAll('fieldpine-create-widget').forEach(widget => {
          const id = widget.getAttribute('id');
          if (id && widgetMap[id]) {
            console.log('Replacing widget with ID:', id);
            const parser = new DOMParser();
            const newWidget = parser.parseFromString(widgetMap[id], 'text/html').body.firstChild;
            widget.replaceWith(newWidget);
            console.log(`Replaced widget with ID ${id}`);
          }
        });
      //Add old header to pages that doesnt have it.
      if (widgetMap["yellow_header_bar"]) {
        const parser = new DOMParser();
        const headerBar = parser.parseFromString(widgetMap["yellow_header_bar"], "text/html").body.firstChild;

        // Only inject if the header is missing
        const existingHeader = document.querySelector('div[style*="background-color: RGB(255,233,15)"]');
        if (!existingHeader) {
          document.body.insertBefore(headerBar, document.body.firstChild);
        }
      }


        
        // Replace MembershipOpto1
        const targetSpan = document.getElementById('MembershipOpto1');
        if (targetSpan && widgetMap["100"]) {
          const parser = new DOMParser();
          const newWidget = parser.parseFromString(widgetMap["100"], 'text/html').body.firstChild;
          targetSpan.replaceWith(newWidget);
          console.log('Replaced MembershipOpto1 with widget ID 100');
        }

        // Replace AdvisorOpto
        const advisorOpto = Array.from(document.querySelectorAll('div.opto')).find(div =>
          div.innerHTML.includes('sshome_advisor.htm') &&
          div.innerHTML.includes('Advisor')
        );

        if (advisorOpto && widgetMap["101"]) {
          const parser = new DOMParser();
          const newWidget = parser.parseFromString(widgetMap["101"], 'text/html').body.firstChild;
          advisorOpto.replaceWith(newWidget);
          console.log('Replaced AdvisorOpto with widget ID 101');
        }
        // Find the div.opto that contains "Email & Interfaces"
        const emailInterfacesOpto = Array.from(document.querySelectorAll('div.opto')).find(div =>
          div.innerHTML.includes('sshome_email.htm') &&
          div.innerHTML.includes('Email') &&
          div.innerHTML.includes('Interfaces')
        );


        
        window.addEventListener('DOMContentLoaded', () => {

          let widgetMap = {};

          try {
            const widgetPath = path.join(__dirname, 'config', 'widget_blocks.json');
            const widgetData = fs.readFileSync(widgetPath, 'utf8');
            const parsedWidgets = JSON.parse(widgetData);

            widgetMap = parsedWidgets;
          } catch (err) {
            console.error('Error loading widget_blocks.json:', err);
          }


          // Replace existing topbar with new widget
          
          const oldTopbar = document.querySelector('.topbar');
          if (oldTopbar && widgetMap["topbar"]) {
            const parser = new DOMParser();
            const newTopbar = parser.parseFromString(widgetMap["topbar"], 'text/html').body.firstChild;
            oldTopbar.replaceWith(newTopbar);
            console.log('Replaced topbar with new flex layout');
          }
        });

        if (emailInterfacesOpto && widgetMap["102"]) {
          const parser = new DOMParser();
          const newWidget = parser.parseFromString(widgetMap["102"], 'text/html').body.firstChild;
          emailInterfacesOpto.replaceWith(newWidget);
          console.log('Replaced Email & Interfaces Opto with widget ID 102');
        }



/*
        document.querySelectorAll('div.opto', 'MembershipOpto1').forEach(div => {
          const text = div.textContent.trim();
          const iconName = iconMap[text];

          if (iconName) {
            const iconElement = document.createElement('span');
            iconElement.classList.add('material-icons');
            iconElement.textContent = iconName;
            iconElement.style.fontSize = '48px';
            iconElement.style.color = '#0073e6';
            iconElement.style.display = 'block';
            iconElement.style.marginBottom = '0.5em';

            div.prepend(iconElement);
          }
        });
        */


      } catch (err) {
        console.error('Failed to load widget_blocks.json:', err);
      }
    } else {
      console.warn('widget_blocks.json not found');
    }
    


      }

    }
  }
);

window.addEventListener('DOMContentLoaded', () => {
  let isUpdating = false;

  function sanitizeAndInject() {
    if (isUpdating) return;
    isUpdating = true;

    document.querySelectorAll('.opto, .detailpageopto, .bigbut, fieldpine-create-widget a').forEach(div => {
      const link = div.querySelector('a');
      if (!link) return;
      if (link.dataset.iconified === 'true') return;

      // Extract text from link AND from div
      const href = link.getAttribute('href') || '';
      const onclick = link.getAttribute('onclick');

      const spanText = link.querySelector('span')?.textContent.trim() || '';
      const linkText = link.textContent.trim().replace(/\s+/g, ' ');
      const divText = div.textContent.trim().replace(/\s+/g, ' ');

      // Use whichever label is longer/more descriptive
      const label = linkText.length >= divText.length ? linkText : divText;

      // Clear any preexisting content (prevent duplicates)
      link.innerHTML = '';

      // Choose icon from your map
      const iconName = detectIcon(label, href, spanText);

      if (iconName) {
        const icon = document.createElement('span');
        icon.classList.add('material-icons');
        icon.textContent = iconName;
        link.appendChild(icon);
      }

      // Add the label text cleanly
      link.appendChild(document.createTextNode(label));

      // Restore attributes
      if (href) link.setAttribute('href', href);
      if (onclick) link.setAttribute('onclick', onclick);

      div.classList.add('opto');
      link.dataset.iconified = 'true';

      // Debug log
      if (iconName === 'apps') {
        console.log(`[fallback icon] ${label}`);
      } else {
        console.log(`[icon applied] ${label} → ${iconName}`);
      }
    });

    isUpdating = false;
  }

function detectIcon(label, href = '', spanText = '') {
  const map = iconMap.iconMap || iconMap;
  const lowerHref = href.toLowerCase();
  const lowerLabel = label.toLowerCase();
  const lowerSpan = spanText.toLowerCase();

  // Utility: find best (longest) match
  const findBestMatch = (text) => {
    let best = null;
    for (const key of Object.keys(map)) {
      const lowerKey = key.toLowerCase();
      if (text.includes(lowerKey)) {
        if (!best || lowerKey.length > best.key.length)
          best = { key: lowerKey, icon: map[key] };
      }
    }
    return best ? best.icon : null;
  };

  const hrefMatch = findBestMatch(lowerHref);
  if (hrefMatch) return hrefMatch;

  const labelMatch = findBestMatch(lowerLabel) || findBestMatch(lowerSpan);
  if (labelMatch) return labelMatch;

  const words = lowerLabel.split(/\s+/);
  let bestWordMatch = null;
  for (const word of words) {
    const match = findBestMatch(word);
    if (match) bestWordMatch = match;
  }
  if (bestWordMatch) return bestWordMatch;

  const simplifiedLabel = lowerLabel.replace(/\s+/g, '');
  const fuzzyMatch = findBestMatch(simplifiedLabel);
  if (fuzzyMatch) return fuzzyMatch;

  return map['default'] || 'apps';
}


  // Run once + watch for dynamic updates
  sanitizeAndInject();
  setTimeout(sanitizeAndInject, 1000);

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        sanitizeAndInject();
        break;
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
});


window.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    .gboxa {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 2em;
      max-width: 400px;
      width: 90%;
    }
  `;
  document.head.appendChild(style);
});


window.replaceWithLocalHTML = function(location) {
  const filePath = path.join(__dirname, 'html', location);
  if (fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, 'utf-8');
    document.open();
    document.write(html);
    document.close();
  } else {
    console.error('HTML file not found:', filePath);
  }
};

window.SafeDisplayPageMenu = function (evt) {
  let wo = evt?.srcElement || document.getElementById("PageMenuButton");
  if (!wo) return;

  let h = [];
  h.push("#Last Sale Receipt</a>");

  if (window.FieldpineRetailConfig?.pDef?.WebHomePage) {
    h.push(`${window.FieldpineRetailConfig.pDef.WebHomePage}Home</a>`);
  }

  h.push("#Edit Config</a>");

  if (window.FieldpinePage?.DrawHoverMenu) {
    window.FieldpinePage.DrawHoverMenu(h, wo);
  }

  document.getElementById("PageMenu_LastSaleReceipt")?.addEventListener('click', () => {
    console.log("Last Sale Receipt clicked");
  });

  document.getElementById("PageMenu_OpenConfig")?.addEventListener('click', () => {
    if (window.electronAPI?.openConfig) {
      window.electronAPI.openConfig();
    } else {
      alert("Unable to open config file.");
    }
  });

};


window.addEventListener('DOMContentLoaded', () => {
  // Remove inline styles
  const diagElement = document.querySelector('.diag');
  if (diagElement) diagElement.removeAttribute('style');

  const diagboxElement = document.querySelector('.diagbox');
  if (diagboxElement) diagboxElement.removeAttribute('style');

  const loginButton = document.getElementById('lgo');
  if (loginButton) loginButton.removeAttribute('style');

  const inputBox = document.getElementById('input');
  if (inputBox) inputBox.removeAttribute('style');

  // Remove specific external CSS
  document.querySelectorAll('link[rel="stylesheet"]').forEach(l => {
    if (l.href.includes('problem.css')) l.remove();
  });

  // ✅ Only inject login.css if NOT on a /report/ page
  const currentUrl = window.location.href;
  if (!/\/report\//i.test(currentUrl)) {
    const loginCssPath = path.join(__dirname, 'styles', 'login.css');
    if (fs.existsSync(loginCssPath)) {
      const css = fs.readFileSync(loginCssPath, 'utf-8');
      const style = document.createElement('style');
      style.setAttribute('data-source', 'login.css');
      style.textContent = css;
      document.head.appendChild(style);

      // Re-append to ensure it stays last
      setTimeout(() => {
        if (style.parentNode) {
          style.parentNode.removeChild(style);
          document.head.appendChild(style);
        }
      }, 1200);

      console.log('✅ login.css applied to non-report page');
    }
  } else {
    console.log('🚫 Skipped login.css for report page');
  }
});
window.addEventListener('DOMContentLoaded', () => {
  const currentURL = window.location.href;
  const topbarPath = path.join(__dirname, 'html', 'topbar_snippet.htm');

  if (!/\/report\/rr\/sell5\.htm($|[#?])/i.test(currentURL) && fs.existsSync(topbarPath)) {
    const topbarHTML = fs.readFileSync(topbarPath, 'utf-8');
    const wrapper = document.createElement('div');
    wrapper.innerHTML = topbarHTML;
    document.body.insertBefore(wrapper, document.body.firstChild);
    console.log('✅ Inserted local topbar snippet (not sell5)');
  } else {
    console.log('🚫 Skipped local topbar snippet for /report/rr/sell5.htm');
  }

  function injectBackButton() {
    const leftSection = document.getElementById('layout_topbar_left');
    const menuButton = document.getElementById('PageMenuButton');

    if (leftSection && menuButton && !document.getElementById('preloadBackButton')) {
      const backBtn = document.createElement('input');
      backBtn.type = 'button';
      backBtn.value = '← Back';
      backBtn.id = 'preloadBackButton';
      backBtn.style.marginLeft = '0.5em';
      backBtn.addEventListener('click', () => history.back());

      menuButton.insertAdjacentElement('afterend', backBtn);
      console.log('✅ Back button inserted after #PageMenuButton');
    }
  }

  injectBackButton();
  setTimeout(injectBackButton, 500);
  setTimeout(injectBackButton, 1500);
});
