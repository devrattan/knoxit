// artifacts/knoxit/src/pages/menu/StaticPages.tsx
// Routes: /menu/how-to-play, /menu/faq, /menu/terms, /menu/privacy, /menu/support, /menu/about
import { SubHeader } from "../../components/Header";

function Page({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <SubHeader title={title} onBack={() => window.history.back()} />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2 pb-6 text-zinc-300 text-[13px] leading-relaxed space-y-4">
        {children}
      </div>
    </>
  );
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-white text-[13px] font-bold mb-1.5">{heading}</div>
      <div className="text-zinc-400 text-[12px] leading-relaxed">{children}</div>
    </div>
  );
}

export function HowToPlay() {
  return (
    <Page title="How to Play">
      <Section heading="The Basics">
        Each Gameweek, pick one team you think will win their match. If your team wins, you survive to the next
        Gameweek. If they draw or lose, you're knocked out — unless your backup pick saves you.
      </Section>
      <Section heading="Primary & Backup Picks">
        Backup is NOT a second guess — if your primary team's match is played and they draw or lose, you're
        eliminated, full stop. Backup only comes into play if your primary team's match is postponed or abandoned
        and doesn't get played at all. It exists purely so a rescheduled fixture can't unfairly wipe you out of
        the league.
      </Section>
      <Section heading="You Can't Repeat a Team">
        Once you've picked a team, you can't pick them again until you've used every team in the pool at least
        once. After that, the pool resets and any team becomes available again.
      </Section>
      <Section heading="Last Survivor Wins">
        The league continues, Gameweek after Gameweek, until one player remains. That survivor takes the vault.
      </Section>
      <Section heading="Splitting the Vault">
        Once a league is down to 5 or fewer survivors, anyone can propose splitting the vault evenly. Every
        remaining survivor has to agree — even one no, and the league continues as normal.
      </Section>
      <Section heading="Boosters">
        Chips (earned free or bought) can be spent in the Shop on boosters like Draw Shield, Team Recall, and
        League Pulse — small strategic edges, never a guaranteed win.
      </Section>
    </Page>
  );
}

export function FAQ() {
  const faqs = [
    { q: "What happens if my match is postponed?", a: "Postponed matches are excluded from that Gameweek's results for affected players — your pick simply carries no result until it's played." },
    { q: "Can I change my pick after submitting?", a: "Yes, up until the lock time for that Gameweek. Once locked, picks are final." },
    { q: "What's the difference between Friends Leagues and regular leagues?", a: "Regular leagues are public, chip-entry competitions anyone can join. Friends Leagues are created by a player, invite-only or request-to-join, with no entry fee or member cap." },
    { q: "Does Knoxit handle real money?", a: "Not this season. Everything runs on chips, which have no cash value. Any private arrangement in a Friends League's Entry Terms is strictly between its members, not through Knoxit." },
    { q: "I think I found a bug. What do I do?", a: "Head to Contact Support and describe what happened — screenshots help a lot." },
  ];
  return (
    <Page title="FAQ / Help Center">
      {faqs.map((f, i) => (
        <div key={i} className="border-b border-white/5 pb-4 last:border-0">
          <div className="text-white text-[13px] font-semibold mb-1">{f.q}</div>
          <div className="text-zinc-400 text-[12px]">{f.a}</div>
        </div>
      ))}
    </Page>
  );
}

export function TermsAndConditions() {
  return (
    <Page title="Terms & Conditions">
      <div className="text-zinc-500 text-[11px] italic mb-2">
        Placeholder text — replace with your actual reviewed Terms before launch. This is not legal advice.
      </div>
      <Section heading="1. Eligibility">Placeholder — age/region eligibility requirements go here.</Section>
      <Section heading="2. Chips Have No Cash Value">Chips are a virtual, in-app resource with no real-world monetary value and cannot be exchanged for cash.</Section>
      <Section heading="3. Friends Leagues">Any prize or stakes arrangement described in a Friends League's Entry Terms is strictly between its members. Knoxit does not set, collect, hold, or process any such arrangement.</Section>
      <Section heading="4. Account Termination">Placeholder — grounds for suspension/termination go here.</Section>
      <Section heading="5. Changes to These Terms">Placeholder — how and when terms may be updated.</Section>
    </Page>
  );
}

export function PrivacyPolicy() {
  return (
    <Page title="Privacy Policy">
      <div className="text-zinc-500 text-[11px] italic mb-2">
        Placeholder text — replace with your actual reviewed Privacy Policy before launch. This is not legal advice.
      </div>
      <Section heading="What We Collect">Placeholder — account info, gameplay data, device/usage data.</Section>
      <Section heading="How We Use It">Placeholder — running the game, fraud prevention, communications.</Section>
        <Section heading="Third Parties">Placeholder — Neon (database hosting), football-data.org (fixtures), the API host, email provider, and any ad network once integrated.</Section>
      <Section heading="Your Rights">Placeholder — access, correction, deletion (see Delete Account in the menu).</Section>
    </Page>
  );
}

export function ContactSupport() {
  return (
    <Page title="Contact Support">
      <Section heading="Email">support@knoxit.app (placeholder — replace with real address)</Section>
      <Section heading="Response Time">We aim to respond within 24–48 hours.</Section>
      <Section heading="Before You Write In">
        Check the FAQ first — many common questions (postponed matches, pick changes, Friends Leagues) are already answered there.
      </Section>
    </Page>
  );
}

export function About() {
  return (
    <Page title="About">
      <Section heading="Knoxit">A football survivor pool — last fan standing takes the vault.</Section>
      <Section heading="Version">v0.1.0 (Beta)</Section>
      <Section heading="Built for">Nigeria, Indonesia, Brazil, Kenya, Bangladesh, Philippines</Section>
    </Page>
  );
}
