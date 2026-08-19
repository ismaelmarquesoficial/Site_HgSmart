(function () {
  "use strict";

  const hero = document.querySelector("[data-cinema-hero]");
  if (!hero) return;

  const stage = hero.querySelector("[data-cinema-stage]");
  const actor = hero.querySelector("[data-opening-eduardo]");
  const actorVideo = hero.querySelector("[data-opening-video]");
  const facade = hero.querySelector("[data-opening-facade]");
  const facadeImage = facade?.querySelector("img");
  const interior = hero.querySelector("[data-opening-interior]");
  const interiorImage = hero.querySelector("[data-opening-interior] img");
  const portalFrame = hero.querySelector("[data-opening-portal-frame]");
  const leftDoor = hero.querySelector("[data-opening-door-left]");
  const rightDoor = hero.querySelector("[data-opening-door-right]");
  const seam = hero.querySelector("[data-opening-seam]");
  const copy = hero.querySelector("[data-opening-copy]");
  const title = hero.querySelector("[data-opening-title]");
  const reflection = hero.querySelector("[data-opening-reflection]");
  const firstImpact = hero.querySelector("[data-opening-impact-one]");
  const secondImpact = hero.querySelector("[data-opening-impact-two]");
  const scrollCue = hero.querySelector("[data-opening-scroll]");
  const destination = hero.querySelector("[data-opening-destination]");
  const progressRail = hero.querySelector("[data-opening-progress]");
  const displacement = hero.querySelector("[data-opening-displacement]");
  const grade = hero.querySelector(".hg-opening__grade");
  const audioButton = hero.querySelector("[data-opening-audio]");
  const voiceover = hero.querySelector("[data-opening-voice]");
  const skipLink = hero.querySelector("[data-opening-skip]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktop = window.matchMedia("(min-width: 64rem)");
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  let audioContext = null;
  let audioEnabled = false;
  let lastProgress = 0;
  const playedImpacts = new Set();
  let videoReady = false;

  function prepareActorVideo() {
    if (!actorVideo) return;

    const markReady = () => {
      videoReady = Number.isFinite(actorVideo.duration) && actorVideo.duration > 0;
      actor?.classList.toggle("is-video-ready", videoReady);
      if (videoReady) {
        actorVideo.currentTime = 0;
        if (!desktop.matches && !reducedMotion.matches) actorVideo.play().catch(() => {});
      }
    };

    actorVideo.addEventListener("loadedmetadata", markReady, { once: true });
    actorVideo.addEventListener("error", () => actor?.classList.remove("is-video-ready"), { once: true });
    actorVideo.load();
  }

  function scrubActorVideo(progress) {
    if (!videoReady || !actorVideo) return;
    const normalized = gsap.utils.clamp(0, 1, progress / 0.54);
    const targetTime = normalized * Math.max(0, actorVideo.duration - 0.05);
    if (Math.abs(actorVideo.currentTime - targetTime) > 0.035) actorVideo.currentTime = targetTime;
  }

  prepareActorVideo();

  function setOpeningActive(active) {
    document.documentElement.classList.toggle("hg-opening-active", active);
  }

  const activeObserver = new IntersectionObserver(
    ([entry]) => setOpeningActive(Boolean(entry?.isIntersecting)),
    { threshold: 0.025 }
  );
  activeObserver.observe(hero);

  function ensureAudioContext() {
    if (audioContext) return audioContext;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    audioContext = new AudioContext();
    return audioContext;
  }

  function playGlassKnock(stronger) {
    if (!audioEnabled) return;
    const context = ensureAudioContext();
    if (!context) return;

    const now = context.currentTime;
    const master = context.createGain();
    const body = context.createOscillator();
    const edge = context.createOscillator();
    const bodyGain = context.createGain();
    const edgeGain = context.createGain();

    master.gain.setValueAtTime(stronger ? 0.32 : 0.23, now);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    body.type = "sine";
    body.frequency.setValueAtTime(stronger ? 118 : 138, now);
    body.frequency.exponentialRampToValueAtTime(78, now + 0.16);
    bodyGain.gain.setValueAtTime(0.72, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

    edge.type = "triangle";
    edge.frequency.setValueAtTime(stronger ? 630 : 720, now);
    edge.frequency.exponentialRampToValueAtTime(310, now + 0.08);
    edgeGain.gain.setValueAtTime(0.25, now);
    edgeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.085);

    body.connect(bodyGain).connect(master);
    edge.connect(edgeGain).connect(master);
    master.connect(context.destination);
    body.start(now);
    edge.start(now);
    body.stop(now + 0.19);
    edge.stop(now + 0.1);
  }

  function setAudio(enabled) {
    audioEnabled = enabled;
    audioButton?.setAttribute("aria-pressed", String(enabled));
    if (audioButton) audioButton.textContent = enabled ? "ÁUDIO ATIVADO" : "ÁUDIO DESLIGADO";
    if (enabled) {
      ensureAudioContext()?.resume().catch(() => {});
      if (voiceover) {
        const mappedTime = gsap
          ? gsap.utils.clamp(0, Math.max(0, voiceover.duration - 0.1), (lastProgress / 0.54) * voiceover.duration)
          : 0;
        if (!Number.isFinite(voiceover.currentTime) || voiceover.ended) voiceover.currentTime = mappedTime;
        voiceover.play().catch(() => {});
      }
    } else {
      voiceover?.pause();
    }
  }

  audioButton?.addEventListener("click", () => setAudio(!audioEnabled));

  skipLink?.addEventListener("click", (event) => {
    event.preventDefault();
    const target = document.querySelector(skipLink.getAttribute("href"));
    if (!target) return;
    target.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
  });

  if (!gsap || !ScrollTrigger || reducedMotion.matches) {
    if (scrollCue) scrollCue.style.opacity = "1";
    window.addEventListener("pagehide", () => activeObserver.disconnect(), { once: true });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("opening-motion");
  title.style.filter = "url(#hg-title-ripple)";

  function impactAt(progress, id, stronger) {
    if (progress < 0.14) playedImpacts.clear();
    if (progress >= id && lastProgress < id && !playedImpacts.has(id)) {
      playedImpacts.add(id);
      playGlassKnock(stronger);
    }
  }

  function syncProgress(progress) {
    const value = gsap.utils.clamp(0, 1, progress);
    gsap.set(progressRail, { scaleX: value });
    scrubActorVideo(value);
    impactAt(value, 0.238, false);
    impactAt(value, 0.318, true);
    lastProgress = value;
  }

  function createScrollSequence() {
    const timeline = gsap.timeline({ paused: true, defaults: { ease: "none" } });

    timeline
      .set(actor, { autoAlpha: 0, xPercent: 19, scale: 0.94 })
      .set(facade, {
        autoAlpha: 0.08,
        clipPath: "inset(0 49.55% 0 49.55%)",
        scale: 1.16,
        xPercent: 0,
        yPercent: 0,
      })
      .set(facadeImage, { scale: 1.03, xPercent: 0, yPercent: 0 })
      .set(interior, {
        autoAlpha: 0,
        clipPath: "polygon(43% 29%, 69% 27%, 73% 91%, 38% 91%)",
        scale: 1.4,
        filter: "blur(8px)",
      })
      .set(interiorImage, { scale: 1.12, filter: "brightness(.56) saturate(.76) contrast(1.08)" })
      .set([firstImpact, secondImpact, destination, scrollCue, portalFrame], { autoAlpha: 0 })
      .set(destination, { y: 20 })
      .set(leftDoor, { autoAlpha: 0, xPercent: -52, rotationY: -18 })
      .set(rightDoor, { autoAlpha: 0, xPercent: 52, rotationY: 18 })
      .set(seam, { scaleY: 0.04, autoAlpha: 0 })
      .set(displacement, { attr: { scale: 0 } })
      .to({}, { duration: 1 }, 0)

      .to(facade, {
        autoAlpha: 0.88,
        clipPath: "inset(0 0% 0 0%)",
        scale: 1.09,
        duration: 0.17,
        ease: "expo.out",
      }, 0)
      .to(facadeImage, { scale: 1.055, xPercent: -0.7, duration: 0.31, ease: "power2.out" }, 0)
      .to(actor, { autoAlpha: 1, xPercent: 0, scale: 1, duration: 0.155, ease: "power4.out" }, 0.028)
      .to(copy, { yPercent: -3, duration: 0.46, ease: "power1.inOut" }, 0.08)

      .to(actor, { scale: 1.022, xPercent: -0.4, duration: 0.012, ease: "power2.in" }, 0.232)
      .to(actor, { scale: 1, xPercent: 0, duration: 0.036, ease: "expo.out" }, 0.244)
      .to(facade, { scale: 1.11, duration: 0.012 }, 0.232)
      .to(facade, { scale: 1.095, duration: 0.05, ease: "expo.out" }, 0.244)
      .to(firstImpact, { autoAlpha: 0.95, scale: 0.72, duration: 0.012 }, 0.232)
      .to(firstImpact, { autoAlpha: 0, scale: 2.65, duration: 0.068, ease: "power2.out" }, 0.244)
      .to(reflection, { xPercent: 3.2, opacity: 0.72, duration: 0.012 }, 0.232)
      .to(reflection, { xPercent: -3, opacity: 0.38, duration: 0.045, ease: "expo.out" }, 0.244)
      .to(displacement, { attr: { scale: 19 }, duration: 0.012 }, 0.232)
      .to(displacement, { attr: { scale: 0 }, duration: 0.044, ease: "power2.out" }, 0.244)

      .to(actor, { scale: 1.028, xPercent: -0.5, duration: 0.012, ease: "power2.in" }, 0.312)
      .to(actor, { scale: 1, xPercent: 0, duration: 0.04, ease: "expo.out" }, 0.324)
      .to(secondImpact, { autoAlpha: 1, scale: 0.9, duration: 0.012 }, 0.312)
      .to(secondImpact, { autoAlpha: 0, scale: 2.8, duration: 0.075, ease: "power2.out" }, 0.324)
      .to(reflection, { xPercent: 4.2, opacity: 0.78, duration: 0.012 }, 0.312)
      .to(reflection, { xPercent: -3, opacity: 0.42, duration: 0.052, ease: "expo.out" }, 0.324)
      .to(displacement, { attr: { scale: 23 }, duration: 0.012 }, 0.312)
      .to(displacement, { attr: { scale: 0 }, duration: 0.05, ease: "power2.out" }, 0.324)
      .to(seam, { scaleY: 1, autoAlpha: 1, duration: 0.09, ease: "power3.out" }, 0.318)
      .to(portalFrame, { autoAlpha: 1, scale: 1, duration: 0.11, ease: "power3.out" }, 0.318)
      .to(interior, { autoAlpha: 0.72, filter: "blur(1px)", duration: 0.12, ease: "power2.out" }, 0.318)
      .to(interiorImage, { filter: "brightness(.8) saturate(.88) contrast(1.06)", duration: 0.12, ease: "power2.out" }, 0.318)
      .to(facadeImage, { filter: "brightness(.62) contrast(1.14) saturate(.86)", duration: 0.12 }, 0.318)
      .to(scrollCue, { autoAlpha: 1, duration: 0.055, ease: "power2.out" }, 0.365)

      .to(facade, { scale: 1.22, xPercent: -1.8, yPercent: -0.8, duration: 0.25, ease: "power1.inOut" }, 0.35)
      .to(facadeImage, { scale: 1.09, xPercent: -1.5, duration: 0.25, ease: "power1.inOut" }, 0.35)
      .to(portalFrame, { scale: 1.08, duration: 0.22, ease: "power1.inOut" }, 0.35)
      .to(grade, { scale: 1.04, xPercent: -1.2, duration: 0.25, ease: "power1.inOut" }, 0.35)

      .to(copy, { autoAlpha: 0, xPercent: -16, scale: 1.08, filter: "blur(6px)", duration: 0.12, ease: "power2.in" }, 0.535)
      .to(scrollCue, { autoAlpha: 0, duration: 0.055 }, 0.535)
      .to(leftDoor, { autoAlpha: 0.88, xPercent: 0, rotationY: -10, duration: 0.07, ease: "power2.out" }, 0.54)
      .to(rightDoor, { autoAlpha: 0.88, xPercent: 0, rotationY: 10, duration: 0.07, ease: "power2.out" }, 0.54)
      .to(interior, {
        autoAlpha: 1,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        scale: 1,
        filter: "blur(0px)",
        duration: 0.36,
        ease: "power3.inOut",
      }, 0.54)
      .to(interiorImage, { scale: 1, filter: "brightness(1) saturate(1) contrast(1)", duration: 0.39, ease: "power2.out" }, 0.54)
      .to(facade, { autoAlpha: 0, scale: 1.48, filter: "blur(12px) brightness(.72)", duration: 0.28, ease: "power3.in" }, 0.55)
      .to(portalFrame, { autoAlpha: 0, scale: 3.2, filter: "blur(7px)", duration: 0.24, ease: "power3.in" }, 0.56)
      .to(actor, {
        autoAlpha: 0,
        xPercent: 12,
        scale: 1.34,
        filter: "blur(7px) brightness(1.16) saturate(.74)",
        duration: 0.25,
        ease: "power3.in",
      }, 0.555)
      .to(leftDoor, { autoAlpha: 0, xPercent: -145, rotationY: -68, duration: 0.25, ease: "power3.in" }, 0.61)
      .to(rightDoor, { autoAlpha: 0, xPercent: 145, rotationY: 68, duration: 0.25, ease: "power3.in" }, 0.61)
      .to(seam, { autoAlpha: 0, scaleY: 1.45, duration: 0.12, ease: "power2.in" }, 0.64)
      .to(destination, { autoAlpha: 1, y: 0, duration: 0.11, ease: "power3.out" }, 0.83);

    return timeline;
  }

  const media = gsap.matchMedia();

  media.add("(min-width: 64rem)", () => {
    const sequence = createScrollSequence();
    syncProgress(0);

    sequence.eventCallback("onUpdate", () => syncProgress(sequence.progress()));

    const trigger = ScrollTrigger.create({
      id: "hg-opening",
      trigger: hero,
      start: "top top",
      end: "bottom bottom",
      animation: sequence,
      scrub: 0.58,
      invalidateOnRefresh: true,
      onRefresh: (self) => sequence.progress(self.progress),
    });

    return () => {
      trigger.kill();
      sequence.kill();
      gsap.set([actor, facade, facadeImage, interior, interiorImage, portalFrame, leftDoor, rightDoor, seam, copy, reflection, firstImpact, secondImpact, scrollCue, destination, progressRail, grade], { clearProps: "all" });
    };
  });

  media.add("(max-width: 63.99rem)", () => {
    const sequence = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.12 });

    if (videoReady && actorVideo) {
      actorVideo.currentTime = 0;
      actorVideo.play().catch(() => {});
    }

    sequence
      .set(actor, { autoAlpha: 0, xPercent: 14, scale: 1.025 })
      .set(facade, { autoAlpha: 0.2, clipPath: "inset(0 47% 0 47%)" })
      .set([firstImpact, secondImpact, scrollCue], { autoAlpha: 0 })
      .set(displacement, { attr: { scale: 0 } })
      .to(facade, { autoAlpha: 0.72, clipPath: "inset(0 15% 0 15%)", duration: 0.75 }, 0)
      .to(actor, { autoAlpha: 1, xPercent: 0, scale: 1, duration: 0.82 }, 0.08)
      .to(actor, { scale: 1.018, xPercent: -0.35, duration: 0.11, ease: "power2.in" }, 1.55)
      .to(actor, { scale: 1, xPercent: 0, duration: 0.2, ease: "expo.out" })
      .to(firstImpact, { autoAlpha: 1, scale: 0.82, duration: 0.09 }, 1.55)
      .to(firstImpact, { autoAlpha: 0, scale: 2.45, duration: 0.46 }, 1.64)
      .to(displacement, { attr: { scale: 17 }, duration: 0.08 }, 1.55)
      .to(displacement, { attr: { scale: 0 }, duration: 0.24 }, 1.63)
      .call(() => playGlassKnock(false), [], 1.55)
      .to(actor, { scale: 1.022, xPercent: -0.45, duration: 0.11, ease: "power2.in" }, 2.18)
      .to(actor, { scale: 1, xPercent: 0, duration: 0.22, ease: "expo.out" })
      .to(secondImpact, { autoAlpha: 1, scale: 0.9, duration: 0.09 }, 2.18)
      .to(secondImpact, { autoAlpha: 0, scale: 2.75, duration: 0.5 }, 2.27)
      .to(displacement, { attr: { scale: 22 }, duration: 0.08 }, 2.18)
      .to(displacement, { attr: { scale: 0 }, duration: 0.26 }, 2.26)
      .to(seam, { scaleY: 1, autoAlpha: 1, duration: 0.45 }, 2.18)
      .call(() => playGlassKnock(true), [], 2.18)
      .to(scrollCue, { autoAlpha: 1, duration: 0.45 }, 2.48);

    return () => {
      actorVideo?.pause();
      sequence.kill();
      gsap.set([actor, facade, firstImpact, secondImpact, scrollCue, seam], { clearProps: "all" });
    };
  });

  window.addEventListener(
    "pagehide",
    () => {
      activeObserver.disconnect();
      media.revert();
      document.documentElement.classList.remove("opening-motion", "hg-opening-active");
      voiceover?.pause();
      audioContext?.close().catch(() => {});
    },
    { once: true }
  );
})();
