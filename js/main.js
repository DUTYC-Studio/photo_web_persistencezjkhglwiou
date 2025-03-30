/**
 * DUTYC摄影工作室 - 主JavaScript文件
 * 包含网站交互功能和全局行为
 */

document.addEventListener('DOMContentLoaded', function() {
  // ========== 全局变量 ==========
  const body = document.body;
  const header = document.querySelector('.main-header');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  const scrollDownBtn = document.querySelector('.scroll-down-indicator');
  const viewButtons = document.querySelectorAll('.view-btn');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const closeBtn = document.querySelector('.close-btn');
  const downloadBtn = document.querySelector('.download-btn');

  // ========== 移动端菜单切换 ==========
  function toggleMobileMenu() {
    mobileMenuBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
    body.classList.toggle('no-scroll');
  }

  mobileMenuBtn.addEventListener('click', toggleMobileMenu);

  // 点击菜单链接后关闭菜单
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  // ========== 滚动头部效果 ==========
  function handleScroll() {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // 初始化检查

  // ========== 平滑滚动 ==========
  function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // 减去header高度
        behavior: 'smooth'
      });
    }
  }

  // 向下滚动按钮
  if (scrollDownBtn) {
    scrollDownBtn.addEventListener('click', (e) => {
      e.preventDefault();
      smoothScroll('#featured');
    });
  }

  // ========== 灯箱功能 ==========
  function openLightbox(imgSrc, title, description) {
    lightboxImg.src = imgSrc;
    lightboxImg.alt = title;
    lightboxTitle.textContent = title;
    lightboxDesc.textContent = description;

    // 存储当前图片信息用于下载
    lightbox.dataset.currentImg = imgSrc;
    lightbox.dataset.currentTitle = title;

    lightbox.classList.add('active');
    body.classList.add('no-scroll');
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    body.classList.remove('no-scroll');
  }

  // 作品查看按钮
  viewButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const galleryItem = this.closest('.gallery-item');
      const imgSrc = galleryItem.querySelector('img').src.replace('-thumb', '');
      const title = galleryItem.querySelector('h3').textContent;
      const description = galleryItem.querySelector('p').textContent;

      openLightbox(imgSrc, title, description);
    });
  });

  // 关闭灯箱
  closeBtn.addEventListener('click', closeLightbox);

  // 点击灯箱外部关闭
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // ESC键关闭灯箱
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // ========== 图片下载功能 ==========
  function downloadImage() {
    const imgUrl = lightbox.dataset.currentImg;
    const imgTitle = lightbox.dataset.currentTitle;

    // 创建一个临时链接用于下载
    const link = document.createElement('a');
    link.href = imgUrl;
    link.download = `DUTYC-${imgTitle}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  downloadBtn.addEventListener('click', downloadImage);

  // ========== 视差效果 ==========
  function initParallax() {
    const heroBanner = document.querySelector('.hero-banner');
    if (!heroBanner) return;

    window.addEventListener('scroll', function() {
      const scrollPosition = window.pageYOffset;
      heroBanner.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
    });
  }

  initParallax();

  // ========== 动画触发 ==========
  function initAnimations() {
    const animateElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    animateElements.forEach(element => {
      observer.observe(element);
    });
  }

  initAnimations();

  // ========== 服务卡片悬停效果 ==========
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.querySelector('.service-icon').style.transform = 'rotateY(180deg)';
    });

    card.addEventListener('mouseleave', function() {
      this.querySelector('.service-icon').style.transform = 'rotateY(0)';
    });
  });

  // ========== 表单验证 ==========
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const nameInput = this.querySelector('input[name="name"]');
      const emailInput = this.querySelector('input[name="email"]');
      const messageInput = this.querySelector('textarea[name="message"]');
      let isValid = true;

      // 简单验证
      if (!nameInput.value.trim()) {
        showError(nameInput, '请输入您的姓名');
        isValid = false;
      }

      if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
        showError(emailInput, '请输入有效的邮箱地址');
        isValid = false;
      }

      if (!messageInput.value.trim()) {
        showError(messageInput, '请输入您的留言');
        isValid = false;
      }

      if (isValid) {
        // 这里可以添加表单提交逻辑
        console.log('表单验证通过，准备提交');
        this.reset();
        showSuccess('消息已发送，我们会尽快回复您！');
      }
    });
  }

  function showError(input, message) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;

    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      formGroup.appendChild(errorElement);
    }

    errorElement.textContent = message;
    input.classList.add('error');
  }

  function showSuccess(message) {
    const successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.textContent = message;

    const form = document.querySelector('form');
    form.prepend(successElement);

    setTimeout(() => {
      successElement.remove();
    }, 5000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
});