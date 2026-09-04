
(function oneko() {
  const isReducedMotion =
    window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
    window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;
  if (isReducedMotion) return;
  const nekoEl = document.createElement("div");
  let persistPosition = true;
  let nekoPosX = 32;
  let nekoPosY = 32;
  let mousePosX = 0;
  let mousePosY = 0;
  let frameCount = 0;
  let runningFrameCount = 0;
  let idleTime = 0;
  let idleAnimation = null;
  let idleAnimationFrame = 0;
  const nekoSpeed = 10;
  let isPenMode = false;
  let hasEnteredPen = false;
  let ballEl = null;
  let ballX = 0;
  let ballY = 0;
  let ballVx = 3.2;
  let ballVy = 2.2;
  let lastBatTime = 0;
  const spriteSets = {
    idle: [[-3, -3]],
    alert: [[-7, -3]],
    scratchSelf: [
      [-5, 0],
      [-6, 0],
      [-7, 0],
    ],
    scratchWallN: [
      [0, 0],
      [0, -1],
    ],
    scratchWallS: [
      [-7, -1],
      [-6, -2],
    ],
    scratchWallE: [
      [-2, -2],
      [-2, -3],
    ],
    scratchWallW: [
      [-4, 0],
      [-4, -1],
    ],
    tired: [[-3, -2]],
    sleeping: [
      [-2, 0],
      [-2, -1],
    ],
    N: [
      [-1, -2],
      [-1, -3],
    ],
    NE: [
      [0, -2],
      [0, -3],
    ],
    E: [
      [-3, 0],
      [-3, -1],
    ],
    SE: [
      [-5, -1],
      [-5, -2],
    ],
    S: [
      [-6, -3],
      [-7, -2],
    ],
    SW: [
      [-5, -3],
      [-6, -1],
    ],
    W: [
      [-4, -2],
      [-4, -3],
    ],
    NW: [
      [-1, 0],
      [-1, -1],
    ],
  };
  function init() {
    let nekoFile = "./oneko.gif"
    const curScript = document.currentScript
    if (curScript && curScript.dataset.cat) {
      nekoFile = curScript.dataset.cat
    }
    if (curScript && curScript.dataset.persistPosition) {
      if (curScript.dataset.persistPosition === "") {
        persistPosition = true;
      } else {
        persistPosition = JSON.parse(curScript.dataset.persistPosition.toLowerCase());
      }
    }
    if (persistPosition) {
      let storedNeko = JSON.parse(window.localStorage.getItem("oneko"));
      if (storedNeko !== null) {
        nekoPosX = storedNeko.nekoPosX;
        nekoPosY = storedNeko.nekoPosY;
        mousePosX = storedNeko.mousePosX;
        mousePosY = storedNeko.mousePosY;
        frameCount = storedNeko.frameCount;
        idleTime = storedNeko.idleTime;
        idleAnimation = storedNeko.idleAnimation;
        idleAnimationFrame = storedNeko.idleAnimationFrame;
        nekoEl.style.backgroundPosition = storedNeko.bgPos;
      }
    }
    nekoEl.id = "oneko";
    nekoEl.ariaHidden = true;
    nekoEl.style.width = "32px";
    nekoEl.style.height = "32px";
    nekoEl.style.position = "fixed";
    nekoEl.style.pointerEvents = "none";
    nekoEl.style.imageRendering = "pixelated";
    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
    nekoEl.style.zIndex = 2147483647;
    nekoEl.style.backgroundImage = `url(${nekoFile})`;
    document.body.appendChild(nekoEl);
    document.addEventListener("mousemove", function (event) {
      mousePosX = event.clientX;
      mousePosY = event.clientY;
    });
    document.addEventListener("touchstart", function (event) {
      if (event.touches.length > 0) {
        mousePosX = event.touches[0].clientX;
        mousePosY = event.touches[0].clientY;
      }
    });
    document.addEventListener("touchmove", function (event) {
      if (event.touches.length > 0) {
        mousePosX = event.touches[0].clientX;
        mousePosY = event.touches[0].clientY;
      }
    });
    document.addEventListener("click", function (event) {
      const diffX = nekoPosX - event.clientX;
      const diffY = nekoPosY - event.clientY;
      const distance = Math.sqrt(diffX ** 2 + diffY ** 2);
      if (distance < 24) {
        showSpeechBubble();
      }
    });
    if (persistPosition) {
      window.addEventListener("beforeunload", function (event) {
        window.localStorage.setItem("oneko", JSON.stringify({
          nekoPosX: nekoPosX,
          nekoPosY: nekoPosY,
          mousePosX: mousePosX,
          mousePosY: mousePosY,
          frameCount: frameCount,
          idleTime: idleTime,
          idleAnimation: idleAnimation,
          idleAnimationFrame: idleAnimationFrame,
          bgPos: nekoEl.style.backgroundPosition
        }));
      });
    }

    function setupPenBtn() {
      const penBtn = document.getElementById("cat-pen-btn");
      if (penBtn && !penBtn.dataset.bound) {
        penBtn.dataset.bound = "true";
        penBtn.addEventListener("click", function (event) {
          event.stopPropagation();
          togglePenMode();
        });
      }
    }
    setupPenBtn();
    document.addEventListener("DOMContentLoaded", setupPenBtn);

    window.addEventListener("scroll", function () {
      if (isPenMode) {
        const coverEl = document.querySelector(".profile-cover");
        if (coverEl) {
          const rect = coverEl.getBoundingClientRect();
          const minX = rect.left + 20;
          const maxX = rect.right - 20;
          const minY = rect.top + 20;
          const maxY = rect.bottom - 20;

          if (hasEnteredPen) {
            nekoPosX = Math.min(Math.max(minX, nekoPosX), maxX);
            nekoPosY = Math.min(Math.max(minY, nekoPosY), maxY);
            nekoEl.style.left = `${nekoPosX - 16}px`;
            nekoEl.style.top = `${nekoPosY - 16}px`;
          }

          if (ballEl) {
            ballX = Math.min(Math.max(minX - 4, ballX), maxX + 4);
            ballY = Math.min(Math.max(minY - 4, ballY), maxY + 4);
            ballEl.style.left = `${ballX - 6}px`;
            ballEl.style.top = `${ballY - 6}px`;
          }
        }
      }
    }, { passive: true });

    window.requestAnimationFrame(onAnimationFrame);
  }
  let lastFrameTimestamp;
  function onAnimationFrame(timestamp) {
    if (!nekoEl.isConnected) {
      return;
    }
    if (isPenMode) {
      updateBall();
    }
    if (!lastFrameTimestamp) {
      lastFrameTimestamp = timestamp;
    }
    if (timestamp - lastFrameTimestamp > 100) {
      lastFrameTimestamp = timestamp;
      frame();
    }
    window.requestAnimationFrame(onAnimationFrame);
  }

  function updateBall() {
    if (!isPenMode || !ballEl) return;
    const coverEl = document.querySelector(".profile-cover");
    if (!coverEl) return;
    const rect = coverEl.getBoundingClientRect();

    const minX = rect.left + 16;
    const maxX = rect.right - 16;
    const minY = rect.top + 16;
    const maxY = rect.bottom - 16;

    ballX += ballVx;
    ballY += ballVy;

    if (ballX <= minX) {
      ballX = minX;
      ballVx = Math.abs(ballVx);
    } else if (ballX >= maxX) {
      ballX = maxX;
      ballVx = -Math.abs(ballVx);
    }

    if (ballY <= minY) {
      ballY = minY;
      ballVy = Math.abs(ballVy);
    } else if (ballY >= maxY) {
      ballY = maxY;
      ballVy = -Math.abs(ballVy);
    }

    ballEl.style.left = `${ballX - 6}px`;
    ballEl.style.top = `${ballY - 6}px`;

    const now = Date.now();
    if (now - lastBatTime > 300) {
      const dist = Math.hypot(nekoPosX - ballX, nekoPosY - ballY);
      if (dist < 26) {
        lastBatTime = now;
        const angle = Math.atan2(ballY - nekoPosY, ballX - nekoPosX) + (Math.random() - 0.5) * 0.6;
        const speed = 4 + Math.random() * 2.5;
        ballVx = Math.cos(angle) * speed;
        ballVy = Math.sin(angle) * speed;

        ballEl.style.transform = "scale(1.4)";
        setTimeout(() => {
          if (ballEl) ballEl.style.transform = "scale(1)";
        }, 120);

        if (Math.random() < 0.2) {
          const batPhrases = ["Got it! 🧶", "Mine! 🐾", "Wheee! 😸", "Catch! 🧶"];
          showSpeechBubble(batPhrases[Math.floor(Math.random() * batPhrases.length)]);
        }
      }
    }
  }

  function togglePenMode() {
    isPenMode = !isPenMode;
    const penBtn = document.getElementById("cat-pen-btn");
    const coverEl = document.querySelector(".profile-cover");

    if (isPenMode) {
      hasEnteredPen = false;
      if (penBtn) {
        penBtn.classList.add("active");
        penBtn.innerHTML = '<span class="pen-icon">🧶</span><span class="pen-label">Release</span>';
        penBtn.title = "Release cat to roam";
      }
      if (!ballEl) {
        ballEl = document.createElement("div");
        ballEl.className = "cat-toy-ball";
        document.body.appendChild(ballEl);
      }
      if (coverEl) {
        const rect = coverEl.getBoundingClientRect();
        // The ball releases and starts running through the box!
        ballX = rect.left + rect.width / 2;
        ballY = rect.top + rect.height / 2;
        ballVx = (Math.random() > 0.5 ? 1 : -1) * 3.4;
        ballVy = (Math.random() > 0.5 ? 1 : -1) * 2.4;
        ballEl.style.left = `${ballX - 6}px`;
        ballEl.style.top = `${ballY - 6}px`;

        // If the cat is already inside or right at the banner, mark entered immediately
        if (nekoPosX >= rect.left + 10 && nekoPosX <= rect.right - 10 &&
            nekoPosY >= rect.top + 10 && nekoPosY <= rect.bottom - 10) {
          hasEnteredPen = true;
        }
      }
      showSpeechBubble("Yarn time! 🧶");
    } else {
      hasEnteredPen = false;
      if (penBtn) {
        penBtn.classList.remove("active");
        penBtn.innerHTML = '<span class="pen-icon">🧶</span><span class="pen-label">Playpen</span>';
        penBtn.title = "Put cat in playpen";
      }
      if (ballEl && ballEl.parentNode) {
        ballEl.remove();
        ballEl = null;
      }
      nekoPosY += 25;
      nekoEl.style.top = `${nekoPosY - 16}px`;
      showSpeechBubble("I'm back! 🐾");
    }
  }
  function setSprite(name, frame) {
    const sprite = spriteSets[name][frame % spriteSets[name].length];
    nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
  }
  function resetIdleAnimation() {
    idleAnimation = null;
    idleAnimationFrame = 0;
  }
  function idle() {
    idleTime += 1;
    if (
      idleTime > 10 &&
      Math.floor(Math.random() * 200) == 0 &&
      idleAnimation == null
    ) {
      let avalibleIdleAnimations = ["sleeping", "scratchSelf"];
      if (nekoPosX < 32) {
        avalibleIdleAnimations.push("scratchWallW");
      }
      if (nekoPosY < 32) {
        avalibleIdleAnimations.push("scratchWallN");
      }
      if (nekoPosX > window.innerWidth - 32) {
        avalibleIdleAnimations.push("scratchWallE");
      }
      if (nekoPosY > window.innerHeight - 32) {
        avalibleIdleAnimations.push("scratchWallS");
      }
      idleAnimation =
        avalibleIdleAnimations[
        Math.floor(Math.random() * avalibleIdleAnimations.length)
        ];
    }
    switch (idleAnimation) {
      case "sleeping":
        if (idleAnimationFrame < 8) {
          setSprite("tired", 0);
          break;
        }
        setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
        if (idleAnimationFrame > 192) {
          resetIdleAnimation();
        }
        break;
      case "scratchWallN":
      case "scratchWallS":
      case "scratchWallE":
      case "scratchWallW":
      case "scratchSelf":
        setSprite(idleAnimation, idleAnimationFrame);
        if (idleAnimationFrame > 9) {
          resetIdleAnimation();
        }
        break;
      default:
        setSprite("idle", 0);
        return;
    }
    idleAnimationFrame += 1;
  }
  const messages = [
    "Meow!",
    "Hello, Tiger Pasta reporting!",
    "I'm working here!",
    "Are you a recruiter?",
    "Hire Hanuma!",
    "Stop poking me!"
  ];
  function showSpeechBubble(customMessage) {
    const bubble = document.createElement("div");
    bubble.textContent = customMessage || messages[Math.floor(Math.random() * messages.length)];
    bubble.style.position = "fixed";
    bubble.style.left = `${nekoPosX + 20}px`;
    bubble.style.top = `${nekoPosY - 30}px`;
    bubble.style.backgroundColor = "var(--bg-card)";
    bubble.style.color = "var(--text-primary)";
    bubble.style.padding = "5px 12px";
    bubble.style.borderRadius = "10px";
    bubble.style.border = "1px solid var(--border-light)";
    bubble.style.fontSize = "12px";
    bubble.style.fontWeight = "500";
    bubble.style.pointerEvents = "none";
    bubble.style.zIndex = 2147483647;
    bubble.style.boxShadow = "var(--shadow-hover)";
    bubble.style.opacity = "0";
    bubble.style.transition = "opacity 0.2s, transform 0.2s";
    bubble.style.transform = "translateY(5px)";
    document.body.appendChild(bubble);
    window.getComputedStyle(bubble).opacity;
    bubble.style.opacity = "1";
    bubble.style.transform = "translateY(0)";
    setTimeout(() => {
      bubble.style.opacity = "0";
      bubble.style.transform = "translateY(-5px)";
      setTimeout(() => {
        if (bubble.parentNode) bubble.remove();
      }, 200);
    }, 2000);
  }
  function createFootprint(x, y, direction) {
    const paw = document.createElement("div");
    paw.textContent = "🐾";
    paw.style.position = "fixed";
    let rotation = 0;
    switch (direction) {
      case "N": rotation = 0; break;
      case "NE": rotation = 45; break;
      case "E": rotation = 90; break;
      case "SE": rotation = 135; break;
      case "S": rotation = 180; break;
      case "SW": rotation = 225; break;
      case "W": rotation = 270; break;
      case "NW": rotation = 315; break;
    }
    const offsetX = (frameCount % 12 === 0) ? -12 : -4;
    paw.style.left = `${x + offsetX}px`;
    paw.style.top = `${y - 4}px`;
    paw.style.fontSize = "12px";
    paw.style.pointerEvents = "none";
    paw.style.zIndex = 2147483646;
    paw.style.opacity = "0.9";
    paw.style.transform = `rotate(${rotation}deg)`;
    paw.style.filter = "grayscale(100%) brightness(300%)";
    paw.style.transition = "opacity 2.5s ease-out";
    document.body.appendChild(paw);
    window.getComputedStyle(paw).opacity;
    paw.style.opacity = "0";
    setTimeout(() => {
      if (paw.parentNode) paw.remove();
    }, 2500);
  }
  function frame() {
    frameCount += 1;
    let targetX = mousePosX;
    let targetY = mousePosY;

    if (isPenMode) {
      targetX = ballX;
      targetY = ballY;
    }

    const diffX = nekoPosX - targetX;
    const diffY = nekoPosY - targetY;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);
    if (distance < nekoSpeed || distance < (isPenMode ? 18 : 48)) {
      idle();
      runningFrameCount = 0;
      return;
    }
    idleAnimation = null;
    idleAnimationFrame = 0;
    if (idleTime > 1) {
      setSprite("alert", 0);
      idleTime = Math.min(idleTime, 7);
      idleTime -= 1;
      return;
    }
    let direction;
    direction = diffY / distance > 0.5 ? "N" : "";
    direction += diffY / distance < -0.5 ? "S" : "";
    direction += diffX / distance > 0.5 ? "W" : "";
    direction += diffX / distance < -0.5 ? "E" : "";
    setSprite(direction, frameCount);
    nekoPosX -= (diffX / distance) * nekoSpeed;
    nekoPosY -= (diffY / distance) * nekoSpeed;

    if (isPenMode) {
      const coverEl = document.querySelector(".profile-cover");
      if (coverEl) {
        const rect = coverEl.getBoundingClientRect();
        const minX = rect.left + 20;
        const maxX = rect.right - 20;
        const minY = rect.top + 20;
        const maxY = rect.bottom - 20;

        // Check if cat just arrived into the banner
        if (!hasEnteredPen) {
          if (nekoPosX >= minX - 15 && nekoPosX <= maxX + 15 &&
              nekoPosY >= minY - 15 && nekoPosY <= maxY + 15) {
            hasEnteredPen = true;
          }
        }

        // Once inside, keep cat permanently anchored inside the banner
        if (hasEnteredPen) {
          nekoPosX = Math.min(Math.max(minX, nekoPosX), maxX);
          nekoPosY = Math.min(Math.max(minY, nekoPosY), maxY);
        }
      }
    } else {
      nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
      nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);
    }

    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
    if (frameCount % 6 === 0) {
      createFootprint(nekoPosX, nekoPosY, direction);
    }
    runningFrameCount += 1;
    if (!isPenMode && runningFrameCount === 40) {
      const runningMessages = ["Wait up!", "Slow down!", "Hold on a second, I'm coming!", "I have tiny legs!", "Where are we going?!"];
      showSpeechBubble(runningMessages[Math.floor(Math.random() * runningMessages.length)]);
    }
    if (runningFrameCount > 150) {
      runningFrameCount = 0;
    }
  }
  init();
  window.addEventListener("load", () => {
    const pageLoader = document.getElementById("page-loader");
    const delay = pageLoader ? 3400 : 1200;
    setTimeout(() => {
      showSpeechBubble("Hello, Tiger Pasta reporting! 🐾");
    }, delay);
  });
})();
