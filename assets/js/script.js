document.addEventListener('DOMContentLoaded', () => {

  // --- State Variables ---
  const itemsPerPage = 8; // UPDATED: Now shows 8 cars per page
  let currentPage = 1;

  // --- DOM Elements ---
  const gridContainer = document.getElementById('inventory-grid');
  const paginationContainer = document.getElementById('pagination-controls');
  const inquireModal = document.getElementById('inquire-modal');
  const modalTitle = document.getElementById('modal-vehicle-title');

  // --- Pagination & Rendering Logic ---
  if (gridContainer && typeof inventoryData !== 'undefined') {

    function renderInventory(page) {
      gridContainer.innerHTML = '';

      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedItems = inventoryData.slice(startIndex, endIndex);

      paginatedItems.forEach(car => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
                    <img src="${car.image}" alt="${car.year} ${car.makeModel}">
                    <div class="card-content">
                        <h3 class="card-title">${car.year} ${car.makeModel}</h3>
                        <div class="card-details">
                            <p><strong>Stock #:</strong> ${car.stockNumber}</p>
                            <p><strong>Entry Date:</strong> ${car.entryDate}</p>
                            <p><strong>Odometer:</strong> ${car.odometer}</p>
                            <p><strong>VIN:</strong> ${car.vin}</p>
                        </div>
                        <button class="btn btn-primary btn-block inquire-btn" 
                                data-title="${car.year} ${car.makeModel} - VIN: ${car.vin}">
                            Inquire
                        </button>
                    </div>
                `;
        gridContainer.appendChild(card);
      });
    }

    function renderPagination() {
      paginationContainer.innerHTML = '';
      const totalPages = Math.ceil(inventoryData.length / itemsPerPage);

      const prevBtn = document.createElement('button');
      prevBtn.className = 'page-btn';
      prevBtn.innerText = 'Previous';
      prevBtn.disabled = currentPage === 1;
      prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          updateView();
        }
      });
      paginationContainer.appendChild(prevBtn);

      for (let i = 1; i <= totalPages; i++) {
        const pageNumBtn = document.createElement('button');
        pageNumBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageNumBtn.innerText = i;
        pageNumBtn.addEventListener('click', () => {
          currentPage = i;
          updateView();
        });
        paginationContainer.appendChild(pageNumBtn);
      }

      const nextBtn = document.createElement('button');
      nextBtn.className = 'page-btn';
      nextBtn.innerText = 'Next';
      nextBtn.disabled = currentPage === totalPages;
      nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage++;
          updateView();
        }
      });
      paginationContainer.appendChild(nextBtn);
    }

    function updateView() {
      renderInventory(currentPage);
      renderPagination();
    }

    updateView();

    gridContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('inquire-btn')) {
        const vehicleInfo = e.target.getAttribute('data-title');
        modalTitle.innerText = vehicleInfo;
        inquireModal.classList.add('active');
      }
    });
  }

  // --- Universal Modal Architecture ---

  // Close functionality for all modals
  document.querySelectorAll('.close-modal-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.target.closest('.modal-overlay').classList.remove('active');
    });
  });

  // Open Policy Modals
  document.querySelectorAll('.policy-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const policyType = e.target.getAttribute('data-policy');
      const targetModal = document.getElementById(`${policyType}-modal`);
      if (targetModal) {
        targetModal.classList.add('active');
      }
    });
  });

  // --- Custom Toast Notification Function ---
  function showSuccessToast(message) {
    // Create the toast element dynamically
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerText = message;

    // Add it to the page
    document.body.appendChild(toast);

    // Slight delay to allow CSS to register the starting state before fading in
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    // Wait 3 seconds, then fade it out
    setTimeout(() => {
      toast.classList.remove('show');

      // Wait for the fade-out transition to finish (0.4s) before removing from HTML
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 3000);
  }

  // --- Prevent form submissions and show toast ---
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Call the new green fade-in message
      showSuccessToast("Success! Your message has been sent.");

      // Clear the form fields
      form.reset();

      // If the form was inside a modal (like the Inquire form), close it
      const parentModal = form.closest('.modal-overlay');
      if (parentModal) {
        parentModal.classList.remove('active');
      }
    });
  });

  // --- Dynamic Navigation Highlight (Scroll Spy) ---
  const heroSection = document.querySelector('.hero');
  // Find the Recent Arrivals link in the navigation
  const recentArrivalsLink = document.querySelector('.nav-links a[href="index.html#inventory-section"]');

  // Only run this if we are actually on the homepage
  if (heroSection && recentArrivalsLink) {

    // Check the scroll position whenever the user scrolls
    window.addEventListener('scroll', () => {
      // Get the bottom coordinate of the Hero image
      const heroBottom = heroSection.getBoundingClientRect().bottom;

      // If the bottom of the Hero image is pushed up past the sticky header (approx 100px),
      // it means the user has scrolled down to the inventory.
      if (heroBottom <= 100) {
        recentArrivalsLink.classList.add('active-nav');
      } else {
        // If they scroll back up and the Hero is visible, remove the highlight
        recentArrivalsLink.classList.remove('active-nav');
      }
    });

    // Trigger this check immediately when the page loads, 
    // in case the user refreshes while already scrolled down.
    window.dispatchEvent(new Event('scroll'));
  }
});