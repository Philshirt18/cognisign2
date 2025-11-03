"use client";

import { useState } from "react";

const steps = [
  {
    id: "prepare",
    label: "1 · Prepare your space",
    bullets: [
      "Choose a quiet room and sit about 20 cm away from your microphone.",
      "Reduce background noise (fans, notifications) and close other audio apps.",
      "Have a glass of water nearby—hydrated voices sound clearer."
    ]
  },
  {
    id: "warmup",
    label: "2 · Warm up your voice",
    bullets: [
      "Hum or read a sentence slowly to ease into your natural pace.",
      "Relax your shoulders and breathe steadily.",
      "Glance over the reading script so the words feel familiar."
    ]
  },
  {
    id: "record",
    label: "3 · Record the sample",
    bullets: [
      "When you press record, speak clearly and keep a steady pace.",
      "Aim for at least 10 seconds of audio. Pauses for breathing are okay.",
      "Listen to the preview and re-record if the room was noisy."
    ]
  }
];

const OnboardingSteps = () => {
  const [active, setActive] = useState(steps[0]);
  const [scriptOpen, setScriptOpen] = useState(false);

  return (
    <section className="card">
      <h2>Get ready</h2>
      <div className="steps">
        {steps.map((step) => (
          <button
            key={step.id}
            type="button"
            className="step-button"
            data-active={active.id === step.id}
            onClick={() => setActive(step)}
          >
            {step.label}
          </button>
        ))}
      </div>

      <ul className="bullet-list">
        {active.bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div className="script-expander">
        <button
          type="button"
          className="script-button"
          onClick={() => setScriptOpen((prev) => !prev)}
        >
          {scriptOpen ? "Hide suggested reading script" : "Suggested reading script"}
        </button>
        {scriptOpen && (
          <div className="script-content">
            <p>
              &ldquo;We value the time you take to check on your brain health. My name is ____.
              Today I feel _____. I can remember a recent moment that made me smile.&rdquo;
            </p>
          </div>
        )}
      </div>

      <div className="info-banner">
        Aim for quiet backgrounds and at least 10 seconds of speech for reliable quality checks.
      </div>
    </section>
  );
};

export default OnboardingSteps;
