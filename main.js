document.addEventListener('DOMContentLoaded', function () {
    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
  
    // Initialize theme based on localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      updateThemeIcon(savedTheme);
    } else if (prefersDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      updateThemeIcon('dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      updateThemeIcon('light');
    }
  
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  
    function updateThemeIcon(theme) {
      if (theme === 'dark') {
        themeIcon.innerHTML = `
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        `;
      } else {
        themeIcon.innerHTML = `
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        `;
      }
    }
  
    // Existing Form Logic
    const form = document.getElementById('multiForm');
    const steps = document.querySelectorAll('.form-step');
    const sidebarSteps = document.querySelectorAll('.sidebar .step');
    const stepNumbers = document.querySelectorAll('.step-number');
    let currentStep = 0;
  
    showStep(currentStep);
  
    const inputs = document.querySelectorAll('.step-1 input[required]');
    inputs.forEach(input => {
      input.addEventListener('input', function () {
        if (this.checkValidity()) {
          this.classList.remove('invalid');
          this.nextElementSibling.style.display = 'none';
        }
      });
    });
  
    const planOptions = document.querySelectorAll('.plan-option');
    planOptions.forEach(option => {
      option.addEventListener('click', function () {
        planOptions.forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
      });
    });
  
    const billingToggle = document.querySelector('.toggle-switch input');
    const monthlyLabel = document.querySelector('.billing-toggle span:first-child');
    const yearlyLabel = document.querySelector('.billing-toggle span:last-child');
    const planPrices = document.querySelectorAll('.plan-price');
    const freeMonths = document.querySelectorAll('.free-months');
    const addonPrices = document.querySelectorAll('.addon-price');
  
    billingToggle.addEventListener('change', function () {
      if (this.checked) {
        monthlyLabel.classList.remove('active');
        yearlyLabel.classList.add('active');
        planPrices.forEach(price => {
          price.textContent = price.dataset.yearly;
        });
        freeMonths.forEach(free => {
          free.style.display = 'block';
        });
        addonPrices.forEach(price => {
          price.textContent = price.dataset.yearly;
        });
      } else {
        monthlyLabel.classList.add('active');
        yearlyLabel.classList.remove('active');
        planPrices.forEach(price => {
          price.textContent = price.dataset.monthly;
        });
        freeMonths.forEach(free => {
          free.style.display = 'none';
        });
        addonPrices.forEach(price => {
          price.textContent = price.dataset.monthly;
        });
      }
    });
  
    const addonOptions = document.querySelectorAll('.addon-option');
    addonOptions.forEach(option => {
      const checkbox = option.querySelector('input');
      option.addEventListener('click', function (e) {
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
        }
        option.classList.toggle('selected', checkbox.checked);
      });
    });
  
    const changePlanBtn = document.getElementById('change-plan');
    changePlanBtn.addEventListener('click', function () {
      showStep(1);
    });
  
    const nextButtons = document.querySelectorAll('.btn-next');
    nextButtons.forEach(button => {
      button.addEventListener('click', function () {
        if (validateStep(currentStep)) {
          if (currentStep === 3) {
            updateSummary();
          }
          showStep(currentStep + 1);
        }
      });
    });
  
    const backButtons = document.querySelectorAll('.btn-back');
    backButtons.forEach(button => {
      button.addEventListener('click', function () {
        showStep(currentStep - 1);
      });
    });
  
    const confirmButton = document.querySelector('.btn-confirm');
    confirmButton.addEventListener('click', function () {
      showStep(4);
    });
  
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      showStep(4);
    });
  
    function showStep(stepIndex) {
      currentStep = stepIndex;
      steps.forEach(step => {
        step.classList.remove('active');
      });
      steps[stepIndex].classList.add('active');
      stepNumbers.forEach((number, index) => {
        if (index === stepIndex) {
          number.classList.add('active');
        } else {
          number.classList.remove('active');
        }
      });
    }
  
    function validateStep(stepIndex) {
      if (stepIndex === 0) {
        let isValid = true;
        inputs.forEach(input => {
          if (!input.checkValidity()) {
            input.classList.add('invalid');
            input.nextElementSibling.style.display = 'block';
            isValid = false;
          }
        });
        return isValid;
      } else if (stepIndex === 1) {
        const selectedPlan = document.querySelector('.plan-option.selected');
        if (!selectedPlan) {
          alert('Please select a plan');
          return false;
        }
        return true;
      }
      return true;
    }
  
    function updateSummary() {
      const selectedPlan = document.querySelector('.plan-option.selected');
      const planName = selectedPlan ? selectedPlan.dataset.plan : 'Arcade';
      const isYearly = billingToggle.checked;
  
      const summaryPlanName = document.getElementById('summary-plan-name');
      const summaryPlanPrice = document.getElementById('summary-plan-price');
      const summaryBillingType = document.getElementById('summary-billing-type');
      const summaryAddons = document.getElementById('summary-addons');
      const planDisplayName = planName.charAt(0).toUpperCase() + planName.slice(1);
      const billingType = isYearly ? 'Yearly' : 'Monthly';
      summaryPlanName.textContent = `${planDisplayName} (${billingType})`;
  
      let planPrice;
      switch (planName) {
        case 'arcade':
          planPrice = isYearly ? '$90/yr' : '$9/mo';
          break;
        case 'advanced':
          planPrice = isYearly ? '$120/yr' : '$12/mo';
          break;
        case 'pro':
          planPrice = isYearly ? '$150/yr' : '$15/mo';
          break;
      }
      summaryPlanPrice.textContent = planPrice;
      summaryBillingType.textContent = isYearly ? 'year' : 'month';
  
      summaryAddons.innerHTML = '';
      const addons = [];
      let total = isYearly ?
        (planName === 'arcade' ? 90 : planName === 'advanced' ? 120 : 150) :
        (planName === 'arcade' ? 9 : planName === 'advanced' ? 12 : 15);
  
      document.querySelectorAll('.addon-option input:checked').forEach(checkbox => {
        const addonName = checkbox.id === 'online-service' ? 'Online service' :
          checkbox.id === 'larger-storage' ? 'Larger storage' :
            'Customizable profile';
        const addonPrice = isYearly ?
          (checkbox.id === 'online-service' ? '+$10/yr' :
            checkbox.id === 'larger-storage' ? '+$20/yr' : '+$20/yr') :
          (checkbox.id === 'online-service' ? '+$1/mo' :
            checkbox.id === 'larger-storage' ? '+$2/mo' : '+$2/mo');
  
        const addonValue = isYearly ?
          (checkbox.id === 'online-service' ? 10 :
            checkbox.id === 'larger-storage' ? 20 : 20) :
          (checkbox.id === 'online-service' ? 1 :
            checkbox.id === 'larger-storage' ? 2 : 2);
  
        addons.push({ name: addonName, price: addonPrice, value: addonValue });
  
        const addonElement = document.createElement('div');
        addonElement.className = 'selected-addon';
        addonElement.innerHTML = `
          <p>${addonName}</p>
          <p>${addonPrice}</p>
        `;
        summaryAddons.appendChild(addonElement);
  
        total += addonValue;
      });
  
      const summaryTotal = document.getElementById('summary-total');
      summaryTotal.textContent = isYearly ? `$${total}/yr` : `$${total}/mo`;
    }
  });   