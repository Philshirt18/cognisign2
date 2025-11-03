"use client";

import { useRouter } from "next/navigation";

export default function DisclaimerPage() {
  const router = useRouter();

  return (
    <main className="disclaimer-page">
      <section className="disclaimer-card">
        <h1>⚠️ Disclaimer</h1>
        <p>
          This application uses voice data, including examples from individuals diagnosed with
          Alzheimer&rsquo;s disease, to support early detection research and awareness. It is designed
          for educational and assistive purposes only and should not be used as a substitute for
          professional medical diagnosis or advice.
        </p>
        <p>
          If you have any concerns or notice possible symptoms, please consult a qualified healthcare
          professional. The creators and developers of this app cannot be held responsible for any
          decisions, outcomes, or actions taken based on the information provided by this tool.
        </p>
        <button
          type="button"
          onClick={() => {
            window.localStorage.setItem("disclaimerAccepted", "true");
            router.push("/");
          }}
        >
          I understand — enter app
        </button>
      </section>
      <style jsx>{`
        .disclaimer-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(180deg, #f4f7fb 0%, #ffffff 71%);
          padding: 2rem;
          color: #0b2545;
        }
        .disclaimer-card {
          max-width: 640px;
          background: #ffffff;
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 35px 80px rgba(11, 37, 69, 0.18);
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          line-height: 1.6;
        }
        h1 {
          margin: 0;
        }
        button {
          align-self: flex-start;
          border: none;
          border-radius: 999px;
          background: linear-gradient(135deg, #0b2545, #2ca6a4);
          color: #ffffff;
          padding: 0.75rem 1.9rem;
          font-weight: 600;
          cursor: pointer;
        }
        button:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 30px rgba(44, 166, 164, 0.35);
        }
      `}</style>
    </main>
  );
}
