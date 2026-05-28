interface PasswordStrengthMeterProps {
  password: string;
}

const getPasswordStrength = (password: string) => {
  if (!password) return { score: 0, label: "", color: "bg-slate-200" };

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  const levels = [
    { score: 0, label: "No password", color: "bg-slate-200" },
    { score: 1, label: "Weak", color: "bg-red-500" },
    { score: 2, label: "Fair", color: "bg-orange-500" },
    { score: 3, label: "Good", color: "bg-yellow-500" },
    { score: 4, label: "Strong", color: "bg-lime-500" },
    { score: 5, label: "Very Strong", color: "bg-green-500" },
  ];

  return levels[score] || levels[5];
};

const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const strength = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all ${
              i < strength.score ? strength.color : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      <p className="text-xs font-medium text-slate-600">
        Strength: <span className={`${strength.color.replace("bg-", "text-")}`}>{strength.label}</span>
      </p>
    </div>
  );
};

export default PasswordStrengthMeter;
