// Mermaid Pan and Zoom functionality
// This script adds pan and zoom capabilities to mermaid diagrams
// Compatible with Hextra theme

(function() {
  'use strict';

  // Simple pan and zoom implementation
  class PanZoom {
    constructor(element) {
      this.element = element;
      this.scale = 1;
      this.translateX = 0;
      this.translateY = 0;
      this.isDragging = false;
      this.startX = 0;
      this.startY = 0;
      
      this.init();
    }

    init() {
      // Make the element transformable
      this.element.style.transformOrigin = '0 0';
      this.element.style.cursor = 'grab';
      
      // Add wheel zoom
      this.element.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
      
      // Add pan on drag
      this.element.addEventListener('mousedown', this.handleMouseDown.bind(this));
      this.element.addEventListener('mousemove', this.handleMouseMove.bind(this));
      this.element.addEventListener('mouseup', this.handleMouseUp.bind(this));
      this.element.addEventListener('mouseleave', this.handleMouseUp.bind(this));
      
      // Touch support
      this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
      this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
      this.element.addEventListener('touchend', this.handleTouchEnd.bind(this));
      
      // Prevent context menu on right click
      this.element.addEventListener('contextmenu', (e) => e.preventDefault());
      
      // Add reset button
      this.addResetButton();
    }

    handleWheel(e) {
      e.preventDefault();
      
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const rect = this.element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate new scale
      const newScale = this.scale * delta;
      
      // Limit scale between 0.1 and 10
      if (newScale < 0.1 || newScale > 10) return;
      
      // Adjust translation to zoom towards cursor
      this.translateX = x - (x - this.translateX) * delta;
      this.translateY = y - (y - this.translateY) * delta;
      this.scale = newScale;
      
      this.updateTransform();
    }

    handleMouseDown(e) {
      if (e.button === 0) { // Left click only
        this.isDragging = true;
        this.startX = e.clientX - this.translateX;
        this.startY = e.clientY - this.translateY;
        this.element.style.cursor = 'grabbing';
      }
    }

    handleMouseMove(e) {
      if (!this.isDragging) return;
      
      this.translateX = e.clientX - this.startX;
      this.translateY = e.clientY - this.startY;
      
      this.updateTransform();
    }

    handleMouseUp() {
      this.isDragging = false;
      this.element.style.cursor = 'grab';
    }

    handleTouchStart(e) {
      if (e.touches.length === 1) {
        e.preventDefault();
        this.isDragging = true;
        this.startX = e.touches[0].clientX - this.translateX;
        this.startY = e.touches[0].clientY - this.translateY;
      }
    }

    handleTouchMove(e) {
      if (!this.isDragging || e.touches.length !== 1) return;
      e.preventDefault();
      
      this.translateX = e.touches[0].clientX - this.startX;
      this.translateY = e.touches[0].clientY - this.startY;
      
      this.updateTransform();
    }

    handleTouchEnd() {
      this.isDragging = false;
    }

    updateTransform() {
      this.element.style.transform = 
        `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
    }

    reset() {
      this.scale = 1;
      this.translateX = 0;
      this.translateY = 0;
      this.updateTransform();
    }

    addResetButton() {
      const container = this.element.closest('.mermaid');
      if (!container) return;
      
      // Check if button already exists
      if (container.querySelector('.mermaid-reset-btn')) return;
      
      const button = document.createElement('button');
      button.className = 'mermaid-reset-btn';
      button.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
          <path d="M21 3v5h-5"/>
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
          <path d="M3 21v-5h5"/>
        </svg>
      `;
      button.title = 'Reset zoom and pan';
      button.setAttribute('aria-label', 'Reset zoom and pan');
      button.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        padding: 6px;
        background: rgba(255, 255, 255, 0.8);
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        transition: all 0.2s;
        opacity: 0.6;
        width: 28px;
        height: 28px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      `;
      
      // Dark mode support
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        button.style.background = 'rgba(40, 40, 40, 0.8)';
        button.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        button.style.color = '#fff';
      }
      
      button.addEventListener('mouseover', () => {
        const isDark = document.documentElement.classList.contains('dark');
        button.style.opacity = '1';
        button.style.background = isDark ? 'rgba(50, 50, 50, 0.95)' : 'rgba(255, 255, 255, 0.95)';
        button.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
        button.style.transform = 'scale(1.05)';
      });
      
      button.addEventListener('mouseout', () => {
        const isDark = document.documentElement.classList.contains('dark');
        button.style.opacity = '0.6';
        button.style.background = isDark ? 'rgba(40, 40, 40, 0.8)' : 'rgba(255, 255, 255, 0.8)';
        button.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        button.style.transform = 'scale(1)';
      });
      
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        this.reset();
      });
      
      // Make container relative if it's not already positioned
      if (getComputedStyle(container).position === 'static') {
        container.style.position = 'relative';
      }
      
      container.style.overflow = 'hidden';
      container.style.minHeight = '400px';
      container.style.border = '1px solid';
      container.style.borderColor = isDark ? '#333' : '#e5e7eb';
      container.style.borderRadius = '8px';
      container.style.background = isDark ? '#1a1a1a' : '#fafafa';
      container.style.padding = '1rem';
      
      container.appendChild(button);
    }
  }

    // Store panzoom instances
    const panzoomInstances = new WeakMap();

    // Make mermaid nodes clickable
    function makeNodesClickable(svg) {
      // Find all node groups in the SVG
      const nodes = svg.querySelectorAll('g.node');

      nodes.forEach(node => {
        // Get the text content of the node (package name)
        const textElement = node.querySelector('span') || node.querySelector('text') || node.querySelector('foreignObject span');
        if (!textElement) return;

        let packageName = '';
        if (textElement.tagName === 'SPAN') {
          packageName = textElement.textContent.trim();
        } else if (textElement.tagName === 'text') {
          packageName = textElement.textContent.trim();
        } else {
          // Handle foreignObject case
          const span = textElement.querySelector('span');
          if (span) {
            packageName = span.textContent.trim();
          }
        }

        // Skip if no package name found or if it's not a valid package name
        if (!packageName || packageName.length === 0) return;

        // Make the node clickable
        node.style.cursor = 'pointer';

        // Handle clicks (desktop)
        node.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent panzoom from triggering
          e.preventDefault();
          const url = `https://pkgs.krea.to/${encodeURIComponent(packageName)}`;
          window.open(url, '_blank');
        });

        // Handle touch events (mobile) - use closure to maintain state per node
        let touchStartTime = 0;
        let touchStartX = 0;
        let touchStartY = 0;
        let hasMoved = false;

        node.addEventListener('touchstart', (e) => {
          touchStartTime = Date.now();
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          hasMoved = false;
        }, { passive: true });

        node.addEventListener('touchmove', (e) => {
          if (hasMoved) return; // Already determined this is a drag
          const touch = e.touches[0];
          const deltaX = Math.abs(touch.clientX - touchStartX);
          const deltaY = Math.abs(touch.clientY - touchStartY);

          // If moved more than 10px, consider it a drag/pan, not a tap
          if (deltaX > 10 || deltaY > 10) {
            hasMoved = true;
          }
        }, { passive: true });

        node.addEventListener('touchend', (e) => {
          const touchEndTime = Date.now();
          const touchDuration = touchEndTime - touchStartTime;

          // Only trigger click if it was a quick tap (less than 300ms) and didn't move much
          if (!hasMoved && touchDuration < 300) {
            e.stopPropagation();
            e.preventDefault();
            const url = `https://pkgs.krea.to/${encodeURIComponent(packageName)}`;
            window.open(url, '_blank');
          }
        });

        // Add hover effect (only on desktop where hover makes sense)
        node.addEventListener('mouseenter', () => {
          if (window.matchMedia && !window.matchMedia('(hover: none)').matches) {
            node.style.opacity = '0.7';
          }
        });
        node.addEventListener('mouseleave', () => {
          if (window.matchMedia && !window.matchMedia('(hover: none)').matches) {
            node.style.opacity = '1';
          }
        });
      });
    }

    // Initialize pan and zoom on mermaid diagrams
  function initMermaidPanZoom() {
    const mermaidContainers = document.querySelectorAll('.mermaid');
    
    mermaidContainers.forEach((container) => {
      const svg = container.querySelector('svg');
      if (!svg) return;
      
      // Skip if already initialized
      if (panzoomInstances.has(svg)) return;
      
      // Make SVG fill the container properly
      svg.style.maxWidth = 'none';
      svg.style.maxHeight = 'none';
      
        // Initialize panzoom
        const panzoom = new PanZoom(svg);
        panzoomInstances.set(svg, panzoom);

        // Make nodes clickable
        makeNodesClickable(svg);
    });
  }

  // Wait for mermaid to render, then initialize panzoom
  function waitForMermaidAndInit() {
    // Give mermaid a moment to initialize
    setTimeout(() => {
        initMermaidPanZoom();

        // Re-apply click handlers to any newly rendered diagrams
        document.querySelectorAll('.mermaid svg').forEach(svg => {
          if (!panzoomInstances.has(svg)) {
            makeNodesClickable(svg);
          }
        });

        // Also watch for changes (theme switches, etc.)
      const observer = new MutationObserver(() => {
        // Use a debounce to avoid multiple rapid initializations
        clearTimeout(observer.timeout);
        observer.timeout = setTimeout(() => {
          initMermaidPanZoom();

          // Re-apply click handlers after theme changes
          document.querySelectorAll('.mermaid svg').forEach(svg => {
            makeNodesClickable(svg);
          });
        }, 200);
      });
      
      // Watch all mermaid containers for changes
      document.querySelectorAll('.mermaid').forEach((container) => {
        observer.observe(container, {
          childList: true,
          subtree: true
        });
      });
      
      // Also watch for theme changes on the document
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
    }, 300);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForMermaidAndInit);
  } else {
    waitForMermaidAndInit();
  }
})();
