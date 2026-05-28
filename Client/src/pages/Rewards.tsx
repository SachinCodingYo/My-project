import React from "react";

const rewards = [
  {
    id: 1,
    title: "SIM purchases",
    pill: "India & international eSIM",
    pillBg: "#EEEDFE",
    pillColor: "#3C3489",
    iconBg: "#EEEDFE",
    rate: "5%",
    rateColor: "#534AB7",
    rateLabel: "cashback in coins",
    description: "Earn coins every time you buy a new SIM or eSIM plan for any destination.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <circle cx="12" cy="18" r="1" fill="#534AB7" stroke="none" />
        <line x1="9" y1="6" x2="15" y2="6" />
        <line x1="9" y1="10" x2="15" y2="10" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Bill payments",
    pill: "Mobile, DTH, broadband, power",
    pillBg: "#E1F5EE",
    pillColor: "#085041",
    iconBg: "#E1F5EE",
    rate: "0.1%",
    rateColor: "#0F6E56",
    rateLabel: "cashback in coins",
    description: "Pay your everyday utility bills and earn coins on every transaction.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="13" y2="17" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Refer & earn",
    pill: "Friends & family",
    pillBg: "#FAEEDA",
    pillColor: "#412402",
    iconBg: "#FAEEDA",
    rate: "Bonus",
    rateColor: "#854F0B",
    rateLabel: "coins per activation",
    description: "Share your referral link — earn bonus coins when friends activate their first SIM.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#854F0B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const steps = [
  {
    n: 1,
    title: "Buy a SIM or recharge",
    desc: "Any purchase on the platform qualifies",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#EEEDFE" />
        <rect x="9" y="8" width="10" height="16" rx="2" stroke="#534AB7" strokeWidth="1.5" />
        <circle cx="14" cy="21" r="1" fill="#534AB7" />
      </svg>
    ),
  },
  {
    n: 2,
    title: "Coins credited instantly",
    desc: "No delays — wallet updates right away",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#EEEDFE" />
        <circle cx="16" cy="16" r="6" stroke="#534AB7" strokeWidth="1.5" />
        <path d="M16 13v3l2 2" stroke="#534AB7" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    n: 3,
    title: "Coins become money",
    desc: "100 coins = ₹1 in wallet balance",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#EEEDFE" />
        <path d="M10 22l4-4 3 3 5-7" stroke="#534AB7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    n: 4,
    title: "Redeem on next order",
    desc: "Use wallet money at checkout anytime",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#EEEDFE" />
        <rect x="8" y="12" width="16" height="10" rx="2" stroke="#534AB7" strokeWidth="1.5" />
        <circle cx="19" cy="17" r="1.5" fill="#534AB7" />
        <path d="M8 16h16" stroke="#534AB7" strokeWidth="1.5" />
      </svg>
    ),
  },
];

const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <polygon
      points="10,2 12.4,7.5 18.5,8.1 14,12.2 15.5,18.1 10,15 4.5,18.1 6,12.2 1.5,8.1 7.6,7.5"
      stroke="#1D9E75"
      strokeWidth="1.2"
      fill="#E1F5EE"
    />
  </svg>
);

const Rewards = () => {
  return (
    <>
      <div style={s.page}>

        {/* HERO */}
        <div style={s.hero}>
          <div style={s.heroBadge}>
            <span style={s.heroDot} />
            Rewards program
          </div>
          <h1 style={s.heroH1}>Every purchase earns you more</h1>
          <p style={s.heroP}>
            Buy SIMs, pay bills, refer friends — every action adds coins to your wallet that convert to real savings.
          </p>
          <div style={s.heroStats}>
            <div style={s.hs}>
              <div style={s.hsVal}>1,250</div>
              <div style={s.hsLbl}>Reward coins</div>
            </div>
            <div style={s.hsDivider} />
            <div style={s.hs}>
              <div style={s.hsVal}>₹12.50</div>
              <div style={s.hsLbl}>Wallet balance</div>
            </div>
            <div style={s.hsDivider} />
            <div style={s.hs}>
              <div style={s.hsVal}>100:1</div>
              <div style={s.hsLbl}>Coin rate</div>
            </div>
          </div>
          <button style={s.redeemBtn}>Redeem coins →</button>
        </div>

        {/* HOW IT WORKS */}
        <div style={s.section}>
          <div style={s.secHead}>
            <span style={s.secTitle}>How it works</span>
            <span style={s.secTag}>4 steps</span>
          </div>
          <div style={s.stepsGrid}>
            {steps.map((step) => (
              <div key={step.n} style={s.stepCard}>
                <div style={s.stepNum}>{step.n}</div>
                <div style={{ marginBottom: 10 }}>{step.icon}</div>
                <h4 style={s.stepH4}>{step.title}</h4>
                <p style={s.stepP}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* WAYS TO EARN */}
        <div style={s.section}>
          <div style={s.secHead}>
            <span style={s.secTitle}>Ways to earn</span>
          </div>
          <div style={s.earnGrid}>
            {rewards.map((item) => (
              <div key={item.id} style={s.earnCard}>
                <div style={{ ...s.earnIconWrap, background: item.iconBg }}>
                  {item.icon}
                </div>
                <h3 style={s.earnH3}>{item.title}</h3>
                <span style={{ ...s.earnPill, background: item.pillBg, color: item.pillColor }}>
                  {item.pill}
                </span>
                <p style={s.earnP}>{item.description}</p>
                <div style={s.earnRate}>
                  <span style={{ ...s.earnRateNum, color: item.rateColor }}>{item.rate}</span>
                  <span style={s.earnRateLbl}>{item.rateLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div style={s.bottomRow}>

          {/* CONVERSION */}
          <div style={s.convCard}>
            <h3 style={s.convH3}>Coins conversion</h3>
            {[
              { key: "Exchange rate", val: "100 coins = ₹1" },
              { key: "Your coins", val: "1,250 coins" },
              { key: "Wallet value", val: "₹12.50" },
              { key: "Usable on", val: "SIM, recharge, bills" },
              { key: "Expiry", val: "No expiry" },
            ].map((row, i) => (
              <div key={i} style={{ ...s.convRow, borderBottom: i < 4 ? "0.5px solid #e5e5e5" : "none" }}>
                <span style={s.convKey}>{row.key}</span>
                <span style={s.convVal}>{row.val}</span>
              </div>
            ))}
          </div>

          {/* SCRATCH */}
          <div style={s.scratchCard}>
            <h3 style={s.scratchH3}>Scratch & win</h3>
            <p style={s.scratchP}>
              Unlock scratch cards on select purchases for bonus coins and exclusive deals.
            </p>
            <div style={s.scratchCardsRow}>
              {[1, 2, 3].map((n) => (
                <div key={n} style={s.sc}>
                  <StarIcon />
                  <div style={s.scTxt}>Card {n}</div>
                  <div style={s.scSub}>Scratch me</div>
                </div>
              ))}
            </div>
            <button style={s.scratchBtn}>View all scratch cards</button>
          </div>
        </div>

        {/* REFERRAL STRIP */}
        <div style={s.referStrip}>
          <div>
            <h4 style={s.referH4}>Invite a friend, earn together</h4>
            <p style={s.referP}>
              Share your unique code — you both get bonus coins when they activate a SIM.
            </p>
          </div>
          <button style={s.referBtn}>Share referral link</button>
        </div>

      </div>

      <style>{`
        @media (max-width: 640px) {
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
          .earn-grid { grid-template-columns: 1fr !important; }
          .bottom-row { grid-template-columns: 1fr !important; }
          .refer-strip { flex-direction: column !important; }
        }
      `}</style>
    </>
  );
};

const s = {
  page: {
    fontFamily: "Arial, sans-serif",
    background: "#f5f7fb",
    minHeight: "100vh",
    paddingBottom: 56,
  },
  /* HERO */
  hero: {
    background: "#EEEDFE",
    border: "0.5px solid #CECBF6",
    borderRadius: "0 0 20px 20px",
    padding: "52px 40px 52px",
    textAlign: "center",
  },
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "#fff",
    border: "0.5px solid #CECBF6",
    borderRadius: 20,
    padding: "5px 14px",
    fontSize: 12,
    color: "#534AB7",
    fontWeight: 500,
    marginBottom: 18,
  },
  heroDot: {
    display: "inline-block",
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#7F77DD",
  },
  heroH1: {
    fontSize: 30,
    fontWeight: 500,
    color: "#26215C",
    marginBottom: 10,
    lineHeight: 1.3,
  },
  heroP: {
    fontSize: 15,
    color: "#534AB7",
    maxWidth: 480,
    margin: "0 auto 28px",
    lineHeight: 1.7,
  },
  heroStats: {
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    background: "#fff",
    border: "0.5px solid #CECBF6",
    borderRadius: 12,
    maxWidth: 420,
    margin: "0 auto 24px",
    overflow: "hidden",
  },
  hs: { flex: 1, padding: "18px 20px", textAlign: "center" },
  hsDivider: { width: "0.5px", background: "#CECBF6", alignSelf: "stretch" },
  hsVal: { fontSize: 22, fontWeight: 500, color: "#534AB7" },
  hsLbl: { fontSize: 11, color: "#7F77DD", marginTop: 3, letterSpacing: "0.5px", textTransform: "uppercase" },
  redeemBtn: {
    background: "#534AB7",
    color: "#fff",
    border: "none",
    padding: "11px 28px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    letterSpacing: "0.2px",
  },
  /* SECTIONS */
  section: { padding: "36px 24px 0" },
  secHead: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  secTitle: { fontSize: 16, fontWeight: 500, color: "#1a1a1a" },
  secTag: {
    fontSize: 12,
    color: "#534AB7",
    background: "#EEEDFE",
    border: "0.5px solid #CECBF6",
    padding: "3px 10px",
    borderRadius: 20,
  },
  /* STEPS */
  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 10,
  },
  stepCard: {
    background: "#fff",
    border: "0.5px solid #e5e5e5",
    borderRadius: 12,
    padding: "20px 16px",
  },
  stepNum: {
    fontSize: 11,
    fontWeight: 500,
    color: "#7F77DD",
    background: "#EEEDFE",
    width: 24,
    height: 24,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  stepH4: { fontSize: 13, fontWeight: 500, marginBottom: 4, color: "#1a1a1a" },
  stepP: { fontSize: 12, color: "#666", lineHeight: 1.5 },
  /* EARN */
  earnGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
  },
  earnCard: {
    background: "#fff",
    border: "0.5px solid #e5e5e5",
    borderRadius: 12,
    padding: "24px 20px",
  },
  earnIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  earnH3: { fontSize: 15, fontWeight: 500, marginBottom: 8, color: "#1a1a1a" },
  earnPill: {
    display: "inline-block",
    fontSize: 11,
    fontWeight: 500,
    padding: "3px 10px",
    borderRadius: 20,
    marginBottom: 12,
  },
  earnP: { fontSize: 13, color: "#555", lineHeight: 1.6 },
  earnRate: {
    display: "flex",
    alignItems: "baseline",
    gap: 4,
    marginTop: 14,
    paddingTop: 12,
    borderTop: "0.5px solid #e5e5e5",
  },
  earnRateNum: { fontSize: 20, fontWeight: 500 },
  earnRateLbl: { fontSize: 12, color: "#888" },
  /* BOTTOM */
  bottomRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    padding: "36px 24px 0",
  },
  convCard: {
    background: "#fff",
    border: "0.5px solid #e5e5e5",
    borderRadius: 12,
    padding: 24,
  },
  convH3: { fontSize: 15, fontWeight: 500, marginBottom: 18, color: "#1a1a1a" },
  convRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "11px 0",
  },
  convKey: { fontSize: 13, color: "#888" },
  convVal: { fontSize: 13, fontWeight: 500, color: "#534AB7" },
  /* SCRATCH */
  scratchCard: {
    background: "#E1F5EE",
    border: "0.5px solid #9FE1CB",
    borderRadius: 12,
    padding: 24,
    display: "flex",
    flexDirection: "column",
  },
  scratchH3: { fontSize: 15, fontWeight: 500, color: "#085041", marginBottom: 6 },
  scratchP: { fontSize: 13, color: "#0F6E56", lineHeight: 1.6, marginBottom: 20 },
  scratchCardsRow: { display: "flex", gap: 8, marginBottom: 20, flex: 1 },
  sc: {
    flex: 1,
    borderRadius: 8,
    border: "1.5px dashed #5DCAA5",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 8px",
    gap: 6,
  },
  scTxt: { fontSize: 11, color: "#0F6E56", fontWeight: 500 },
  scSub: { fontSize: 10, color: "#1D9E75" },
  scratchBtn: {
    background: "#0F6E56",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    alignSelf: "flex-start",
  },
  /* REFERRAL */
  referStrip: {
    margin: "12px 24px 0",
    background: "#FAEEDA",
    border: "0.5px solid #FAC775",
    borderRadius: 12,
    padding: "20px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
  },
  referH4: { fontSize: 15, fontWeight: 500, color: "#412402", marginBottom: 4 },
  referP: { fontSize: 13, color: "#633806", lineHeight: 1.5 },
  referBtn: {
    background: "#854F0B",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
};

export default Rewards;