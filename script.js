document.addEventListener('DOMContentLoaded', () => {
  // --- PARTICLE BACKGROUND ---
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');

  let particles = [];
  const particleCount = 70;
  let mouse = { x: null, y: null, radius: 150 };

  // Set canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Track mouse
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? 'rgba(0, 242, 254, 0.4)' : 'rgba(189, 0, 255, 0.4)';
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 5;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0; // reset
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce/Wrap boundaries
      if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
      if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

      // Mouse interactive push/pull
      if (mouse.x != null && mouse.y != null) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          let force = (mouse.radius - distance) / mouse.radius;
          this.x += (dx / distance) * force * 1.5;
          this.y += (dy / distance) * force * 1.5;
        }
      }
    }
  }

  // Init particles
  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }
  initParticles();

  // Draw lines connecting particles
  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 110) {
          let alpha = (110 - distance) / 110 * 0.15;
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }

      // Draw line to mouse
      if (mouse.x != null && mouse.y != null) {
        let dx = particles[i].x - mouse.x;
        let dy = particles[i].y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          let alpha = (mouse.radius - distance) / mouse.radius * 0.25;
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animate);
  }
  animate();


  // --- TYPING ANIMATION ---
  const typingText = document.getElementById('typing-text');
  const titles = [
    'B.Tech CSE Student',
    'Software Developer',
    'Community Manager',
    'Tech Enthusiast'
  ];
  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentWord = titles[titleIndex];
    if (isDeleting) {
      typingText.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingText.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = 100;
    if (isDeleting) {
      typeSpeed /= 2; // Delete faster
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2000; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typeSpeed = 500; // Pause before typing next word
    }

    setTimeout(typeEffect, typeSpeed);
  }
  // Start typing
  setTimeout(typeEffect, 1000);


  // --- HEADER SCROLL ACTION ---
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });


  // --- RESPONSIVE MOBILE NAVIGATION ---
  const navToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-links a');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('nav-active');
    
    // Animate burger menu icon
    const burgerSvg = navToggle.querySelector('svg');
    if (navLinks.classList.contains('nav-active')) {
      burgerSvg.innerHTML = `<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>`;
    } else {
      burgerSvg.innerHTML = `<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>`;
    }
  });

  // Close nav on link click (mobile)
  links.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('nav-active')) {
        navLinks.classList.remove('nav-active');
        const burgerSvg = navToggle.querySelector('svg');
        burgerSvg.innerHTML = `<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>`;
      }
    });
  });


  // --- INTERSECTION OBSERVER FOR REVEALS & ACTIVE LINKS ---
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-links a');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Reveal on scroll
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Trigger skills progress bars animation inside this section
        const skillFills = entry.target.querySelectorAll('.skill-fill');
        skillFills.forEach(fill => {
          const targetWidth = fill.getAttribute('data-target');
          fill.style.width = targetWidth + '%';
        });

        // Trigger stats animation
        const stats = entry.target.querySelectorAll('.stat-number');
        stats.forEach(stat => {
          if (!stat.classList.contains('counted')) {
            stat.classList.add('counted');
            animateCount(stat);
          }
        });
      }

      // Highlight active nav item
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(item => {
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active-link');
          } else {
            item.classList.remove('active-link');
          }
        });
      }
    });
  }, observerOptions);

  reveals.forEach(rev => sectionObserver.observe(rev));
  sections.forEach(sec => sectionObserver.observe(sec));


  // --- STAT COUNTER ANIMATION ---
  function animateCount(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const suffix = element.getAttribute('data-suffix') || '';
    let current = 0;
    const duration = 1500; // ms
    const stepTime = Math.max(Math.floor(duration / target), 20);
    
    const timer = setInterval(() => {
      current += Math.ceil(target / (duration / stepTime));
      if (current >= target) {
        element.textContent = target + suffix;
        clearInterval(timer);
      } else {
        element.textContent = current + suffix;
      }
    }, stepTime);
  }


  // --- 3D TILT EFFECT FOR CARDS & HOLOGRAM ---
  const cards = document.querySelectorAll('.project-card, .about-card, .hologram-card');
  
  // Disable 3D tilt on mobile devices for performance
  if (window.innerWidth > 768) {
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x coordinate inside the card
        const y = e.clientY - rect.top;  // y coordinate inside the card
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate tilt amounts (max 8 degrees)
        const tiltX = ((y - centerY) / centerY) * -8;
        const tiltY = ((x - centerX) / centerX) * 8;
        
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }


  // --- DYNAMIC RESUME GENERATOR & DOWNLOAD ---
  const downloadBtn = document.getElementById('download-resume');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const resumeContent = `==================================================
HARSH SAHU - B.TECH CSE STUDENT & DEVELOPER
==================================================
Email: harshcse430@gmail.com
LinkedIn: linkedin.com/in/harsh-sahu-157698321
GitHub: github.com/Harsh43054
Address: Lucknow, Uttar Pradesh, India

SUMMARY:
Aspiring Software Developer passionate about building practical digital solutions, web applications, and educational technology projects. Strong interest in software development, problem-solving, community building, and emerging technologies.

EDUCATION:
- Bachelor of Technology (Computer Science & Engineering)
  Ambalika Institute of Management and Technology, Lucknow
  Affiliated with APJ Abdul Kalam Technical University (AKTU)
  Current Status: 3rd Year Student
- Class 12
  Modern Public School, Jhansi
  Central Board of Secondary Education (CBSE)

SKILLS:
- Programming: C, C++, Java, Python
- Web Development: HTML, CSS, JavaScript
- Tools: Git, GitHub, VS Code
- Core Strengths: Problem Solving, Communication, Team Leadership, Community Management, Event Management

EXPERIENCE:
- Community Manager at APYX Community
- Community Manager at We4X Community
  Responsibilities: Community growth, event coordination, member engagement, technical event management.

PROJECTS:
1. Agriculture Doctor
   A web-based platform designed to provide agriculture-related guidance through an intuitive and user-friendly interface.
2. Virtual Lab Module Development
   Developed virtual lab modules inspired by IIT Kanpur Virtual Labs. Worked on frontend development, simulation design, and simplifying experiments for better student understanding.
3. Portfolio Website
   Personal portfolio website showcasing projects, skills, achievements, and professional journey.

ACHIEVEMENTS:
- Active participant in hackathons and technical events
- Experience in community management and technical coordination
- Contribution to educational modules (Virtual Labs)
- Continuous learner in software development and AI technologies

==================================================
Generated from Harsh Sahu's Online Portfolio Website.
`;

      const blob = new Blob([resumeContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Harsh_Sahu_Resume.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }


  // --- CONTACT FORM VALIDATION & HANDLING ---
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    // Basic Floating Label Helper
    const inputs = contactForm.querySelectorAll('.form-input');
    inputs.forEach(input => {
      // Check if input already has content
      if (input.value.trim() !== '') {
        input.setAttribute('placeholder', ' '); // ensures placeholder-shown is false
      }
      
      input.addEventListener('blur', () => {
        if (input.value.trim() !== '') {
          input.setAttribute('placeholder', ' ');
        } else {
          input.removeAttribute('placeholder');
        }
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message').value.trim();
      
      let hasError = false;

      // Simple validation
      if (!name) {
        showFeedback('form-name', 'Please enter your name');
        hasError = true;
      } else {
        clearFeedback('form-name');
      }

      if (!email || !validateEmail(email)) {
        showFeedback('form-email', 'Please enter a valid email address');
        hasError = true;
      } else {
        clearFeedback('form-email');
      }

      if (!subject) {
        showFeedback('form-subject', 'Please enter a subject');
        hasError = true;
      } else {
        clearFeedback('form-subject');
      }

      if (!message) {
        showFeedback('form-message', 'Please enter your message');
        hasError = true;
      } else {
        clearFeedback('form-message');
      }

      if (hasError) return;

      // Submit feedback simulation
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `Sending... <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spinner"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>`;

      // CSS for spinner rotation
      const style = document.createElement('style');
      style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } } .spinner { animation: spin 1s linear infinite; }`;
      document.head.appendChild(style);

      // Simulate network request
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        formStatus.textContent = "Thank you, Harsh! Your message has been sent successfully. I will get back to you soon.";
        formStatus.className = "form-status success";
        contactForm.reset();

        // Clear values & reset floating labels
        inputs.forEach(input => {
          input.removeAttribute('placeholder');
        });

        // Hide success message after 5 seconds
        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 6000);
      }, 1500);
    });
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function showFeedback(inputId, msg) {
    const input = document.getElementById(inputId);
    const feedback = input.parentElement.querySelector('.form-feedback');
    if (feedback) {
      feedback.textContent = msg;
      feedback.classList.add('error');
    }
    input.style.borderColor = '#ef4444';
  }

  function clearFeedback(inputId) {
    const input = document.getElementById(inputId);
    const feedback = input.parentElement.querySelector('.form-feedback');
    if (feedback) {
      feedback.textContent = '';
      feedback.classList.remove('error');
    }
    input.style.borderColor = '';
  }
});
lucide.createIcons();